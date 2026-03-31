"""
server/tools/github_tools.py — GitHub API Tool Library
========================================================
Provides deterministic, async functions for fetching data from GitHub
that the Resolver Agent uses to autonomously close markets.

Tools:
  • get_pr_state()          — fetch PR merged/open/closed status
  • get_release_tag()       — check if a specific tag exists
  • get_issue_state()       — check issue closed/completed state
  • get_check_run_results() — fetch CI/CD check run results for a commit SHA
  • get_ci_artifact_json()  — download and parse a JSON artifact from GH Actions
  • get_security_advisories() — fetch GitHub Security Advisories for a repo
"""

from __future__ import annotations

import base64
import io
import json
import logging
import zipfile
from typing import Any

import httpx

log = logging.getLogger(__name__)

GITHUB_REST_BASE = "https://api.github.com"
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

# ── Advisory severity levels ──────────────────────────────────────────────────
SEVERITY_ORDER = {"LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}


class GitHubTools:
    """
    Stateless async toolset backed by a shared httpx.AsyncClient.

    All methods return None (or empty collections) on failure — the Resolver
    treats None as an unresolvable condition and retries later.
    """

    def __init__(self, http_client: httpx.AsyncClient, github_token: str) -> None:
        if not github_token or not github_token.strip():
            log.error("GitHubTools: GITHUB_TOKEN is missing. Please set it in your .env file.")
            raise ValueError("Missing GitHub Personal Access Token (GITHUB_TOKEN) in environment.")
        self._client = http_client
        self._headers = {
            "Authorization": f"Bearer {github_token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    # ── PR State ──────────────────────────────────────────────────────────────

    async def get_pr_state(self, owner: str, repo: str, pr_number: int) -> dict[str, Any] | None:
        """
        Returns PR data with keys: number, state, merged, mergedAt, title, url.

        Resolution logic:
          merged == True  → YES
          state == "closed" and merged == False → NO
          state == "open"  → PENDING
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/pulls/{pr_number}"
        try:
            resp = await self._client.get(url, headers=self._headers, timeout=20.0)
            if resp.status_code == 404:
                log.warning("PR #%d not found at %s", pr_number, url)
                return None
            resp.raise_for_status()
            data = resp.json()
            return {
                "number": data.get("number"),
                "state": data.get("state"),
                "merged": data.get("merged", False),
                "mergedAt": data.get("merged_at"),
                "title": data.get("title"),
                "url": data.get("html_url"),
                "draft": data.get("draft", False),
            }
        except httpx.HTTPStatusError as exc:
            log.error("GitHub PR fetch failed (%d): %s", exc.response.status_code, url)
            return None
        except Exception as exc:
            log.error("GitHub PR fetch error: %s", exc)
            return None

    async def search_revert_pr(
        self, owner: str, repo: str, original_pr_number: int
    ) -> dict[str, Any] | None:
        """
        Search for a merged PR that reverts `original_pr_number`.
        Returns the revert PR data if found, else None.
        """
        query = f"repo:{owner}/{repo} is:pr is:merged Revert in:title #{original_pr_number}"
        url = f"{GITHUB_REST_BASE}/search/issues"
        try:
            resp = await self._client.get(
                url,
                headers=self._headers,
                params={"q": query, "per_page": 5},
                timeout=20.0,
            )
            resp.raise_for_status()
            items = resp.json().get("items", [])
            for item in items:
                title_lower = item.get("title", "").lower()
                if f"revert" in title_lower and f"#{original_pr_number}" in item.get("title", ""):
                    return {"number": item["number"], "title": item["title"], "url": item["html_url"]}
            return None
        except Exception as exc:
            log.error("Revert PR search error: %s", exc)
            return None

    # ── Release Tags ──────────────────────────────────────────────────────────

    async def get_release_tag(
        self, owner: str, repo: str, tag_name: str
    ) -> dict[str, Any] | None:
        """
        Check if a specific release tag exists.
        Returns tag metadata if found, None otherwise.
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/releases/tags/{tag_name}"
        try:
            resp = await self._client.get(url, headers=self._headers, timeout=20.0)
            if resp.status_code == 404:
                return None  # Tag doesn't exist yet → PENDING
            resp.raise_for_status()
            data = resp.json()
            return {
                "tag_name": data.get("tag_name"),
                "name": data.get("name"),
                "published_at": data.get("published_at"),
                "prerelease": data.get("prerelease", False),
                "draft": data.get("draft", False),
                "html_url": data.get("html_url"),
            }
        except Exception as exc:
            log.error("Release tag fetch error: %s", exc)
            return None

    async def list_recent_tags(
        self, owner: str, repo: str, limit: int = 20
    ) -> list[dict[str, Any]]:
        """List recent tags from a repo (for pattern matching)."""
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/tags"
        try:
            resp = await self._client.get(
                url, headers=self._headers, params={"per_page": limit}, timeout=20.0
            )
            resp.raise_for_status()
            return [
                {"name": t["name"], "sha": t["commit"]["sha"]}
                for t in resp.json()
            ]
        except Exception as exc:
            log.error("Tag listing error: %s", exc)
            return []

    # ── Issues ────────────────────────────────────────────────────────────────

    async def get_issue_state(
        self, owner: str, repo: str, issue_number: int
    ) -> dict[str, Any] | None:
        """
        Fetch issue state and state_reason.

        Resolution logic:
          state == "closed" AND state_reason == "completed" → YES
          state == "closed" AND state_reason == "not_planned" → NO
          state == "open" → PENDING
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/issues/{issue_number}"
        try:
            resp = await self._client.get(url, headers=self._headers, timeout=20.0)
            if resp.status_code == 404:
                return None
            resp.raise_for_status()
            data = resp.json()
            return {
                "number": data.get("number"),
                "state": data.get("state"),
                "state_reason": data.get("state_reason"),
                "title": data.get("title"),
                "closed_at": data.get("closed_at"),
                "url": data.get("html_url"),
            }
        except Exception as exc:
            log.error("Issue fetch error: %s", exc)
            return None

    # ── CI/CD Check Runs ──────────────────────────────────────────────────────

    async def get_check_runs(
        self, owner: str, repo: str, commit_sha: str, check_name: str | None = None
    ) -> list[dict[str, Any]]:
        """
        Fetch GitHub Actions check runs for a specific commit SHA.

        Returns a list of check run summaries with status and conclusion.
        Filter by check_name if provided.
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/commits/{commit_sha}/check-runs"
        params: dict[str, Any] = {"per_page": 50}
        if check_name:
            params["check_name"] = check_name

        try:
            resp = await self._client.get(url, headers=self._headers, params=params, timeout=30.0)
            resp.raise_for_status()
            runs = resp.json().get("check_runs", [])
            return [
                {
                    "id": r["id"],
                    "name": r["name"],
                    "status": r["status"],          # queued | in_progress | completed
                    "conclusion": r.get("conclusion"), # success | failure | neutral | skipped | timed_out | action_required
                    "started_at": r.get("started_at"),
                    "completed_at": r.get("completed_at"),
                    "html_url": r.get("html_url"),
                    "details_url": r.get("details_url"),
                }
                for r in runs
            ]
        except Exception as exc:
            log.error("Check runs fetch error: %s", exc)
            return []

    async def get_workflow_run_artifacts(
        self, owner: str, repo: str, run_id: int
    ) -> list[dict[str, Any]]:
        """List artifacts from a specific workflow run."""
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
        try:
            resp = await self._client.get(url, headers=self._headers, timeout=20.0)
            resp.raise_for_status()
            return resp.json().get("artifacts", [])
        except Exception as exc:
            log.error("Artifacts list error: %s", exc)
            return []

    async def download_artifact_json(
        self, owner: str, repo: str, artifact_id: int
    ) -> dict[str, Any] | list | None:
        """
        Download a zip artifact and parse the first JSON file found inside it.
        Used to read benchmark results, coverage reports, etc.
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/zip"
        try:
            # Get redirect URL
            resp = await self._client.get(
                url, headers=self._headers, follow_redirects=True, timeout=60.0
            )
            resp.raise_for_status()

            # Unzip in memory
            zf = zipfile.ZipFile(io.BytesIO(resp.content))
            for name in zf.namelist():
                if name.endswith(".json"):
                    with zf.open(name) as f:
                        return json.load(f)
            log.warning("No JSON file found in artifact %d", artifact_id)
            return None
        except Exception as exc:
            log.error("Artifact download error: %s", exc)
            return None

    async def get_sonarcloud_metrics(
        self, project_key: str, metrics: list[str], sonar_token: str
    ) -> dict[str, Any] | None:
        """
        Fetch SonarCloud metrics (coverage, code smells, etc.) for a project.
        Returns a dict of metric_key → value.
        """
        url = "https://sonarcloud.io/api/measures/component"
        params = {
            "component": project_key,
            "metricKeys": ",".join(metrics),
        }
        headers = {"Authorization": f"Bearer {sonar_token}"}
        try:
            resp = await self._client.get(url, headers=headers, params=params, timeout=20.0)
            resp.raise_for_status()
            data = resp.json()
            measures = data.get("component", {}).get("measures", [])
            return {m["metric"]: m.get("value") for m in measures}
        except Exception as exc:
            log.error("SonarCloud fetch error: %s", exc)
            return None

    # ── Security Advisories ───────────────────────────────────────────────────

    async def get_security_advisories(
        self,
        owner: str,
        repo: str,
        severity_filter: str | None = None,
        limit: int = 30,
    ) -> list[dict[str, Any]]:
        """
        Fetch GitHub Security Advisories (GHSA) for a repository.
        Optionally filter by severity: CRITICAL, HIGH, MODERATE, LOW.
        """
        url = f"{GITHUB_REST_BASE}/repos/{owner}/{repo}/security-advisories"
        try:
            resp = await self._client.get(
                url,
                headers=self._headers,
                params={"per_page": limit, "direction": "desc", "sort": "published"},
                timeout=20.0,
            )
            resp.raise_for_status()
            advisories = resp.json()
            results = []
            for adv in advisories:
                sev = adv.get("severity", "").upper()
                if severity_filter and sev != severity_filter.upper():
                    continue
                results.append({
                    "ghsa_id": adv.get("ghsa_id"),
                    "cve_id": adv.get("cve_id"),
                    "severity": sev,
                    "summary": adv.get("summary"),
                    "published_at": adv.get("published_at"),
                    "withdrawn_at": adv.get("withdrawn_at"),
                    "vulnerabilities": adv.get("vulnerabilities", []),
                    "html_url": adv.get("html_url"),
                })
            return results
        except Exception as exc:
            log.error("Security advisories fetch error: %s", exc)
            return []

    async def check_cve_in_nvd(self, cve_id: str) -> dict[str, Any] | None:
        """
        Query the NIST National Vulnerability Database (NVD) API v2
        for a specific CVE identifier.
        """
        url = f"https://services.nvd.nist.gov/rest/json/cves/2.0"
        try:
            resp = await self._client.get(
                url,
                params={"cveId": cve_id},
                timeout=30.0,
            )
            resp.raise_for_status()
            items = resp.json().get("vulnerabilities", [])
            if not items:
                return None
            cve = items[0].get("cve", {})
            metrics = cve.get("metrics", {})
            cvss_data = (
                metrics.get("cvssMetricV31", [{}])[0]
                or metrics.get("cvssMetricV30", [{}])[0]
                or {}
            )
            base_score = cvss_data.get("cvssData", {}).get("baseScore")
            base_severity = cvss_data.get("cvssData", {}).get("baseSeverity")
            return {
                "cve_id": cve_id,
                "published": cve.get("published"),
                "last_modified": cve.get("lastModified"),
                "base_score": base_score,
                "base_severity": base_severity,
                "descriptions": [
                    d.get("value") for d in cve.get("descriptions", [])
                    if d.get("lang") == "en"
                ],
            }
        except Exception as exc:
            log.error("NVD CVE lookup error for %s: %s", cve_id, exc)
            return None