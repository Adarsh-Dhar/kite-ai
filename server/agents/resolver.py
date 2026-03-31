"""
server/agents/resolver.py — Market Resolver Agent (v2)
=======================================================
Polls the database for OPEN markets and autonomously resolves them on-chain
using deterministic tool calls keyed by each market's `resolution_type`.

Architecture:
  ┌──────────────────────────────────────────────────────┐
  │  resolve_cycle()                                     │
  │    ↓ Load OPEN markets from DB                       │
  │    ↓ For each: route to correct tool                 │
  │      ├─ GITHUB_PR      → GitHubTools.get_pr_state   │
  │      ├─ GITHUB_RELEASE → GitHubTools.get_release_tag│
  │      ├─ GITHUB_ISSUE   → GitHubTools.get_issue_state│
  │      ├─ CI_METRIC      → GitHubTools.get_check_runs │
  │      ├─ CVE_SECURITY   → SecurityTools.search_cves  │
  │      ├─ WEB3_RPC       → Web3Tools.get_event_count  │
  │      ├─ DAO_GOVERNANCE → GovernanceTools.snapshot   │
  │      └─ LLM_JUDGE      → LLM text evaluation        │
  │    ↓ Decision: YES / NO / INVALID / PENDING         │
  │    ↓ Push to chain: KiteClient.resolve_onchain_market│
  │    ↓ Write ResolutionLog to DB                      │
  └──────────────────────────────────────────────────────┘

Failsafes:
  • API failure → skip + retry later (grace period with exponential backoff)
  • 404 persistent → INVALID (refund users)
  • LLM judge uncertain → INVALID
  • 10 consecutive failures → INVALID
  • Past deadline + no resolution → INVALID
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import httpx
from datetime import datetime, timezone, timedelta
from typing import Any

log = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────

RESOLUTION_INTERVAL_SECONDS = 15 * 60   # 15 minutes between full cycles
MAX_RESOLVE_ATTEMPTS = 10               # After this, force INVALID
BASE_RETRY_DELAY_MINUTES = 30           # First retry delay
MAX_RETRY_DELAY_HOURS = 24              # Cap backoff at 24 hours
GRACE_PERIOD_HOURS = 6                  # Extra time after deadline before forcing INVALID


class ResolverAgent:
    """
    Autonomous market resolver. Injected with tool libraries at construction.
    """

    def __init__(
        self,
        kite_client: Any,
        github_token: str,
        llm_api_key: str = "",
        llm_endpoint: str = "https://api.groq.com/openai/v1/chat/completions",
        llm_model: str = "llama-3.3-70b-versatile",
        rpc_url: str = "https://rpc-testnet.gokite.ai",
        repo_owner: str = "anza-xyz",
        repo_name: str = "agave",
        nvd_api_key: str = "",
    ) -> None:
        self._kite = kite_client
        self._github_token = github_token
        self._llm_api_key = llm_api_key
        self._llm_endpoint = llm_endpoint
        self._llm_model = llm_model
        self._rpc_url = rpc_url
        self._repo_owner = repo_owner
        self._repo_name = repo_name
        self._nvd_api_key = nvd_api_key

        # Shared HTTP client (initialised lazily per cycle)
        self._http: httpx.AsyncClient | None = None

    # ── Main loop ─────────────────────────────────────────────────────────────

    async def run_loop(self) -> None:
        """Entry point — runs forever. Called from main.py lifespan."""
        await asyncio.sleep(15)  # Wait for startup to settle
        while True:
            try:
                await self.resolve_cycle()
            except asyncio.CancelledError:
                break
            except Exception as exc:
                log.error("Resolver cycle crashed: %s", exc, exc_info=True)
            await asyncio.sleep(RESOLUTION_INTERVAL_SECONDS)

    async def resolve_cycle(self) -> dict[str, Any]:
        """
        One full resolution pass. Returns a summary dict.
        """
        from db import db
        from tools.github_tools import GitHubTools
        from tools.web3_tools import Web3Tools, GovernanceTools
        from tools.security_tools import SecurityTools

        now = datetime.now(timezone.utc)

        # Lazily create HTTP client
        if self._http is None or self._http.is_closed:
            self._http = httpx.AsyncClient(timeout=30.0)

        gh = GitHubTools(self._http, self._github_token)
        w3 = Web3Tools(self._rpc_url)
        gov = GovernanceTools(self._http)
        sec = SecurityTools(self._http, self._nvd_api_key)

        # Load all OPEN markets eligible for this cycle
        markets = await db.market.find_many(
            where={
                "status": "OPEN",
                "OR": [
                    {"nextRetryAt": None},
                    {"nextRetryAt": {"lte": now}},
                ],
            }
        )

        log.info("Resolver cycle: checking %d open markets.", len(markets))

        resolved = 0
        pending = 0
        errors = 0
        forced_invalid = 0

        for market in markets:
            try:
                result = await self._resolve_one(market, gh, w3, gov, sec, now)
            except Exception as exc:
                log.error("Error resolving market %s: %s", market.id, exc)
                result = {"decision": "ERROR", "error": str(exc)}

            decision = result.get("decision", "ERROR")

            if decision == "PENDING":
                pending += 1
                continue

            if decision == "ERROR":
                errors += 1
                await self._handle_retry(market, result.get("error", "Unknown error"))
                continue

            if decision in ("YES", "NO", "INVALID"):
                # Check if past deadline + grace period → force INVALID
                if decision == "INVALID" and market.resolutionDeadline:
                    deadline_with_grace = market.resolutionDeadline + timedelta(hours=GRACE_PERIOD_HOURS)
                    if now < market.resolutionDeadline:
                        # Not yet past deadline — keep as PENDING unless explicitly INVALID
                        if result.get("reason") != "forced":
                            await self._handle_retry(market, "Not yet past deadline")
                            pending += 1
                            continue

                # Push to chain
                try:
                    tx = await self._kite.resolve_onchain_market(
                        market.onchainMarketId, decision
                    )
                    await self._finalize_market(market, decision, result, tx)
                    resolved += 1
                    log.info(
                        "✅ Resolved market %s (onchain=%s) → %s  tx=%s",
                        market.id,
                        market.onchainMarketId,
                        decision,
                        tx.get("tx_hash", "mock"),
                    )
                except Exception as exc:
                    log.error("On-chain resolution failed for market %s: %s", market.id, exc)
                    await self._handle_retry(market, f"On-chain tx failed: {exc}")
                    errors += 1

        log.info(
            "Resolver cycle complete: resolved=%d pending=%d errors=%d forced_invalid=%d",
            resolved, pending, errors, forced_invalid,
        )
        return {
            "resolved": resolved,
            "pending": pending,
            "errors": errors,
            "forced_invalid": forced_invalid,
        }

    # ── Strategy Router ───────────────────────────────────────────────────────

    async def _resolve_one(
        self,
        market: Any,
        gh: Any,
        w3: Any,
        gov: Any,
        sec: Any,
        now: datetime,
    ) -> dict[str, Any]:
        """
        Route the market to the correct resolution tool based on resolution_type.
        Returns: { decision: "YES"|"NO"|"INVALID"|"PENDING"|"ERROR", reasoning, raw_response }
        """
        from db import db

        res_type = market.resolutionType
        logic: dict = market.evaluationLogic or {}
        url: str = market.dataSourceUrl or ""

        # ── Check hard deadline ────────────────────────────────────────────────
        if market.resolutionDeadline:
            grace_deadline = market.resolutionDeadline + timedelta(hours=GRACE_PERIOD_HOURS)
            if now > grace_deadline:
                log.warning(
                    "Market %s is past deadline+grace — forcing INVALID.", market.id
                )
                return {
                    "decision": "INVALID",
                    "reasoning": "Resolution deadline + grace period exceeded with no deterministic outcome.",
                    "reason": "forced",
                }

        # ── Check attempt limit ────────────────────────────────────────────────
        if market.resolveAttempts >= MAX_RESOLVE_ATTEMPTS:
            log.warning(
                "Market %s exceeded max attempts (%d) — forcing INVALID.",
                market.id, MAX_RESOLVE_ATTEMPTS,
            )
            return {
                "decision": "INVALID",
                "reasoning": f"Exceeded maximum resolution attempts ({MAX_RESOLVE_ATTEMPTS}).",
                "reason": "forced",
            }

        # ── Route by resolution type ───────────────────────────────────────────

        if res_type == "GITHUB_PR":
            return await self._resolve_github_pr(url, logic, gh)

        elif res_type == "GITHUB_RELEASE":
            return await self._resolve_github_release(url, logic, gh)

        elif res_type == "GITHUB_ISSUE":
            return await self._resolve_github_issue(url, logic, gh)

        elif res_type == "CI_METRIC":
            return await self._resolve_ci_metric(url, logic, gh)

        elif res_type == "CVE_SECURITY":
            return await self._resolve_cve_security(url, logic, sec)

        elif res_type == "WEB3_RPC":
            return await self._resolve_web3_rpc(url, logic, w3)

        elif res_type == "DAO_GOVERNANCE":
            return await self._resolve_dao_governance(url, logic, gov)

        elif res_type == "LLM_JUDGE":
            return await self._resolve_llm_judge(url, logic)

        else:
            return {
                "decision": "INVALID",
                "reasoning": f"Unknown resolution_type: {res_type}",
                "reason": "forced",
            }

    # ── Resolver Implementations ──────────────────────────────────────────────

    async def _resolve_github_pr(
        self, url: str, logic: dict, gh: Any
    ) -> dict[str, Any]:
        """
        GITHUB_PR: Checks PR merged/closed state.
        """
        # Parse owner/repo/number from URL
        match = re.search(r"repos/([^/]+)/([^/]+)/pulls/(\d+)", url)
        if not match:
            return {"decision": "ERROR", "error": f"Cannot parse PR URL: {url}"}

        owner, repo, pr_num = match.group(1), match.group(2), int(match.group(3))
        data = await gh.get_pr_state(owner, repo, pr_num)

        if data is None:
            return {"decision": "ERROR", "error": f"GitHub API returned None for PR #{pr_num}"}

        if data.get("merged") is True:
            return {
                "decision": "YES",
                "reasoning": f"PR #{pr_num} was merged at {data.get('mergedAt')}.",
                "raw_response": data,
            }
        elif data.get("state") == "closed" and not data.get("merged"):
            return {
                "decision": "NO",
                "reasoning": f"PR #{pr_num} was closed without merging.",
                "raw_response": data,
            }
        else:
            return {
                "decision": "PENDING",
                "reasoning": f"PR #{pr_num} is still open (state={data.get('state')}).",
                "raw_response": data,
            }

    async def _resolve_github_release(
        self, url: str, logic: dict, gh: Any
    ) -> dict[str, Any]:
        """
        GITHUB_RELEASE: Checks if a specific release tag exists.
        """
        tag_pattern = logic.get("tag_pattern", "")

        # Try to parse owner/repo from URL
        match = re.search(r"repos/([^/]+)/([^/]+)", url)
        if not match:
            return {"decision": "ERROR", "error": f"Cannot parse repo from URL: {url}"}

        owner, repo = match.group(1), match.group(2)

        # Try exact tag first
        exact_tag = re.search(r"tags/([^?]+)", url)
        if exact_tag:
            tag_name = exact_tag.group(1)
            data = await gh.get_release_tag(owner, repo, tag_name)
            if data and not data.get("draft"):
                return {
                    "decision": "YES",
                    "reasoning": f"Tag {tag_name} published at {data.get('published_at')}.",
                    "raw_response": data,
                }
            return {"decision": "PENDING", "reasoning": f"Tag {tag_name} not yet published."}

        # Pattern match against recent tags
        if tag_pattern:
            tags = await gh.list_recent_tags(owner, repo, limit=30)
            pattern = re.compile(tag_pattern.replace("*", ".*").replace(".", r"\."))
            for tag in tags:
                if pattern.match(tag["name"]):
                    return {
                        "decision": "YES",
                        "reasoning": f"Tag matching '{tag_pattern}' found: {tag['name']}",
                        "raw_response": tag,
                    }
            return {
                "decision": "PENDING",
                "reasoning": f"No tag matching pattern '{tag_pattern}' found yet.",
            }

        return {"decision": "ERROR", "error": "No tag_pattern or exact tag in evaluation_logic"}

    async def _resolve_github_issue(
        self, url: str, logic: dict, gh: Any
    ) -> dict[str, Any]:
        """
        GITHUB_ISSUE: Checks issue closed/completed state.
        """
        match = re.search(r"repos/([^/]+)/([^/]+)/issues/(\d+)", url)
        if not match:
            return {"decision": "ERROR", "error": f"Cannot parse issue URL: {url}"}

        owner, repo, issue_num = match.group(1), match.group(2), int(match.group(3))
        data = await gh.get_issue_state(owner, repo, issue_num)

        if data is None:
            return {"decision": "ERROR", "error": f"Issue #{issue_num} not found"}

        state = data.get("state", "")
        state_reason = data.get("state_reason", "")

        if state == "closed" and state_reason == "completed":
            return {
                "decision": "YES",
                "reasoning": f"Issue #{issue_num} closed as 'completed'.",
                "raw_response": data,
            }
        elif state == "closed" and state_reason in ("not_planned", "duplicate"):
            return {
                "decision": "NO",
                "reasoning": f"Issue #{issue_num} closed as '{state_reason}'.",
                "raw_response": data,
            }
        else:
            return {
                "decision": "PENDING",
                "reasoning": f"Issue #{issue_num} is still open.",
                "raw_response": data,
            }

    async def _resolve_ci_metric(
        self, url: str, logic: dict, gh: Any
    ) -> dict[str, Any]:
        """
        CI_METRIC: Reads CI/CD artifact data and evaluates a numeric threshold.

        evaluation_logic expected keys:
          metric_name, artifact_name, json_path, operator, threshold
        """
        match = re.search(r"repos/([^/]+)/([^/]+)", url)
        if not match:
            return {"decision": "ERROR", "error": f"Cannot parse repo from CI URL: {url}"}

        owner, repo = match.group(1), match.group(2)

        # Get PR number from logic or URL
        pr_number = logic.get("pr_number")
        commit_sha = logic.get("commit_sha")

        if not commit_sha and not pr_number:
            return {"decision": "ERROR", "error": "CI_METRIC needs commit_sha or pr_number in evaluation_logic"}

        # Get check runs for this commit
        check_name = logic.get("check_name")
        runs = await gh.get_check_runs(owner, repo, commit_sha or "", check_name)

        if not runs:
            return {"decision": "PENDING", "reasoning": "CI check runs not yet available."}

        # Find the relevant completed run
        completed = [r for r in runs if r["status"] == "completed"]
        if not completed:
            return {"decision": "PENDING", "reasoning": "CI runs still in progress."}

        # Try to download and parse artifact
        artifact_name = logic.get("artifact_name", "")
        metric_key = logic.get("metric_name", "")
        operator = logic.get("operator", ">=")
        threshold = float(logic.get("threshold", 0))

        # Find a matching run with artifacts
        for run in completed:
            run_id = run.get("id")
            if not run_id:
                continue
            artifacts = await gh.get_workflow_run_artifacts(owner, repo, run_id)
            for artifact in artifacts:
                if artifact_name and artifact_name.lower() not in artifact.get("name", "").lower():
                    continue
                artifact_data = await gh.download_artifact_json(owner, repo, artifact["id"])
                if not artifact_data:
                    continue

                # Extract metric value using simple key path
                json_path = logic.get("json_path", f"$.{metric_key}")
                value = _extract_json_path(artifact_data, json_path)

                if value is None:
                    continue

                # Evaluate threshold
                passed = _evaluate_operator(float(value), operator, threshold)
                decision = "YES" if passed else "NO"
                return {
                    "decision": decision,
                    "reasoning": (
                        f"CI metric '{metric_key}' = {value} "
                        f"{'passes' if passed else 'fails'} "
                        f"threshold {operator} {threshold}"
                    ),
                    "raw_response": {"value": value, "threshold": threshold, "operator": operator},
                }

        return {
            "decision": "PENDING",
            "reasoning": "Matching CI artifact not yet available.",
        }

    async def _resolve_cve_security(
        self, url: str, logic: dict, sec: Any
    ) -> dict[str, Any]:
        """
        CVE_SECURITY: Checks NVD/GHSA for a matching critical vulnerability.
        """
        keyword = logic.get("keyword", "agave")
        min_severity = logic.get("min_severity", "CRITICAL")
        specific_cve = logic.get("cve_id")

        if specific_cve:
            # Look up a specific CVE
            data = await sec.lookup_cve(specific_cve)
            if data and sec.is_critical(data.get("base_severity")):
                return {
                    "decision": "YES",
                    "reasoning": f"{specific_cve} found with severity {data.get('base_severity')}",
                    "raw_response": data,
                }
            elif data:
                return {
                    "decision": "NO",
                    "reasoning": f"{specific_cve} found but severity {data.get('base_severity')} < {min_severity}",
                }
            return {"decision": "PENDING", "reasoning": f"{specific_cve} not yet published."}

        # Keyword search
        results = await sec.search_cves_by_keyword(keyword, severity=min_severity)
        if results:
            latest = results[0]
            return {
                "decision": "YES",
                "reasoning": (
                    f"Found {len(results)} CVE(s) matching '{keyword}' "
                    f"with severity >= {min_severity}. Latest: {latest.get('cve_id')}"
                ),
                "raw_response": latest,
            }

        # Also check OSV
        osv_results = await sec.query_osv(keyword)
        critical_osv = [
            v for v in osv_results
            if any(
                s.get("type") == "CVSS_V3" and float(s.get("score", 0)) >= 9.0
                for s in v.get("severity", [])
            )
        ]
        if critical_osv:
            return {
                "decision": "YES",
                "reasoning": f"Found critical OSV advisory for '{keyword}'",
                "raw_response": critical_osv[0],
            }

        return {
            "decision": "PENDING",
            "reasoning": f"No {min_severity} CVE found for '{keyword}' yet.",
        }

    async def _resolve_web3_rpc(
        self, url: str, logic: dict, w3: Any
    ) -> dict[str, Any]:
        """
        WEB3_RPC: Queries the blockchain for a specific condition.
        """
        method = logic.get("method", "event_count")

        if method == "event_count":
            contract_addr = logic.get("contract_address", "")
            event_name = logic.get("event_name", "")
            threshold = int(logic.get("threshold", 0))

            if not contract_addr or not event_name:
                return {"decision": "ERROR", "error": "WEB3_RPC needs contract_address and event_name"}

            # Minimal ABI for the event — resolver must know the event signature
            abi = logic.get("abi", [])
            count = await w3.get_event_count(
                contract_addr, abi, event_name,
                from_block=logic.get("from_block", 0),
            )
            if count is None:
                return {"decision": "ERROR", "error": "Could not fetch event count from RPC"}

            if count >= threshold:
                return {
                    "decision": "YES",
                    "reasoning": f"Event '{event_name}' count={count} >= threshold={threshold}",
                    "raw_response": {"count": count, "threshold": threshold},
                }
            return {
                "decision": "PENDING",
                "reasoning": f"Event count {count} < threshold {threshold}",
            }

        elif method == "block_exists":
            slot = logic.get("slot")
            rpc_url = logic.get("rpc_url", url)
            if slot:
                block = await w3.get_solana_block(rpc_url, int(slot))
                if block:
                    return {
                        "decision": "YES",
                        "reasoning": f"Solana block/slot {slot} exists.",
                        "raw_response": block,
                    }
                return {"decision": "PENDING", "reasoning": f"Block {slot} not yet finalized."}

        elif method == "contract_call":
            contract_addr = logic.get("contract_address", "")
            function_name = logic.get("function_name", "")
            abi = logic.get("abi", [])
            args = logic.get("args", [])
            operator = logic.get("operator", ">=")
            threshold = logic.get("threshold", 0)

            result = await w3.call_contract_function(contract_addr, abi, function_name, args)
            if result is None:
                return {"decision": "ERROR", "error": "Contract call returned None"}

            passed = _evaluate_operator(float(result), operator, float(threshold))
            return {
                "decision": "YES" if passed else "PENDING",
                "reasoning": f"{function_name}() = {result} {operator} {threshold}: {passed}",
                "raw_response": {"result": str(result)},
            }

        return {"decision": "ERROR", "error": f"Unknown WEB3_RPC method: {method}"}

    async def _resolve_dao_governance(
        self, url: str, logic: dict, gov: Any
    ) -> dict[str, Any]:
        """
        DAO_GOVERNANCE: Checks Snapshot or SIMD proposal outcomes.
        """
        proposal_id = logic.get("proposal_id")
        space = logic.get("space", "")
        simd_number = logic.get("simd_number")

        if simd_number:
            data = await gov.get_simd_proposal_status(int(simd_number))
            if not data:
                return {"decision": "PENDING", "reasoning": f"SIMD-{simd_number} not found yet."}
            if data.get("merged"):
                return {"decision": "YES", "reasoning": f"SIMD-{simd_number} was merged/accepted.", "raw_response": data}
            if data.get("state") == "closed" and not data.get("merged"):
                return {"decision": "NO", "reasoning": f"SIMD-{simd_number} was closed/rejected.", "raw_response": data}
            return {"decision": "PENDING", "reasoning": f"SIMD-{simd_number} still open.", "raw_response": data}

        if proposal_id:
            data = await gov.get_snapshot_proposal(space, proposal_id)
            if not data:
                return {"decision": "ERROR", "error": f"Snapshot proposal {proposal_id} not found"}

            state = data.get("state")
            quorum_reached = data.get("quorum_reached", False)
            scores = data.get("scores", [])
            quorum_required = logic.get("quorum_required", 0)

            if quorum_required > 0 and not quorum_reached:
                if state == "closed":
                    return {
                        "decision": "INVALID",
                        "reasoning": f"Proposal {proposal_id} closed but quorum not reached.",
                        "raw_response": data,
                    }
                return {"decision": "PENDING", "reasoning": "Waiting for quorum."}

            if state == "closed":
                if len(scores) >= 2:
                    yes_wins = scores[0] > scores[1]
                    return {
                        "decision": "YES" if yes_wins else "NO",
                        "reasoning": (
                            f"Proposal closed. Choice 0: {scores[0]:.2f} vs "
                            f"Choice 1: {scores[1]:.2f}"
                        ),
                        "raw_response": data,
                    }
                return {"decision": "INVALID", "reasoning": "Proposal closed but no valid scores."}

            return {"decision": "PENDING", "reasoning": f"Proposal state: {state}"}

        return {"decision": "ERROR", "error": "DAO_GOVERNANCE needs proposal_id or simd_number"}

    async def _resolve_llm_judge(
        self, url: str, logic: dict
    ) -> dict[str, Any]:
        """
        LLM_JUDGE: Fallback resolver — fetches a URL and asks the LLM.
        Returns YES/NO/INVALID. UNCERTAIN → INVALID (hardcoded failsafe).
        """
        fetch_urls = logic.get("fetch_urls", [url])
        question = logic.get("question", "Did the event described happen?")
        uncertainty_action = logic.get("uncertainty_action", "INVALID")

        # Fetch context
        context_parts = []
        async with httpx.AsyncClient(timeout=20.0) as client:
            for fetch_url in fetch_urls[:3]:  # Max 3 sources
                try:
                    resp = await client.get(fetch_url)
                    if resp.status_code == 200:
                        # Truncate large responses
                        text = resp.text[:3000]
                        context_parts.append(f"Source: {fetch_url}\n{text}")
                except Exception as exc:
                    log.warning("LLM judge fetch failed for %s: %s", fetch_url, exc)

        if not context_parts:
            return {"decision": "ERROR", "error": "LLM judge: could not fetch any context"}

        context = "\n\n---\n\n".join(context_parts)

        prompt = f"""You are an autonomous market resolution judge.

Question: {question}

Evidence fetched from the web:
{context}

Based ONLY on the evidence above, answer with a single JSON object:
{{ "decision": "YES" | "NO" | "UNCERTAIN", "reasoning": "1-2 sentence explanation" }}

Rules:
- If the evidence clearly proves the event happened → YES
- If the evidence clearly proves it did NOT happen → NO
- If the evidence is ambiguous, missing, or unclear → UNCERTAIN

Respond with ONLY valid JSON. No markdown."""

        if not self._llm_api_key:
            return {"decision": uncertainty_action, "reasoning": "LLM judge unavailable — no API key."}

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    self._llm_endpoint,
                    headers={
                        "Authorization": f"Bearer {self._llm_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self._llm_model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.1,
                        "max_tokens": 256,
                        "response_format": {"type": "json_object"},
                    },
                )
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
                parsed = json.loads(re.sub(r"```json|```", "", content).strip())
                decision = parsed.get("decision", "UNCERTAIN").upper()
                reasoning = parsed.get("reasoning", "")

                # Failsafe: UNCERTAIN → uncertainty_action (usually INVALID)
                if decision == "UNCERTAIN":
                    decision = uncertainty_action.upper()
                    reasoning = f"LLM judge returned UNCERTAIN → defaulting to {decision}. {reasoning}"

                return {"decision": decision, "reasoning": reasoning, "raw_response": parsed}

        except Exception as exc:
            log.error("LLM judge API error: %s", exc)
            return {"decision": "ERROR", "error": f"LLM judge failed: {exc}"}

    # ── DB Helpers ────────────────────────────────────────────────────────────

    async def _handle_retry(self, market: Any, error_msg: str) -> None:
        """Increment attempt counter and schedule next retry with exponential backoff."""
        from db import db

        attempts = (market.resolveAttempts or 0) + 1
        delay_minutes = min(
            BASE_RETRY_DELAY_MINUTES * (2 ** (attempts - 1)),
            MAX_RETRY_DELAY_HOURS * 60,
        )
        next_retry = datetime.now(timezone.utc) + timedelta(minutes=delay_minutes)

        await db.market.update(
            where={"id": market.id},
            data={
                "resolveAttempts": attempts,
                "lastAttemptAt": datetime.now(timezone.utc),
                "nextRetryAt": next_retry,
                "lastError": error_msg[:1000],
            },
        )

        await db.resolutionlog.create(
            data={
                "marketId": market.id,
                "attemptNumber": attempts,
                "resolverType": market.resolutionType,
                "decision": "ERROR",
                "reasoning": error_msg,
                "error": error_msg,
            }
        )

        log.info(
            "Market %s retry scheduled in %dm (attempt #%d): %s",
            market.id, delay_minutes, attempts, error_msg[:80],
        )

    async def _finalize_market(
        self,
        market: Any,
        decision: str,
        result: dict,
        tx: dict,
    ) -> None:
        """Update DB after a successful on-chain resolution."""
        from db import db

        outcome_map = {"YES": "YES", "NO": "NO", "INVALID": "INVALID"}

        await db.market.update(
            where={"id": market.id},
            data={
                "status": "RESOLVED",
                "outcome": outcome_map.get(decision, "INVALID"),
                "resolvedAt": datetime.now(timezone.utc),
                "resolutionTxHash": tx.get("tx_hash"),
                "resolutionNote": result.get("reasoning", "")[:1000],
            },
        )

        await db.resolutionlog.create(
            data={
                "marketId": market.id,
                "attemptNumber": (market.resolveAttempts or 0) + 1,
                "resolverType": market.resolutionType,
                "rawResponse": result.get("raw_response"),
                "decision": decision,
                "reasoning": result.get("reasoning", ""),
                "txHash": tx.get("tx_hash"),
                "blockNumber": tx.get("block_number"),
            }
        )


# ── Module-level entry point ──────────────────────────────────────────────────

async def continuous_resolver_loop(kite_client: Any, settings: Any) -> None:
    """
    Backwards-compatible entry point used from main.py.
    Constructs a ResolverAgent and runs it.
    """
    agent = ResolverAgent(
        kite_client=kite_client,
        github_token=settings.github_token,
        llm_api_key=settings.llm_api_key,
        rpc_url=settings.kite_rpc_url,
        repo_owner=settings.github_repo_owner,
        repo_name=settings.github_repo_name,
    )
    await agent.run_loop()


# ── Utilities ─────────────────────────────────────────────────────────────────

def _extract_json_path(data: Any, path: str) -> Any:
    """
    Very simple JSONPath-like extractor.
    Supports: "$.key", "$.key.subkey", "$.array[0].key"
    """
    if not path.startswith("$"):
        return data.get(path) if isinstance(data, dict) else None
    parts = path.lstrip("$.").split(".")
    current = data
    for part in parts:
        if not part:
            continue
        # Handle array index: key[0]
        arr_match = re.match(r"(.+)\[(\d+)\]", part)
        if arr_match:
            key, idx = arr_match.group(1), int(arr_match.group(2))
            if isinstance(current, dict):
                current = current.get(key, [])
            if isinstance(current, list) and idx < len(current):
                current = current[idx]
            else:
                return None
        elif isinstance(current, dict):
            current = current.get(part)
        else:
            return None
        if current is None:
            return None
    return current


def _evaluate_operator(value: float, operator: str, threshold: float) -> bool:
    """Evaluate a numeric comparison."""
    ops = {
        ">=": lambda a, b: a >= b,
        ">":  lambda a, b: a > b,
        "<=": lambda a, b: a <= b,
        "<":  lambda a, b: a < b,
        "==": lambda a, b: a == b,
        "!=": lambda a, b: a != b,
    }
    fn = ops.get(operator)
    return fn(value, threshold) if fn else False