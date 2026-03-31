"""
agent/architect.py — Market Architect (v2 — with DB-linked resolution strategy)
=================================================================================
Two responsibilities:
  1. TSS Filter — Score every PR with a Technical Significance Score.
  2. Market Generator — Call LLM to convert high-signal PRs into structured
     prediction market JSON objects WITH deterministic resolution strategies.

New in v2:
  • LLM must output resolution_type, data_source_url, evaluation_logic
  • Strict validation of all resolution fields
  • save_to_db() links the proposal to the Prisma Market record
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

log = logging.getLogger(__name__)

# ── TSS scoring weights ───────────────────────────────────────────────────────

_SIGNAL_KEYWORDS: dict[str, float] = {
    "alpenglow": 0.40, "turbine": 0.25, "consensus": 0.25,
    "vote": 0.20, "leader": 0.15, "fork": 0.20, "replay": 0.20,
    "simd": 0.35, "sip": 0.20,
    "breaking": 0.30, "breaking change": 0.35, "incompatible": 0.25, "deprecat": 0.15,
    "runtime": 0.20, "bpf": 0.20, "sbf": 0.20, "loader": 0.15,
    "scheduler": 0.20, "banking stage": 0.25, "accounts db": 0.20,
    "snapshot": 0.15, "perf": 0.10,
    "cve": 0.40, "security": 0.30, "vuln": 0.30,
    "release": 0.15, "upgrade": 0.15, "migration": 0.15,
}

_NOISE_KEYWORDS: dict[str, float] = {
    "typo": -0.60, "readme": -0.55, "docs": -0.50, "documentation": -0.50,
    "changelog": -0.30, "clippy": -0.30, "fmt": -0.25, "format": -0.25,
    "whitespace": -0.30, "ui": -0.20, "bump version": -0.20,
    "dependabot": -0.40, "ci": -0.20, "github action": -0.25, "test only": -0.30,
}

_CORE_PATH_PATTERNS: list[tuple[re.Pattern[str], float]] = [
    (re.compile(r"consensus/"), 0.30),
    (re.compile(r"alpenglow/"), 0.40),
    (re.compile(r"runtime/"), 0.25),
    (re.compile(r"bpf/|sbf/"), 0.20),
    (re.compile(r"accounts.?db/"), 0.20),
    (re.compile(r"banking.?stage"), 0.20),
    (re.compile(r"turbine/"), 0.20),
    (re.compile(r"vote/"), 0.15),
    (re.compile(r"sdk/program/"), 0.15),
    (re.compile(r"\.md$"), -0.15),
    (re.compile(r"docs/"), -0.30),
    (re.compile(r"\.github/"), -0.20),
]

DEFAULT_MIN_TSS = 0.65

# Valid resolution types (must match Prisma enum)
VALID_RESOLUTION_TYPES = {
    "GITHUB_PR", "GITHUB_RELEASE", "GITHUB_ISSUE",
    "CI_METRIC", "CVE_SECURITY", "WEB3_RPC",
    "DAO_GOVERNANCE", "LLM_JUDGE",
}

_MARKET_GENERATION_PROMPT = """\
You are a crypto prediction market specialist with deep expertise in Solana blockchain development.

Analyse the following merged Pull Request from the anza-xyz/agave repository and generate a structured prediction market proposal.

## Pull Request Details
- **Number**: #{number}
- **Title**: {title}
- **Author**: {author}
- **Labels**: {labels}
- **Files Changed**: {changed_files_count} files (+{additions}/-{deletions} lines)
- **Key Files**: {key_files}
- **Body Summary**: {body_snippet}
- **TSS Score**: {tss_score:.2f} / 1.00

## Your Task
Generate a JSON object with these EXACT keys — all are required:

1. "title" — A concise, technical, market-worthy title (max 80 chars). Must be specific to this change.

2. "description" — A binary Yes/No prediction question about a concrete, verifiable future outcome
   related to this PR's deployment or impact. Be specific about timelines or metrics where possible.

3. "options" — Always exactly ["Yes", "No"]

4. "agent_reason" — 2-3 sentences explaining: (a) what this PR changes at a technical level,
   (b) why it's market-worthy, and (c) what evidence would resolve the market.

5. "resolution_type" — One of these exact strings (choose the BEST fit):
   - "GITHUB_PR"       — market resolves by checking if a PR was merged/closed
   - "GITHUB_RELEASE"  — market resolves by checking if a release tag was published
   - "GITHUB_ISSUE"    — market resolves by checking if a GitHub issue was closed as "completed"
   - "CI_METRIC"       — market resolves by reading CI/CD artifact data (coverage, benchmarks, bundle size)
   - "CVE_SECURITY"    — market resolves by monitoring for a CVE advisory publication
   - "WEB3_RPC"        — market resolves by querying on-chain data via an RPC node
   - "DAO_GOVERNANCE"  — market resolves by checking a Snapshot or on-chain governance vote
   - "LLM_JUDGE"       — fallback: market resolves by having an LLM read a URL and judge the outcome

6. "data_source_url" — The EXACT API URL used to verify the outcome. Must be a real, callable URL.
   Examples:
   - GITHUB_PR: "https://api.github.com/repos/anza-xyz/agave/pulls/11532"
   - GITHUB_RELEASE: "https://api.github.com/repos/anza-xyz/agave/releases/tags/v2.1.0"
   - GITHUB_ISSUE: "https://api.github.com/repos/anza-xyz/agave/issues/8902"
   - CI_METRIC: "https://api.github.com/repos/anza-xyz/agave/actions/runs" (resolver will find latest run)
   - CVE_SECURITY: "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=agave"
   - WEB3_RPC: "https://rpc-testnet.gokite.ai" (resolver calls eth_getLogs or contract functions)
   - DAO_GOVERNANCE: "https://hub.snapshot.org/graphql"

7. "evaluation_logic" — A JSON object with deterministic machine-readable resolution rules.
   The shape depends on resolution_type:

   For GITHUB_PR:
   {{ "check": "merged", "yes_condition": "merged == true", "no_condition": "state == closed AND merged == false" }}

   For GITHUB_RELEASE:
   {{ "tag_pattern": "v2.1.0", "yes_condition": "tag exists before deadline", "no_condition": "tag not published by deadline" }}

   For GITHUB_ISSUE:
   {{ "issue_number": 8902, "yes_condition": "state == closed AND state_reason == completed", "no_condition": "state == closed AND state_reason == not_planned OR deadline passed" }}

   For CI_METRIC:
   {{ "metric_name": "coverage_delta", "artifact_name": "coverage-report.json", "json_path": "$.delta", "operator": ">=", "threshold": 2.0 }}

   For CVE_SECURITY:
   {{ "keyword": "agave-consensus", "min_severity": "CRITICAL", "yes_condition": "critical CVE published before deadline" }}

   For WEB3_RPC:
   {{ "method": "event_count", "contract_address": "0x...", "event_name": "MarketCreated", "threshold": 10000 }}

   For DAO_GOVERNANCE:
   {{ "proposal_id": "0xabc...", "space": "solana.eth", "quorum_required": 0.66, "yes_condition": "state == closed AND choice_0_wins AND quorum_reached" }}

   For LLM_JUDGE:
   {{ "fetch_urls": ["https://..."], "question": "Did X happen by deadline?", "uncertainty_action": "INVALID" }}

8. "resolution_condition" — A plain-English one-liner: "If merged==true → YES. If closed without merge → NO. Past deadline → NO."

Respond with ONLY valid JSON. No markdown fences, no preamble.
"""


class MarketArchitect:
    def __init__(
        self,
        http_client: httpx.AsyncClient,
        llm_api_key: str,
        llm_model: str = "llama-3.3-70b-versatile",
        min_tss: float = DEFAULT_MIN_TSS,
        llm_endpoint: str = "https://api.groq.com/openai/v1/chat/completions",
    ) -> None:
        self._client = http_client
        self._llm_api_key = llm_api_key
        self._llm_model = llm_model
        self._min_tss = min_tss
        self._llm_endpoint = llm_endpoint

    # ── TSS Scoring ───────────────────────────────────────────────────────────

    def compute_tss(self, pr: dict[str, Any]) -> float:
        score = 0.10
        text_corpus = " ".join([
            pr.get("title", "").lower(),
            pr.get("body", "").lower()[:2000],
            " ".join(pr.get("labels", [])).lower(),
        ])

        for keyword, weight in _SIGNAL_KEYWORDS.items():
            if keyword in text_corpus:
                score += weight

        for keyword, weight in _NOISE_KEYWORDS.items():
            if keyword in text_corpus:
                score += weight

        for file_path in pr.get("changed_files", []):
            path_lower = file_path.lower()
            for pattern, weight in _CORE_PATH_PATTERNS:
                if pattern.search(path_lower):
                    score += weight
                    break

        total_churn = pr.get("additions", 0) + pr.get("deletions", 0)
        if total_churn > 5000:
            score += 0.15
        elif total_churn > 1000:
            score += 0.10
        elif total_churn > 300:
            score += 0.05

        return max(0.0, min(1.0, score))

    def filter_high_signal(self, prs: list[dict[str, Any]]) -> list[dict[str, Any]]:
        high_signal = []
        for pr in prs:
            score = self.compute_tss(pr)
            pr["tss_score"] = round(score, 4)
            if score >= self._min_tss:
                log.info(
                    "PR #%s passed TSS (score=%.2f): %s",
                    pr.get("number"), score, pr.get("title", ""),
                )
                high_signal.append(pr)
            else:
                log.debug(
                    "PR #%s filtered (score=%.2f): %s",
                    pr.get("number"), score, pr.get("title", ""),
                )
        high_signal.sort(key=lambda p: p["tss_score"], reverse=True)
        return high_signal

    # ── Market Generation ─────────────────────────────────────────────────────

    async def generate_market_proposal(self, pr: dict[str, Any]) -> dict[str, Any]:
        prompt = self._build_prompt(pr)
        try:
            if not self._llm_api_key:
                raise ValueError("LLM_API_KEY not set — using fallback.")
            raw_json = await self._call_llm(prompt)
            proposal = self._parse_llm_response(raw_json)
        except Exception as exc:
            log.warning("LLM call failed (%s). Using fallback.", exc)
            proposal = self._fallback_proposal(pr)

        proposal["tss_score"] = pr.get("tss_score", 0.0)
        proposal["source_pr_number"] = pr.get("number")
        proposal["source_pr_url"] = pr.get("url")
        return proposal

    def _build_prompt(self, pr: dict[str, Any]) -> str:
        key_files = ", ".join(pr.get("changed_files", [])[:10]) or "N/A"
        body_snippet = (pr.get("body", "") or "")[:600].replace("\n", " ")
        return _MARKET_GENERATION_PROMPT.format(
            number=pr.get("number", "?"),
            title=pr.get("title", ""),
            author=pr.get("author", "unknown"),
            labels=", ".join(pr.get("labels", [])) or "none",
            changed_files_count=pr.get("changed_files_count", 0),
            additions=pr.get("additions", 0),
            deletions=pr.get("deletions", 0),
            key_files=key_files,
            body_snippet=body_snippet,
            tss_score=pr.get("tss_score", 0.0),
        )

    async def _call_llm(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self._llm_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self._llm_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 1500,
            "response_format": {"type": "json_object"}
        }
        response = await self._client.post(
            self._llm_endpoint,
            headers=headers,
            json=payload,
            timeout=45.0,
        )
        response.raise_for_status()
        body = response.json()
        return body["choices"][0]["message"]["content"]

    @staticmethod
    def _parse_llm_response(raw: str) -> dict[str, Any]:
        cleaned = re.sub(r"```json|```", "", raw).strip()
        data = json.loads(cleaned)

        # Core market fields
        required_market = {"title", "description", "options", "agent_reason"}
        # Resolution strategy fields (new in v2)
        required_resolution = {"resolution_type", "data_source_url", "evaluation_logic", "resolution_condition"}

        missing = (required_market | required_resolution) - data.keys()
        if missing:
            raise ValueError(f"LLM response missing keys: {missing}")

        # Validate resolution_type
        res_type = data.get("resolution_type", "").upper()
        if res_type not in VALID_RESOLUTION_TYPES:
            raise ValueError(
                f"Invalid resolution_type '{res_type}'. "
                f"Must be one of: {VALID_RESOLUTION_TYPES}"
            )
        data["resolution_type"] = res_type  # normalise to upper

        # Validate evaluation_logic is a dict
        eval_logic = data.get("evaluation_logic")
        if not isinstance(eval_logic, dict):
            raise ValueError("evaluation_logic must be a JSON object.")

        # Validate data_source_url is a non-empty string
        if not isinstance(data.get("data_source_url"), str) or not data["data_source_url"].startswith("http"):
            raise ValueError("data_source_url must be a valid HTTP(S) URL.")

        data["options"] = ["Yes", "No"]
        return data

    @staticmethod
    def _fallback_proposal(pr: dict[str, Any]) -> dict[str, Any]:
        title = pr.get("title", "Unknown Change")
        number = pr.get("number", 0)
        labels = ", ".join(pr.get("labels", [])) or "none"
        pr_api_url = f"https://api.github.com/repos/anza-xyz/agave/pulls/{number}"

        return {
            "title": f"Impact of PR #{number}: {title[:60]}",
            "description": (
                f"Will the changes introduced in agave PR #{number} "
                f"({title[:80]}) be merged into the master branch?"
            ),
            "options": ["Yes", "No"],
            "agent_reason": (
                f"PR #{number} carries a high Technical Significance Score and "
                f"touches core Solana validator code. Labels: {labels}. "
                f"Fallback proposal — LLM service unavailable."
            ),
            "resolution_type": "GITHUB_PR",
            "data_source_url": pr_api_url,
            "evaluation_logic": {
                "check": "merged",
                "yes_condition": "merged == true",
                "no_condition": "state == closed AND merged == false",
            },
            "resolution_condition": (
                "If merged==true → YES. "
                "If state==closed AND merged==false → NO. "
                "Past deadline → NO."
            ),
        }

    # ── DB Persistence ────────────────────────────────────────────────────────

    @staticmethod
    async def save_proposal_to_db(
        proposal: dict[str, Any],
        receipt: dict[str, Any],
    ) -> Any | None:
        """
        After a successful on-chain deployment, persist the full market record
        (including resolution strategy) to the Prisma database.

        Returns the created Prisma Market record, or None on failure.
        """
        try:
            from db import db
            from datetime import datetime, timezone, timedelta

            onchain_id = receipt.get("market_id")
            resolution_days = 30
            deadline_ts = receipt.get("resolution_deadline")
            if deadline_ts:
                deadline_dt = datetime.fromtimestamp(deadline_ts, tz=timezone.utc)
            else:
                deadline_dt = datetime.now(timezone.utc) + timedelta(days=resolution_days)

            market = await db.market.create(
                data={
                    "onchainMarketId": int(onchain_id) if onchain_id is not None else None,
                    "transactionHash": receipt.get("transaction_hash"),
                    "blockNumber": receipt.get("block_number"),
                    "contractAddress": receipt.get("contract_address"),
                    "title": proposal.get("title", ""),
                    "question": proposal.get("description", ""),
                    "category": receipt.get("category", "Solana"),
                    "agentReason": proposal.get("agent_reason", ""),
                    "resolutionType": proposal.get("resolution_type", "GITHUB_PR"),
                    "dataSourceUrl": proposal.get("data_source_url", ""),
                    "evaluationLogic": proposal.get("evaluation_logic", {}),
                    "sourcePrNumber": proposal.get("source_pr_number"),
                    "sourcePrUrl": proposal.get("source_pr_url"),
                    "tssScore": proposal.get("tss_score"),
                    "initialLiquidityEth": receipt.get("initial_liquidity_eth"),
                    "resolutionDeadline": deadline_dt,
                    "status": "OPEN",
                    "outcome": "UNRESOLVED",
                }
            )

            # Also record the deployed PR to replace .deployed_prs.json
            pr_number = proposal.get("source_pr_number")
            if pr_number:
                await db.deployedpr.upsert(
                    where={"prNumber": int(pr_number)},
                    data={
                        "create": {
                            "prNumber": int(pr_number),
                            "prTitle": proposal.get("title", "")[:200],
                            "prUrl": proposal.get("source_pr_url"),
                            "tssScore": proposal.get("tss_score"),
                            "marketId": market.id,
                        },
                        "update": {"marketId": market.id},
                    },
                )

            log.info(
                "Saved market to DB: id=%s onchain_id=%s pr=#%s",
                market.id, onchain_id, pr_number,
            )
            return market

        except Exception as exc:
            log.error("Failed to save market proposal to DB: %s", exc)
            return None