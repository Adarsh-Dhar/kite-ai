"""
Market Architect Agent — FastAPI Entry Point
============================================
Orchestrates the GitHub Scout, TSS Filter, Market Generator, and Kite AI
blockchain integration into a single autonomous API server.
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Any

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from agents.architect import MarketArchitect
from agents.scout import GitHubScout
from blockchain.kite_client import KiteClient
from config import Settings

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
log = logging.getLogger("market_architect")

# ── App-level singletons ──────────────────────────────────────────────────────
settings = Settings()  # type: ignore[call-arg]  # loaded from .env
_http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage the shared httpx client lifecycle."""
    global _http_client
    _http_client = httpx.AsyncClient(timeout=30.0)
    log.info("HTTP client initialised.")
    yield
    await _http_client.aclose()
    log.info("HTTP client closed.")


app = FastAPI(
    title="Market Architect Agent",
    description=(
        "Autonomous agent that monitors Solana core repositories and "
        "generates prediction markets on the Kite AI blockchain."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class MarketProposal(BaseModel):
    """A single market proposal produced by the architect."""
    title: str
    description: str
    options: list[str]
    agent_reason: str
    tss_score: float
    source_pr_number: int | None = None
    source_pr_url: str | None = None
    source_tag: str | None = None


class RunCycleRequest(BaseModel):
    """Optional body for POST /run-cycle."""
    dry_run: bool = False          # If True, skips on-chain deployment
    min_tss: float = 0.65          # Override minimum TSS threshold


class RunCycleResponse(BaseModel):
    prs_analysed: int
    markets_proposed: int
    markets_deployed: int
    proposals: list[MarketProposal]
    deployment_receipts: list[dict[str, Any]]
    errors: list[str]


# ── Dependency helpers ────────────────────────────────────────────────────────

def get_http_client() -> httpx.AsyncClient:
    if _http_client is None:
        raise RuntimeError("HTTP client not initialised.")
    return _http_client


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["meta"])
async def health() -> dict[str, str]:
    """Simple liveness probe."""
    return {"status": "ok", "agent": "market_architect", "version": "1.0.0"}


@app.get("/scout/prs", tags=["scout"], response_model=list[dict[str, Any]])
async def list_recent_prs(
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict[str, Any]]:
    """
    Fetch recently merged Pull Requests from anza-xyz/agave via GitHub
    GraphQL. Useful for debugging without triggering market generation.
    """
    scout = GitHubScout(
        http_client=get_http_client(),
        github_token=settings.github_token,
    )
    try:
        prs = await scout.fetch_merged_prs(limit=limit)
        return prs
    except httpx.HTTPStatusError as exc:
        _handle_github_error(exc)


@app.get("/scout/tags", tags=["scout"], response_model=list[dict[str, Any]])
async def list_recent_tags(
    limit: int = Query(default=10, ge=1, le=50),
) -> list[dict[str, Any]]:
    """Fetch recent release tags from anza-xyz/agave."""
    scout = GitHubScout(
        http_client=get_http_client(),
        github_token=settings.github_token,
    )
    try:
        tags = await scout.fetch_release_tags(limit=limit)
        return tags
    except httpx.HTTPStatusError as exc:
        _handle_github_error(exc)


@app.post("/run-cycle", tags=["agent"], response_model=RunCycleResponse)
async def run_cycle(body: RunCycleRequest = RunCycleRequest()) -> RunCycleResponse:
    """
    Main agentic loop:
      1. Scout fetches latest PRs & tags.
      2. Architect scores each item (TSS).
      3. High-signal items are converted to market proposals (LLM).
      4. Markets are deployed on Kite AI blockchain (unless dry_run=True).
    """
    scout = GitHubScout(
        http_client=get_http_client(),
        github_token=settings.github_token,
    )
    architect = MarketArchitect(
        http_client=get_http_client(),
        llm_api_key=settings.llm_api_key,
        min_tss=body.min_tss,
    )
    kite = KiteClient(
        api_key=settings.kite_api_key,
        wallet_private_key=settings.kite_wallet_private_key,
        rpc_url=settings.kite_rpc_url,
    )

    errors: list[str] = []
    proposals: list[MarketProposal] = []
    receipts: list[dict[str, Any]] = []

    # ── 1. Fetch data ─────────────────────────────────────────────────────────
    try:
        prs = await scout.fetch_merged_prs(limit=50)
        tags = await scout.fetch_release_tags(limit=10)
    except httpx.HTTPStatusError as exc:
        _handle_github_error(exc)

    log.info("Fetched %d PRs and %d tags.", len(prs), len(tags))

    # ── 2. Score & filter ─────────────────────────────────────────────────────
    high_signal_prs = architect.filter_high_signal(prs)
    log.info("%d PRs passed TSS filter.", len(high_signal_prs))

    # ── 3. Generate market proposals (LLM) ───────────────────────────────────
    for pr in high_signal_prs:
        try:
            proposal_data = await architect.generate_market_proposal(pr)
            proposals.append(MarketProposal(**proposal_data))
        except Exception as exc:  # noqa: BLE001
            msg = f"Failed to generate proposal for PR #{pr.get('number')}: {exc}"
            log.warning(msg)
            errors.append(msg)

    # ── 4. Deploy on-chain ───────────────────────────────────────────────────
    if not body.dry_run:
        session_key = await kite.create_session_key()
        for proposal in proposals:
            try:
                receipt = await kite.create_onchain_market(
                    market_data=proposal.model_dump(),
                    session_key=session_key,
                )
                receipts.append(receipt)
            except Exception as exc:  # noqa: BLE001
                msg = f"Blockchain deployment failed for '{proposal.title}': {exc}"
                log.error(msg)
                errors.append(msg)

    return RunCycleResponse(
        prs_analysed=len(prs),
        markets_proposed=len(proposals),
        markets_deployed=len(receipts),
        proposals=proposals,
        deployment_receipts=receipts,
        errors=errors,
    )


@app.post("/run-cycle/background", tags=["agent"], status_code=status.HTTP_202_ACCEPTED)
async def run_cycle_background(
    background_tasks: BackgroundTasks,
    body: RunCycleRequest = RunCycleRequest(),
) -> dict[str, str]:
    """
    Kick off the agentic cycle asynchronously and return immediately.
    Results are logged server-side (extend with a DB / webhook as needed).
    """
    async def _task() -> None:
        try:
            result = await run_cycle(body)
            log.info(
                "Background cycle complete: %d markets deployed, %d errors.",
                result.markets_deployed,
                len(result.errors),
            )
        except Exception as exc:  # noqa: BLE001
            log.exception("Background cycle failed: %s", exc)

    background_tasks.add_task(_task)
    return {"status": "accepted", "message": "Agentic cycle started in background."}


# ── Error helpers ─────────────────────────────────────────────────────────────

def _handle_github_error(exc: httpx.HTTPStatusError) -> None:
    """Translate GitHub HTTP errors into FastAPI HTTP exceptions."""
    if exc.response.status_code == 401:
        raise HTTPException(status_code=502, detail="GitHub token invalid or missing.")
    if exc.response.status_code == 403:
        # Typically a rate-limit response.
        reset = exc.response.headers.get("X-RateLimit-Reset", "unknown")
        raise HTTPException(
            status_code=429,
            detail=f"GitHub API rate limit exceeded. Resets at epoch {reset}.",
        )
    raise HTTPException(
        status_code=502,
        detail=f"GitHub API error {exc.response.status_code}: {exc.response.text[:200]}",
    )