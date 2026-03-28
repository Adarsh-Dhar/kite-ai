"""
agent/architect.py — Market Architect
=======================================
Two responsibilities:
  1. **TSS Filter** — Score every PR with a Technical Significance Score and
     discard low-signal noise (docs, typos, UI, CI-only changes).
  2. **Market Generator** — Call an LLM (Gemini / OpenAI placeholder) to
     convert high-signal PRs into structured prediction market JSON objects.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

log = logging.getLogger(__name__)


# ── TSS scoring weights ────────────────────────────────────────────────────────

# Keyword presence in title / body / labels → additive score bonus.
_SIGNAL_KEYWORDS: dict[str, float] = {
    # Consensus & protocol-critical
    "alpenglow": 0.40,
    "turbine": 0.25,
    "consensus": 0.25,
    "vote": 0.20,
    "leader": 0.15,
    "fork": 0.20,
    "replay": 0.20,
    # SIMD (Solana Improvement Documents)
    "simd": 0.35,
    "sip": 0.20,
    # Breaking / incompatible changes
    "breaking": 0.30,
    "breaking change": 0.35,
    "incompatible": 0.25,
    "deprecat": 0.15,
    # Runtime & BPF
    "runtime": 0.20,
    "bpf": 0.20,
    "sbf": 0.20,
    "loader": 0.15,
    # Performance-critical paths
    "scheduler": 0.20,
    "banking stage": 0.25,
    "accounts db": 0.20,
    "snapshot": 0.15,
    "perf": 0.10,
    # Security
    "cve": 0.40,
    "security": 0.30,
    "vuln": 0.30,
    # Release / upgrade
    "release": 0.15,
    "upgrade": 0.15,
    "migration": 0.15,
}

# Penalty keywords — if title/body primarily concern these, reduce score.
_NOISE_KEYWORDS: dict[str, float] = {
    "typo": -0.60,
    "readme": -0.55,
    "docs": -0.50,
    "documentation": -0.50,
    "changelog": -0.30,
    "clippy": -0.30,
    "fmt": -0.25,
    "format": -0.25,
    "whitespace": -0.30,
    "ui": -0.20,
    "bump version": -0.20,
    "dependabot": -0.40,
    "ci": -0.20,
    "github action": -0.25,
    "test only": -0.30,
}

# File-path signals: any changed file whose path matches these patterns → bonus.
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
    # Noise paths
    (re.compile(r"\.md$"), -0.15),
    (re.compile(r"docs/"), -0.30),
    (re.compile(r"\.github/"), -0.20),
]

# Minimum TSS for a PR to be considered "market-worthy".
DEFAULT_MIN_TSS = 0.65


# ── LLM prompt template ────────────────────────────────────────────────────────

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
    """
    Scores PRs with a Technical Significance Score and generates market proposals.

    Args:
        http_client: Shared async HTTP client.
        llm_api_key: API key for the LLM provider.
        min_tss: Minimum score for a PR to pass the filter (0.0 – 1.0).
        llm_endpoint: URL of the LLM completion endpoint.
    """

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

    # ── Public API ─────────────────────────────────────────────────────────────

    def compute_tss(self, pr: dict[str, Any]) -> float:
        """
        Compute a Technical Significance Score in [0, 1] for a flattened PR dict.

        Algorithm:
          score = base_score
                + Σ keyword_bonuses(title + body + labels)
                + Σ file_path_bonuses(changed_files)
                + churn_bonus

        The final score is clamped to [0.0, 1.0].
        """
        score = 0.10  # Small base score for any merged PR
        text_corpus = " ".join(
            [
                pr.get("title", "").lower(),
                pr.get("body", "").lower()[:2000],  # cap body to avoid noise
                " ".join(pr.get("labels", [])).lower(),
            ]
        )

        # Signal keywords
        for keyword, weight in _SIGNAL_KEYWORDS.items():
            if keyword in text_corpus:
                score += weight
                log.debug("TSS +%.2f from keyword '%s' in PR #%s", weight, keyword, pr.get("number"))

        # Noise penalties
        for keyword, weight in _NOISE_KEYWORDS.items():
            if keyword in text_corpus:
                score += weight  # weight is negative
                log.debug("TSS %.2f from noise keyword '%s' in PR #%s", weight, keyword, pr.get("number"))

        # File-path bonuses
        for file_path in pr.get("changed_files", []):
            path_lower = file_path.lower()
            for pattern, weight in _CORE_PATH_PATTERNS:
                if pattern.search(path_lower):
                    score += weight
                    break  # One bonus per file

        # Code churn bonus — large, focused changes are more significant.
        total_churn = pr.get("additions", 0) + pr.get("deletions", 0)
        if total_churn > 5000:
            score += 0.15
        elif total_churn > 1000:
            score += 0.10
        elif total_churn > 300:
            score += 0.05

        return max(0.0, min(1.0, score))

    def filter_high_signal(self, prs: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """
        Score all PRs and return only those that exceed the TSS threshold.
        Attaches the computed ``tss_score`` directly onto each dict.
        """
        high_signal = []
        for pr in prs:
            score = self.compute_tss(pr)
            pr["tss_score"] = round(score, 4)
            if score >= self._min_tss:
                log.info(
                    "PR #%s passed TSS filter (score=%.2f): %s",
                    pr.get("number"),
                    score,
                    pr.get("title", ""),
                )
                high_signal.append(pr)
            else:
                log.debug(
                    "PR #%s filtered out (score=%.2f): %s",
                    pr.get("number"),
                    score,
                    pr.get("title", ""),
                )

        # Sort descending by score so most significant markets are deployed first.
        high_signal.sort(key=lambda p: p["tss_score"], reverse=True)
        return high_signal

    async def generate_market_proposal(self, pr: dict[str, Any]) -> dict[str, Any]:
        """
        Call an LLM to convert a high-signal PR into a market proposal JSON.

        Falls back to a deterministic rule-based proposal if the LLM call
        fails (no API key, rate-limited, invalid JSON response, etc.).
        """
        prompt = self._build_prompt(pr)
        try:
            if not self._llm_api_key:
                raise ValueError("LLM_API_KEY is not set — using fallback generator.")
            raw_json = await self._call_llm(prompt)
            proposal = self._parse_llm_response(raw_json)
        except Exception as exc:  # noqa: BLE001
            log.warning("LLM call failed (%s). Using fallback generator.", exc)
            proposal = self._fallback_proposal(pr)

        # Enrich with source metadata that the LLM doesn't produce.
        proposal["tss_score"] = pr.get("tss_score", 0.0)
        proposal["source_pr_number"] = pr.get("number")
        proposal["source_pr_url"] = pr.get("url")
        return proposal

    # ── Private helpers ────────────────────────────────────────────────────────

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
        """
        ──────────────────────────────────────────────────────────────
        LLM INTEGRATION PLACEHOLDER
        ──────────────────────────────────────────────────────────────
        Currently wired for Google Gemini (`generateContent` REST API).
        To switch to OpenAI, replace the payload structure and endpoint:

            endpoint = "https://api.openai.com/v1/chat/completions"
            payload  = {
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            }
            headers["Authorization"] = f"Bearer {self._llm_api_key}"

        ──────────────────────────────────────────────────────────────
        """
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

        # Extract text from Gemini response structure.
        return body["candidates"][0]["content"]["parts"][0]["text"]

    @staticmethod
    def _parse_llm_response(raw: str) -> dict[str, Any]:
        """
        Safely parse and validate the LLM JSON output.

        Strips markdown fences that some models emit despite instructions.
        """
        cleaned = re.sub(r"```json|```", "", raw).strip()
        data = json.loads(cleaned)

        # Enforce required keys.
        required = {"title", "description", "options", "agent_reason"}
        missing = required - data.keys()
        if missing:
            raise ValueError(f"LLM response missing keys: {missing}")

        # Enforce options are always ["Yes", "No"].
        data["options"] = ["Yes", "No"]
        return data

    @staticmethod
    def _fallback_proposal(pr: dict[str, Any]) -> dict[str, Any]:
        """
        Deterministic rule-based market proposal when the LLM is unavailable.
        Produces sensible (if generic) output so the pipeline never stalls.
        """
        title = pr.get("title", "Unknown Change")
        number = pr.get("number", 0)
        labels = ", ".join(pr.get("labels", [])) or "none"
        return {
            "title": f"Impact of PR #{number}: {title[:60]}",
            "description": (
                f"Will the changes introduced in agave PR #{number} "
                f"({title[:80]}) be deployed to mainnet-beta within 60 days "
                f"of the PR merge date?"
            ),
            "options": ["Yes", "No"],
            "agent_reason": (
                f"This PR (#{number}) carries a high Technical Significance Score "
                f"and touches core Solana validator code. Labels: {labels}. "
                f"Automated fallback proposal was generated because the LLM "
                f"service was unavailable."
            ),
        }