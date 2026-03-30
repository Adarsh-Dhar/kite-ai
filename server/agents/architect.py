"""
agent/architect.py — Market Architect
=======================================
Two responsibilities:
  1. TSS Filter — Score every PR with a Technical Significance Score.
  2. Market Generator — Call Gemini/OpenAI to convert high-signal PRs
     into structured prediction market JSON objects.
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
Generate a JSON object with these exact keys:
1. "title" — A concise, technical, market-worthy title (max 80 chars). Must be specific to this change.
2. "description" — A binary Yes/No prediction question about a concrete, verifiable future outcome related to this PR's deployment or impact. Be specific about timelines or metrics where possible.
3. "options" — Always exactly ["Yes", "No"]
4. "agent_reason" — 2-3 sentences explaining: (a) what this PR changes at a technical level, (b) why it's market-worthy, and (c) what evidence would resolve the market.

Respond with ONLY valid JSON. No markdown fences, no preamble.
"""


class MarketArchitect:
    def __init__(
        self,
        http_client: httpx.AsyncClient,
        llm_api_key: str,
        min_tss: float = DEFAULT_MIN_TSS,
        llm_endpoint: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    ) -> None:
        self._client = http_client
        self._llm_api_key = llm_api_key
        self._min_tss = min_tss
        self._llm_endpoint = llm_endpoint

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
        headers = {"Content-Type": "application/json"}
        params = {"key": self._llm_api_key}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.4,
                "maxOutputTokens": 512,
            },
        }
        response = await self._client.post(
            self._llm_endpoint,
            headers=headers,
            params=params,
            json=payload,
            timeout=45.0,
        )
        response.raise_for_status()
        body = response.json()
        return body["candidates"][0]["content"]["parts"][0]["text"]

    @staticmethod
    def _parse_llm_response(raw: str) -> dict[str, Any]:
        cleaned = re.sub(r"```json|```", "", raw).strip()
        data = json.loads(cleaned)
        required = {"title", "description", "options", "agent_reason"}
        missing = required - data.keys()
        if missing:
            raise ValueError(f"LLM response missing keys: {missing}")
        data["options"] = ["Yes", "No"]
        return data

    @staticmethod
    def _fallback_proposal(pr: dict[str, Any]) -> dict[str, Any]:
        title = pr.get("title", "Unknown Change")
        number = pr.get("number", 0)
        labels = ", ".join(pr.get("labels", [])) or "none"
        return {
            "title": f"Impact of PR #{number}: {title[:60]}",
            "description": (
                f"Will the changes introduced in agave PR #{number} "
                f"({title[:80]}) be deployed to Solana mainnet-beta within "
                f"60 days of the PR merge date?"
            ),
            "options": ["Yes", "No"],
            "agent_reason": (
                f"PR #{number} carries a high Technical Significance Score and "
                f"touches core Solana validator code. Labels: {labels}. "
                f"Fallback proposal — LLM service unavailable."
            ),
        }