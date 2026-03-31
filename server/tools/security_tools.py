"""
server/tools/security_tools.py — CVE & Security Advisory Tool Library
=======================================================================
Fetches vulnerability data from public security databases to resolve
CVE_SECURITY prediction markets autonomously.

Sources:
  • GitHub Security Advisories (GHSA) — via REST API
  • NIST National Vulnerability Database (NVD) — public REST API v2
  • Immunefi Bug Bounty — public API for payout announcements
  • OSV (Open Source Vulnerabilities) — Google's open vulnerability DB
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

import httpx

log = logging.getLogger(__name__)

NVD_BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"
OSV_BASE_URL = "https://api.osv.dev/v1"
IMMUNEFI_BASE_URL = "https://immunefi.com/api"


class SecurityTools:
    """
    Async security data fetcher.
    All methods return structured dicts or None/[] on failure.
    """

    def __init__(self, http_client: httpx.AsyncClient, nvd_api_key: str = "") -> None:
        self._client = http_client
        self._nvd_api_key = nvd_api_key  # Optional — increases NVD rate limits

    # ── NVD CVE Database ──────────────────────────────────────────────────────

    async def lookup_cve(self, cve_id: str) -> dict[str, Any] | None:
        """
        Look up a specific CVE from the NVD database.
        Returns severity, CVSS score, affected packages, and publish date.

        Resolution logic for CVE markets:
          published within deadline AND severity matches → YES
          deadline passed and not published → NO
        """
        headers = {}
        if self._nvd_api_key:
            headers["apiKey"] = self._nvd_api_key

        try:
            resp = await self._client.get(
                NVD_BASE_URL,
                params={"cveId": cve_id},
                headers=headers,
                timeout=30.0,
            )
            resp.raise_for_status()
            vulns = resp.json().get("vulnerabilities", [])
            if not vulns:
                return None

            cve = vulns[0].get("cve", {})
            metrics = cve.get("metrics", {})

            # Try v3.1 first, fall back to v3.0, then v2.0
            cvss_v31 = metrics.get("cvssMetricV31", [])
            cvss_v30 = metrics.get("cvssMetricV30", [])
            cvss_v2 = metrics.get("cvssMetricV2", [])

            cvss_data = {}
            if cvss_v31:
                cvss_data = cvss_v31[0].get("cvssData", {})
            elif cvss_v30:
                cvss_data = cvss_v30[0].get("cvssData", {})
            elif cvss_v2:
                cvss_data = cvss_v2[0].get("cvssData", {})

            descriptions = [
                d["value"] for d in cve.get("descriptions", [])
                if d.get("lang") == "en"
            ]

            affected = []
            for config in cve.get("configurations", []):
                for node in config.get("nodes", []):
                    for match in node.get("cpeMatch", []):
                        affected.append(match.get("criteria", ""))

            return {
                "cve_id": cve_id,
                "published": cve.get("published"),
                "last_modified": cve.get("lastModified"),
                "vuln_status": cve.get("vulnStatus"),
                "base_score": cvss_data.get("baseScore"),
                "base_severity": cvss_data.get("baseSeverity"),
                "attack_vector": cvss_data.get("attackVector"),
                "description": descriptions[0] if descriptions else None,
                "affected_cpe": affected[:10],
            }
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 404:
                return None
            log.error("NVD CVE lookup HTTP error %d for %s", exc.response.status_code, cve_id)
            return None
        except Exception as exc:
            log.error("NVD CVE lookup error for %s: %s", cve_id, exc)
            return None

    async def search_cves_by_keyword(
        self,
        keyword: str,
        severity: str | None = None,
        published_after: datetime | None = None,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        """
        Search NVD for CVEs matching a keyword (e.g. "agave", "solana").
        Optionally filter by severity and publication date.

        Used for "Will a critical CVE be published for X within 30 days?" markets.
        """
        params: dict[str, Any] = {
            "keywordSearch": keyword,
            "resultsPerPage": min(limit, 100),
        }
        if severity:
            params["cvssV3Severity"] = severity.upper()
        if published_after:
            params["pubStartDate"] = published_after.strftime("%Y-%m-%dT%H:%M:%S.000")

        headers = {}
        if self._nvd_api_key:
            headers["apiKey"] = self._nvd_api_key

        try:
            resp = await self._client.get(
                NVD_BASE_URL,
                params=params,
                headers=headers,
                timeout=30.0,
            )
            resp.raise_for_status()
            vulns = resp.json().get("vulnerabilities", [])
            results = []
            for v in vulns:
                cve = v.get("cve", {})
                metrics = cve.get("metrics", {})
                cvss_list = (
                    metrics.get("cvssMetricV31")
                    or metrics.get("cvssMetricV30")
                    or metrics.get("cvssMetricV2")
                    or [{}]
                )
                cvss_data = cvss_list[0].get("cvssData", {})
                results.append({
                    "cve_id": cve.get("id"),
                    "published": cve.get("published"),
                    "base_score": cvss_data.get("baseScore"),
                    "base_severity": cvss_data.get("baseSeverity"),
                    "vuln_status": cve.get("vulnStatus"),
                })
            return results
        except Exception as exc:
            log.error("NVD keyword search error for '%s': %s", keyword, exc)
            return []

    # ── OSV (Open Source Vulnerabilities) ─────────────────────────────────────

    async def query_osv(
        self, package_name: str, ecosystem: str = "crates.io"
    ) -> list[dict[str, Any]]:
        """
        Query OSV for vulnerabilities affecting a specific package.
        Ecosystems: crates.io, npm, PyPI, Go, Maven, etc.

        Used as a secondary source alongside NVD.
        """
        try:
            resp = await self._client.post(
                f"{OSV_BASE_URL}/query",
                json={"package": {"name": package_name, "ecosystem": ecosystem}},
                timeout=20.0,
            )
            resp.raise_for_status()
            vulns = resp.json().get("vulns", [])
            return [
                {
                    "id": v.get("id"),
                    "summary": v.get("summary"),
                    "severity": v.get("severity", []),
                    "published": v.get("published"),
                    "modified": v.get("modified"),
                    "aliases": v.get("aliases", []),  # includes CVE IDs
                }
                for v in vulns
            ]
        except Exception as exc:
            log.error("OSV query error for %s/%s: %s", ecosystem, package_name, exc)
            return []

    async def get_osv_by_id(self, vuln_id: str) -> dict[str, Any] | None:
        """Fetch a specific OSV vulnerability by ID (e.g. GHSA-xxxx or CVE-xxxx)."""
        try:
            resp = await self._client.get(
                f"{OSV_BASE_URL}/vulns/{vuln_id}",
                timeout=20.0,
            )
            if resp.status_code == 404:
                return None
            resp.raise_for_status()
            data = resp.json()
            return {
                "id": data.get("id"),
                "summary": data.get("summary"),
                "details": data.get("details"),
                "severity": data.get("severity", []),
                "published": data.get("published"),
                "modified": data.get("modified"),
                "affected": [
                    {
                        "package": pkg.get("package", {}).get("name"),
                        "ecosystem": pkg.get("package", {}).get("ecosystem"),
                        "ranges": pkg.get("ranges", []),
                    }
                    for pkg in data.get("affected", [])
                ],
            }
        except Exception as exc:
            log.error("OSV get by ID error for %s: %s", vuln_id, exc)
            return None

    # ── Immunefi Bug Bounty ───────────────────────────────────────────────────

    async def get_immunefi_bounties(
        self, project_name: str | None = None
    ) -> list[dict[str, Any]]:
        """
        Fetch active bug bounty programs from Immunefi's public API.
        Optionally filter by project name (case-insensitive substring match).

        NOTE: Immunefi doesn't have an official public payout history API.
        This uses their publicly listed programs endpoint.
        For payout announcements, monitor their blog/Twitter RSS.
        """
        try:
            resp = await self._client.get(
                "https://immunefi.com/api/bounty/",
                timeout=30.0,
            )
            resp.raise_for_status()
            bounties = resp.json()

            if not isinstance(bounties, list):
                bounties = bounties.get("data", [])

            results = []
            for b in bounties:
                name = b.get("project", b.get("name", ""))
                if project_name and project_name.lower() not in name.lower():
                    continue
                results.append({
                    "project": name,
                    "max_bounty_usd": b.get("maxBounty", b.get("max_bounty")),
                    "assets": b.get("assets", []),
                    "url": b.get("url", b.get("link")),
                    "status": b.get("status", "active"),
                })
            return results
        except Exception as exc:
            log.error("Immunefi fetch error: %s", exc)
            return []

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def is_critical(severity: str | None) -> bool:
        """Returns True if the severity is CRITICAL or HIGH."""
        return (severity or "").upper() in ("CRITICAL", "HIGH")

    @staticmethod
    def published_within_deadline(published_at: str | None, deadline: datetime) -> bool:
        """
        Check if a CVE was published before the market resolution deadline.
        published_at: ISO8601 string from NVD/GHSA.
        """
        if not published_at:
            return False
        try:
            pub_dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            return pub_dt <= deadline.astimezone(timezone.utc)
        except ValueError:
            return False