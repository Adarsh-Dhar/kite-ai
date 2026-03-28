"""
agent/scout.py — GitHub Scout
==============================
Responsible for fetching recently merged Pull Requests and Release Tags
from the anza-xyz/agave repository using the GitHub GraphQL API.

GraphQL is preferred over REST here to fetch exactly the fields we need
in a single round-trip, minimising API quota consumption.
"""

import logging
from typing import Any

import httpx

log = logging.getLogger(__name__)

GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

# ── GraphQL query templates ───────────────────────────────────────────────────

# Fetches recently merged PRs with title, body, labels, and file-change stats.
_PR_QUERY = """
query MergedPRs($owner: String!, $repo: String!, $first: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequests(
      states: [MERGED]
      first: $first
      after: $cursor
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number
        title
        url
        bodyText
        mergedAt
        author { login }
        labels(first: 15) { nodes { name } }
        files(first: 50) {
          nodes { path additions deletions }
          totalCount
        }
        additions
        deletions
        changedFiles
      }
    }
  }
}
"""

# Fetches the latest release tags (semantic version tags).
_TAGS_QUERY = """
query ReleaseTags($owner: String!, $repo: String!, $first: Int!) {
  repository(owner: $owner, name: $repo) {
    refs(refPrefix: "refs/tags/", first: $first, orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
      nodes {
        name
        target {
          ... on Tag {
            message
            tagger { date }
          }
          ... on Commit {
            committedDate
            messageHeadline
          }
        }
      }
    }
  }
}
"""


class GitHubScout:
    """
    Async GitHub API client specialised for monitoring the Agave repository.

    Args:
        http_client: A shared httpx.AsyncClient instance (caller manages lifecycle).
        github_token: GitHub Personal Access Token (PAT) for authentication.
        owner: Repository owner (default: ``anza-xyz``).
        repo: Repository name (default: ``agave``).
    """

    def __init__(
        self,
        http_client: httpx.AsyncClient,
        github_token: str,
        owner: str = "anza-xyz",
        repo: str = "agave",
    ) -> None:
        self._client = http_client
        self._owner = owner
        self._repo = repo
        self._headers = {
            "Authorization": f"Bearer {github_token}",
            "Content-Type": "application/json",
            # GitHub recommends this header for GraphQL calls.
            "X-Github-Next-Global-ID": "1",
        }

    # ── Public API ─────────────────────────────────────────────────────────────

    async def fetch_merged_prs(self, limit: int = 50) -> list[dict[str, Any]]:
        """
        Return up to *limit* recently merged PRs.

        Paginates transparently if the initial page is insufficient.
        Each node is flattened for downstream consumers.

        Raises:
            httpx.HTTPStatusError: Propagated so callers can detect rate-limits.
        """
        results: list[dict[str, Any]] = []
        cursor: str | None = None

        while len(results) < limit:
            batch_size = min(limit - len(results), 100)  # GraphQL cap = 100
            payload = {
                "query": _PR_QUERY,
                "variables": {
                    "owner": self._owner,
                    "repo": self._repo,
                    "first": batch_size,
                    "cursor": cursor,
                },
            }
            data = await self._graphql(payload)
            pr_page = data["repository"]["pullRequests"]

            for node in pr_page["nodes"]:
                results.append(self._flatten_pr(node))

            page_info = pr_page["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            cursor = page_info["endCursor"]

        log.info("Fetched %d merged PRs from %s/%s.", len(results), self._owner, self._repo)
        return results[:limit]

    async def fetch_release_tags(self, limit: int = 10) -> list[dict[str, Any]]:
        """
        Return up to *limit* recent release tags.

        Raises:
            httpx.HTTPStatusError: Propagated so callers can detect rate-limits.
        """
        payload = {
            "query": _TAGS_QUERY,
            "variables": {"owner": self._owner, "repo": self._repo, "first": limit},
        }
        data = await self._graphql(payload)
        nodes = data["repository"]["refs"]["nodes"]

        tags = []
        for node in nodes:
            target = node.get("target", {})
            tags.append(
                {
                    "name": node["name"],
                    "date": target.get("tagger", {}).get("date")
                    or target.get("committedDate"),
                    "message": target.get("message") or target.get("messageHeadline", ""),
                }
            )

        log.info("Fetched %d release tags.", len(tags))
        return tags

    # ── Internal helpers ───────────────────────────────────────────────────────

    async def _graphql(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Execute a single GraphQL request and return the ``data`` field.

        Handles:
        - HTTP-level errors (rate limits → 403/429, auth → 401).
        - GraphQL-level errors embedded in the 200-OK response body.
        """
        response = await self._client.post(
            GITHUB_GRAPHQL_URL,
            json=payload,
            headers=self._headers,
        )

        # Surface HTTP errors (rate-limit, auth, server errors).
        response.raise_for_status()

        body = response.json()

        # GraphQL always returns 200, but may include ``errors``.
        if "errors" in body:
            error_msgs = "; ".join(e.get("message", str(e)) for e in body["errors"])
            log.error("GitHub GraphQL errors: %s", error_msgs)
            raise RuntimeError(f"GitHub GraphQL error: {error_msgs}")

        return body["data"]

    @staticmethod
    def _flatten_pr(node: dict[str, Any]) -> dict[str, Any]:
        """
        Normalise a raw GraphQL PR node into a flat dict for easier processing
        by the architect layer.
        """
        labels = [lbl["name"] for lbl in (node.get("labels") or {}).get("nodes", [])]
        changed_files = [
            f["path"]
            for f in (node.get("files") or {}).get("nodes", [])
        ]
        return {
            "number": node["number"],
            "title": node["title"],
            "url": node["url"],
            "body": node.get("bodyText", ""),
            "merged_at": node.get("mergedAt"),
            "author": (node.get("author") or {}).get("login", "unknown"),
            "labels": labels,
            "additions": node.get("additions", 0),
            "deletions": node.get("deletions", 0),
            "changed_files_count": node.get("changedFiles", 0),
            "changed_files": changed_files,
        }