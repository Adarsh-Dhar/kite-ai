"""
agent/architect.py — Market Architect (v3 — Groq Function Calling for URL Verification)
=========================================================================================
Two responsibilities:
  1. TSS Filter — Score every PR with a Technical Significance Score.
  2. Market Generator — Call LLM to convert high-signal PRs into structured
     prediction market JSON objects WITH deterministic resolution strategies.

New in v3:
  • _call_llm() now passes a `tools` array to Groq, forcing the model to
    call `verify_data_source_url` before committing to a URL.
  • _execute_tool_call() dispatches tool calls from the LLM response,
    performs the real HTTP check, and feeds the result back to the model
    in a second completion turn.
  • This turns URL hallucination from a silent bug into a caught error.
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

VALID_RESOLUTION_TYPES = {
    "GITHUB_PR", "GITHUB_RELEASE", "GITHUB_ISSUE",
    "CI_METRIC", "CVE_SECURITY", "WEB3_RPC",
    "DAO_GOVERNANCE", "LLM_JUDGE",
}

# ── Groq tool definition ──────────────────────────────────────────────────────
# This is the function schema the LLM must call to verify its proposed URL
# before we accept the final market JSON.

_VERIFY_URL_TOOL = {
    "type": "function",
    "function": {
        "name": "verify_data_source_url",
        "description": (
            "REQUIRED: You MUST call this tool with your proposed data_source_url "
            "before generating the final market JSON. It checks whether the URL "
            "is reachable and returns HTTP status + a snippet of the response. "
            "If the URL returns 404 or is unreachable, you must revise it."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The exact API URL you plan to use as data_source_url in the market.",
                },
                "resolution_type": {
                    "type": "string",
                    "enum": list(VALID_RESOLUTION_TYPES),
                    "description": "The resolution strategy you are proposing.",
                },
                "method": {
                    "type": "string",
                    "enum": ["GET", "POST"],
                    "description": "HTTP method to use when checking the URL (use POST for JSON-RPC endpoints).",
                    "default": "GET",
                },
            },
            "required": ["url", "resolution_type"],
        },
    },
}

# ── System prompt ─────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = """\
You are a crypto prediction market specialist with deep expertise in Solana \
blockchain development. You generate structured prediction market proposals from \
GitHub Pull Requests.

CRITICAL RULE: Before finalising any market proposal, you MUST call the \
`verify_data_source_url` tool with your proposed URL. If the tool reports a \
non-200 status or an error, you must revise the URL and try again until you \
have a verified, reachable URL. Only then output the final JSON.
"""

_MARKET_GENERATION_PROMPT = """\
Analyse the following merged Pull Request from the anza-xyz/agave repository \
and generate a structured prediction market proposal.

## Pull Request Details
- **Number**: #{number}
- **Title**: {title}
- **Author**: {author}
- **Labels**: {labels}
- **Files Changed**: {changed_files_count} files (+{additions}/-{deletions} lines)
- **Key Files**: {key_files}
- **Body Summary**: {body_snippet}
- **TSS Score**: {tss_score:.2f} / 1.00

## Step 1 — Call verify_data_source_url
First, decide on your resolution_type and data_source_url. Call the \
`verify_data_source_url` tool with those values. Wait for the result. \
If the URL is unreachable, revise and retry.

## Step 2 — Output the final JSON
Once your URL is verified (HTTP 200), output a JSON object with these EXACT keys:

1. "title"              — Concise market title (max 80 chars).
2. "description"        — Binary Yes/No prediction question.
3. "options"            — Always exactly ["Yes", "No"].
4. "agent_reason"       — 2-3 sentences: what the PR changes, why it's market-worthy, \
what resolves it.
5. "resolution_type"    — One of: GITHUB_PR, GITHUB_RELEASE, GITHUB_ISSUE, CI_METRIC, \
CVE_SECURITY, WEB3_RPC, DAO_GOVERNANCE, LLM_JUDGE.
6. "data_source_url"    — The VERIFIED URL from Step 1.
7. "evaluation_logic"   — JSON object with machine-readable resolution rules.
8. "resolution_condition" — Plain-English one-liner.

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
                log.info("PR #%s passed TSS (%.2f): %s", pr.get("number"), score, pr.get("title", ""))
                high_signal.append(pr)
            else:
                log.debug("PR #%s filtered (%.2f): %s", pr.get("number"), score, pr.get("title", ""))
        high_signal.sort(key=lambda p: p["tss_score"], reverse=True)
        return high_signal

    # ── Market Generation ─────────────────────────────────────────────────────

    async def generate_market_proposal(self, pr: dict[str, Any], max_retries: int = 3) -> dict[str, Any]:
        """
        Generate a market proposal using Groq function-calling to verify
        the data_source_url before accepting the LLM's output.
        Falls back to a deterministic proposal if the LLM is unavailable.
        """
        prompt = self._build_prompt(pr)
        last_error = "Unknown error"

        for attempt in range(max_retries):
            try:
                if not self._llm_api_key:
                    raise ValueError("LLM_API_KEY not set — using fallback.")

                raw_json, verification_record = await self._call_llm_with_tools(prompt)
                proposal = self._parse_llm_response(raw_json)

                # Log what the LLM verified
                if verification_record:
                    log.info(
                        "[Architect] LLM verified URL via tool call: %s → HTTP %s",
                        verification_record.get("url"),
                        verification_record.get("status_code"),
                    )

                # Final sanity check — re-verify post-parse
                ok, err = await self._http_verify(proposal.get("data_source_url", ""))
                if not ok:
                    last_error = f"Post-parse URL check failed: {err}"
                    log.warning("[Architect] attempt %d/%d: %s", attempt + 1, max_retries, last_error)
                    continue

                proposal["tss_score"]        = pr.get("tss_score", 0.0)
                proposal["source_pr_number"] = pr.get("number")
                proposal["source_pr_url"]    = pr.get("url")
                return proposal

            except Exception as exc:
                last_error = str(exc)
                log.warning("[Architect] LLM call failed (attempt %d/%d): %s", attempt + 1, max_retries, exc)

        log.warning("[Architect] All LLM attempts failed — using fallback proposal.")
        proposal = self._fallback_proposal(pr)
        proposal["tss_score"]        = pr.get("tss_score", 0.0)
        proposal["source_pr_number"] = pr.get("number")
        proposal["source_pr_url"]    = pr.get("url")
        return proposal

    # ── Groq with tool-calling ────────────────────────────────────────────────

    async def _call_llm_with_tools(
        self, prompt: str
    ) -> tuple[str, dict[str, Any] | None]:
        """
        Two-turn Groq call with function-calling.

        Turn 1: send the prompt with the verify_data_source_url tool definition.
                The model MUST call the tool before answering.
        Turn 2: execute the tool call (real HTTP check), return the result to
                the model, receive the final market JSON.

        Returns:
            (final_json_text, verification_record)
        """
        headers = {
            "Authorization": f"Bearer {self._llm_api_key}",
            "Content-Type": "application/json",
        }

        messages: list[dict] = [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user",   "content": prompt},
        ]

        # ── Turn 1: prompt + tool definition ─────────────────────────────────
        turn1_payload = {
            "model": self._llm_model,
            "messages": messages,
            "tools": [_VERIFY_URL_TOOL],
            "tool_choice": "required",   # Force the model to call our tool
            "temperature": 0.2,
            "max_tokens": 1024,
        }

        resp1 = await self._client.post(
            self._llm_endpoint, headers=headers, json=turn1_payload, timeout=45.0
        )
        resp1.raise_for_status()
        body1 = resp1.json()

        assistant_msg = body1["choices"][0]["message"]
        tool_calls = assistant_msg.get("tool_calls", [])

        # If the model somehow skipped the tool call, handle gracefully
        if not tool_calls:
            log.warning("[Architect] Model skipped tool call — attempting direct parse.")
            content = assistant_msg.get("content", "")
            return content, None

        # ── Execute tool calls ────────────────────────────────────────────────
        # In practice Groq returns one tool call here; we handle multiple just in case.
        tool_results: list[dict] = []
        verification_record: dict[str, Any] | None = None

        for tc in tool_calls:
            if tc.get("function", {}).get("name") != "verify_data_source_url":
                continue

            args = json.loads(tc["function"].get("arguments", "{}"))
            url            = args.get("url", "")
            resolution_type = args.get("resolution_type", "")
            method         = args.get("method", "GET").upper()

            # Real HTTP verification
            status_code, snippet, error = await self._execute_verify_tool(url, method)

            verification_record = {
                "url":             url,
                "resolution_type": resolution_type,
                "status_code":     status_code,
                "snippet":         snippet,
                "error":           error,
            }

            # Build the tool result message
            if error:
                result_text = (
                    f"VERIFICATION FAILED for {url}\n"
                    f"Error: {error}\n"
                    f"You MUST choose a different, valid URL and revise your market proposal."
                )
            elif status_code == 200:
                result_text = (
                    f"VERIFICATION PASSED for {url}\n"
                    f"HTTP 200 OK. Response snippet:\n{snippet}\n"
                    f"You may now output the final market JSON using this URL."
                )
            else:
                result_text = (
                    f"VERIFICATION FAILED for {url}\n"
                    f"HTTP {status_code}. This URL is not valid.\n"
                    f"You MUST choose a different URL."
                )

            tool_results.append({
                "role":         "tool",
                "tool_call_id": tc["id"],
                "content":      result_text,
            })

        # ── Turn 2: feed tool results back, get final JSON ────────────────────
        messages_turn2: list[dict] = [
            *messages,
            {"role": "assistant", **{k: v for k, v in assistant_msg.items() if k != "role"}},
            *tool_results,
        ]

        turn2_payload = {
            "model": self._llm_model,
            "messages": messages_turn2,
            "temperature": 0.2,
            "max_tokens": 1500,
            "response_format": {"type": "json_object"},
        }

        resp2 = await self._client.post(
            self._llm_endpoint, headers=headers, json=turn2_payload, timeout=45.0
        )
        resp2.raise_for_status()
        body2 = resp2.json()

        final_content = body2["choices"][0]["message"]["content"]
        return final_content, verification_record

    async def _execute_verify_tool(
        self, url: str, method: str = "GET"
    ) -> tuple[int | None, str, str | None]:
        """
        Actually hit the URL and return (status_code, response_snippet, error).
        Used as the implementation of the `verify_data_source_url` tool.
        """
        if not url or not url.startswith("http"):
            return None, "", f"Invalid URL format: {url!r}"

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                if method == "POST":
                    # For JSON-RPC endpoints (WEB3_RPC, DAO_GOVERNANCE)
                    resp = await client.post(
                        url,
                        json={"jsonrpc": "2.0", "id": 1, "method": "web3_clientVersion", "params": []},
                        headers={"Content-Type": "application/json"},
                    )
                else:
                    resp = await client.get(url)

                snippet = resp.text[:300].replace("\n", " ")
                return resp.status_code, snippet, None

        except httpx.TimeoutException:
            return None, "", f"Request timed out after 12s: {url}"
        except httpx.ConnectError as exc:
            return None, "", f"Connection refused: {exc}"
        except Exception as exc:
            return None, "", f"Unexpected error: {exc}"

    # ── Fallback / parse helpers ──────────────────────────────────────────────

    def _build_prompt(self, pr: dict[str, Any]) -> str:
        key_files    = ", ".join(pr.get("changed_files", [])[:10]) or "N/A"
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

    @staticmethod
    def _parse_llm_response(raw: str) -> dict[str, Any]:
        cleaned = re.sub(r"```json|```", "", raw).strip()
        data = json.loads(cleaned)

        required = {
            "title", "description", "options", "agent_reason",
            "resolution_type", "data_source_url", "evaluation_logic", "resolution_condition",
        }
        missing = required - data.keys()
        if missing:
            raise ValueError(f"LLM response missing keys: {missing}")

        res_type = data.get("resolution_type", "").upper()
        if res_type not in VALID_RESOLUTION_TYPES:
            raise ValueError(f"Invalid resolution_type '{res_type}'.")
        data["resolution_type"] = res_type

        if not isinstance(data.get("evaluation_logic"), dict):
            raise ValueError("evaluation_logic must be a JSON object.")
        if not isinstance(data.get("data_source_url"), str) or not data["data_source_url"].startswith("http"):
            raise ValueError("data_source_url must be a valid HTTP(S) URL.")

        data["options"] = ["Yes", "No"]
        return data

    @staticmethod
    async def _http_verify(url: str) -> tuple[bool, str]:
        """Lightweight post-parse URL check (no JSON-RPC fallback)."""
        if not url or not url.startswith("http"):
            return False, f"Not a valid URL: {url!r}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    return True, ""
                return False, f"HTTP {resp.status_code}"
        except Exception as exc:
            return False, str(exc)

    @staticmethod
    def _fallback_proposal(pr: dict[str, Any]) -> dict[str, Any]:
        number    = pr.get("number", 0)
        title     = pr.get("title", "Unknown Change")
        labels    = ", ".join(pr.get("labels", [])) or "none"
        pr_api_url = f"https://api.github.com/repos/anza-xyz/agave/pulls/{number}"
        return {
            "title": f"Impact of PR #{number}: {title[:60]}",
            "description": (
                f"Will the changes introduced in agave PR #{number} "
                f"({title[:80]}) be merged into the master branch?"
            ),
            "options": ["Yes", "No"],
            "agent_reason": (
                f"PR #{number} carries a high Technical Significance Score. "
                f"Labels: {labels}. Fallback proposal — LLM service unavailable."
            ),
            "resolution_type": "GITHUB_PR",
            "data_source_url": pr_api_url,
            "evaluation_logic": {
                "check":         "merged",
                "yes_condition": "merged == true",
                "no_condition":  "state == closed AND merged == false",
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
        """
        try:
            from db import db
            from datetime import datetime, timezone, timedelta

            onchain_id   = receipt.get("market_id")
            deadline_ts  = receipt.get("resolution_deadline")
            deadline_dt  = (
                datetime.fromtimestamp(deadline_ts, tz=timezone.utc)
                if deadline_ts
                else datetime.now(timezone.utc) + timedelta(days=30)
            )

            market = await db.market.create(
                data={
                    "onchainMarketId":    int(onchain_id) if onchain_id is not None else None,
                    "transactionHash":    receipt.get("transaction_hash"),
                    "blockNumber":        receipt.get("block_number"),
                    "contractAddress":    receipt.get("contract_address"),
                    "title":              proposal.get("title", ""),
                    "question":           proposal.get("description", ""),
                    "category":           receipt.get("category", "Solana"),
                    "agentReason":        proposal.get("agent_reason", ""),
                    "resolutionType":     proposal.get("resolution_type", "GITHUB_PR"),
                    "dataSourceUrl":      proposal.get("data_source_url", ""),
                    "evaluationLogic":    proposal.get("evaluation_logic", {}),
                    "sourcePrNumber":     proposal.get("source_pr_number"),
                    "sourcePrUrl":        proposal.get("source_pr_url"),
                    "tssScore":           proposal.get("tss_score"),
                    "initialLiquidityEth":receipt.get("initial_liquidity_eth"),
                    "resolutionDeadline": deadline_dt,
                    "status":             "OPEN",
                    "outcome":            "UNRESOLVED",
                }
            )

            pr_number = proposal.get("source_pr_number")
            if pr_number:
                await db.deployedpr.upsert(
                    where={"prNumber": int(pr_number)},
                    data={
                        "create": {
                            "prNumber": int(pr_number),
                            "prTitle":  proposal.get("title", "")[:200],
                            "prUrl":    proposal.get("source_pr_url"),
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