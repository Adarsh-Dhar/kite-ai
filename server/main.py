"""
Market Architect Agent — FastAPI Entry Point
============================================
Autonomous agent that continuously scouts GitHub for high-signal PRs in
anza-xyz/agave and deploys prediction markets on the Kite AI blockchain.

Architecture:
  • Lifespan starts a background asyncio task that runs every POLL_INTERVAL_SECONDS
  • GitHubScout  → fetches merged PRs via GraphQL
  • MarketArchitect → TSS filter + LLM market proposal generation
  • KiteClient   → signs and broadcasts createMarket() transactions
  • /status      → exposes live agent state (cycles run, markets deployed, errors)
"""

import asyncio
import logging
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from agents.architect import MarketArchitect
from agents.scout import GitHubScout
from blockchain.kite_client import KiteClient
from config import Settings

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
log = logging.getLogger("market_architect")

# ── App-level singletons ──────────────────────────────────────────────────────
settings = Settings()  # type: ignore[call-arg]
_http_client: httpx.AsyncClient | None = None
_kite_client: KiteClient | None = None

# ── Live agent state (in-memory, for /status endpoint) ───────────────────────
_agent_state: dict[str, Any] = {
    "started_at": None,
    "cycles_run": 0,
    "total_prs_analysed": 0,
    "total_markets_proposed": 0,
    "total_markets_deployed": 0,
    "last_cycle_at": None,
    "next_cycle_at": None,
    "last_cycle_errors": [],
    "recent_deployments": deque(maxlen=50),  # last 50 market receipts
    "recent_proposals": deque(maxlen=50),
    "loop_running": False,
}


# ── Lifespan: start/stop background scout loop ───────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _http_client, _kite_client, _agent_state

    _http_client = httpx.AsyncClient(timeout=30.0)
    _kite_client = KiteClient(
        wallet_private_key=settings.kite_wallet_private_key,
        rpc_url=settings.kite_rpc_url,
        contract_address=settings.kite_market_factory_address,
        initial_liquidity_eth=settings.market_initial_liquidity_eth,
        resolution_days=settings.market_resolution_days,
        chain_id=settings.kite_chain_id,
    )
    _agent_state["started_at"] = _utc_now()
    _agent_state["loop_running"] = True

    log.info("=" * 60)
    log.info(" Market Architect Agent — Starting Up")
    log.info("=" * 60)
    log.info("  RPC:       %s", settings.kite_rpc_url)
    log.info("  Contract:  %s", settings.kite_market_factory_address or "(not set)")
    log.info("  Wallet:    %s", _kite_client.wallet_address)
    log.info("  Interval:  %ds", settings.poll_interval_seconds)
    log.info("  Dry run:   %s", settings.dry_run)
    log.info("  Web3 OK:   %s", _kite_client.is_ready())
    log.info("=" * 60)

    # Start the continuous scouting loop
    scout_task = asyncio.create_task(_continuous_scout_loop())

    yield

    # Shutdown
    _agent_state["loop_running"] = False
    scout_task.cancel()
    try:
        await scout_task
    except asyncio.CancelledError:
        pass
    await _http_client.aclose()
    log.info("Market Architect Agent shut down.")


app = FastAPI(
    title="Market Architect Agent",
    description=(
        "Autonomous agent that monitors Solana core repositories and "
        "deploys prediction markets on the Kite AI blockchain."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Background loop ───────────────────────────────────────────────────────────

async def _continuous_scout_loop() -> None:
    """
    Runs forever. On each iteration:
      1. Fetches merged PRs from anza-xyz/agave
      2. Scores them with TSS filter
      3. Calls LLM to generate market proposals
      4. Deploys markets on-chain (unless dry_run=True)
      5. Sleeps for poll_interval_seconds
    """
    interval = settings.poll_interval_seconds

    # Brief startup delay so the server is ready before the first cycle
    await asyncio.sleep(5)

    while True:
        cycle_start = datetime.now(timezone.utc)
        log.info(
            "━━━ Auto-cycle #%d starting ━━━",
            _agent_state["cycles_run"] + 1,
        )

        try:
            result = await _run_full_cycle(
                dry_run=settings.dry_run,
                min_tss=settings.min_tss_score,
            )
            _agent_state["last_cycle_errors"] = result["errors"]
        except Exception as exc:
            log.error("Auto-cycle crashed: %s", exc, exc_info=True)
            _agent_state["last_cycle_errors"] = [str(exc)]

        next_run = _utc_now_str()
        _agent_state["next_cycle_at"] = (
            f"in ~{interval}s ({next_run})"
        )

        log.info(
            "━━━ Cycle complete. Sleeping %ds ━━━",
            interval,
        )
        await asyncio.sleep(interval)


# ── Core cycle logic ──────────────────────────────────────────────────────────

async def _run_full_cycle(
    dry_run: bool = False,
    min_tss: float | None = None,
) -> dict[str, Any]:
    """
    Executes one full scout → filter → propose → deploy cycle.
    Updates global _agent_state in-place.
    Returns a summary dict.
    """
    if _http_client is None or _kite_client is None:
        raise RuntimeError("Agent not initialised.")

    if min_tss is None:
        min_tss = settings.min_tss_score

    scout = GitHubScout(
        http_client=_http_client,
        github_token=settings.github_token,
        owner=settings.github_repo_owner,
        repo=settings.github_repo_name,
    )
    architect = MarketArchitect(
        http_client=_http_client,
        llm_api_key=settings.llm_api_key,
        llm_model=settings.llm_model,
        min_tss=min_tss,
    )

    errors: list[str] = []
    proposals: list[dict] = []
    receipts: list[dict] = []

    # ── 1. Fetch PRs ──────────────────────────────────────────────────────────
    try:
        prs = await scout.fetch_merged_prs(limit=settings.pr_fetch_limit)
        tags = await scout.fetch_release_tags(limit=10)
        log.info("Fetched %d PRs and %d tags.", len(prs), len(tags))
    except httpx.HTTPStatusError as exc:
        msg = f"GitHub fetch failed ({exc.response.status_code}): {exc.response.text[:200]}"
        log.error(msg)
        errors.append(msg)
        _update_state(0, 0, 0, errors)
        return {"errors": errors, "proposals": [], "receipts": []}

    _agent_state["total_prs_analysed"] += len(prs)

    # ── 2. TSS filter ─────────────────────────────────────────────────────────
    high_signal = architect.filter_high_signal(prs)
    log.info("%d / %d PRs passed TSS ≥ %.2f", len(high_signal), len(prs), min_tss)

    # Remove PRs already deployed this session
    new_prs = [
        pr for pr in high_signal
        if not _kite_client.already_deployed(pr.get("number", 0))
    ]
    skipped = len(high_signal) - len(new_prs)
    if skipped:
        log.info("Skipping %d already-deployed PRs.", skipped)

    # ── 3. Generate proposals ─────────────────────────────────────────────────
    for pr in new_prs:
        try:
            proposal = await architect.generate_market_proposal(pr)
            proposals.append(proposal)
            _agent_state["recent_proposals"].appendleft({
                "pr_number": pr.get("number"),
                "pr_title": pr.get("title", "")[:80],
                "market_title": proposal.get("title", "")[:80],
                "tss_score": proposal.get("tss_score"),
                "generated_at": _utc_now_str(),
            })
        except Exception as exc:
            msg = f"Proposal generation failed for PR #{pr.get('number')}: {exc}"
            log.warning(msg)
            errors.append(msg)

    _agent_state["total_markets_proposed"] += len(proposals)
    log.info("Generated %d market proposals.", len(proposals))

    # ── 4. Deploy on-chain ────────────────────────────────────────────────────
    if not dry_run and proposals:
        for proposal in proposals:
            try:
                receipt = await _kite_client.create_onchain_market(proposal)
                if receipt.get("skipped"):
                    continue
                receipts.append(receipt)
                _agent_state["recent_deployments"].appendleft({
                    **receipt,
                    "market_title": receipt.get("market_title", "")[:80],
                })
                log.info(
                    "✅ Market deployed: '%s' | tx=%s | block=%s",
                    receipt.get("market_title", "")[:50],
                    str(receipt.get("transaction_hash", ""))[:16] + "…",
                    receipt.get("block_number"),
                )
            except Exception as exc:
                msg = f"Deployment failed for '{proposal.get('title', '')}': {exc}"
                log.error(msg)
                errors.append(msg)
    elif dry_run:
        log.info("DRY RUN — skipping %d deployments.", len(proposals))

    # ── 5. Update global state ────────────────────────────────────────────────
    _update_state(len(prs), len(proposals), len(receipts), errors)

    return {
        "prs_analysed": len(prs),
        "markets_proposed": len(proposals),
        "markets_deployed": len(receipts),
        "proposals": proposals,
        "receipts": receipts,
        "errors": errors,
    }


def _update_state(
    prs: int,
    proposed: int,
    deployed: int,
    errors: list[str],
) -> None:
    _agent_state["cycles_run"] += 1
    _agent_state["total_markets_deployed"] += deployed
    _agent_state["last_cycle_at"] = _utc_now_str()
    _agent_state["last_cycle_errors"] = errors


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class MarketProposal(BaseModel):
    title: str
    description: str
    options: list[str]
    agent_reason: str
    tss_score: float
    source_pr_number: int | None = None
    source_pr_url: str | None = None


class RunCycleRequest(BaseModel):
    dry_run: bool = False
    min_tss: float = 0.65


class RunCycleResponse(BaseModel):
    prs_analysed: int
    markets_proposed: int
    markets_deployed: int
    proposals: list[dict]
    deployment_receipts: list[dict]
    errors: list[str]


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["meta"])
async def health() -> dict:
    return {
        "status": "ok",
        "agent": "market_architect",
        "version": "2.0.0",
        "loop_running": _agent_state["loop_running"],
        "cycles_run": _agent_state["cycles_run"],
        "web3_ready": _kite_client.is_ready() if _kite_client else False,
    }


@app.get("/status", tags=["meta"])
async def agent_status() -> dict:
    """
    Full live agent state: cycle stats, recent deployments, config summary.
    """
    contract_info: dict = {}
    if _kite_client:
        try:
            contract_info = await _kite_client.get_contract_info()
        except Exception as exc:
            contract_info = {"error": str(exc)}

    return {
        "agent_state": {
            **{k: v for k, v in _agent_state.items() if k not in ("recent_deployments", "recent_proposals")},
            "recent_deployments": list(_agent_state["recent_deployments"])[:10],
            "recent_proposals": list(_agent_state["recent_proposals"])[:10],
        },
        "config": {
            "repo": f"{settings.github_repo_owner}/{settings.github_repo_name}",
            "poll_interval_seconds": settings.poll_interval_seconds,
            "min_tss_score": settings.min_tss_score,
            "dry_run": settings.dry_run,
            "initial_liquidity_eth": settings.market_initial_liquidity_eth,
            "resolution_days": settings.market_resolution_days,
        },
        "contract": contract_info,
    }


@app.get("/scout/prs", tags=["scout"])
async def list_recent_prs(
    limit: int = Query(default=20, ge=1, le=100),
    score: bool = Query(default=True, description="Attach TSS scores"),
) -> list[dict]:
    """Fetch and optionally score recent merged PRs (no deployment)."""
    scout = GitHubScout(
        http_client=_get_client(),
        github_token=settings.github_token,
        owner=settings.github_repo_owner,
        repo=settings.github_repo_name,
    )
    try:
        prs = await scout.fetch_merged_prs(limit=limit)
    except httpx.HTTPStatusError as exc:
        _handle_github_error(exc)

    if score:
        architect = MarketArchitect(
            http_client=_get_client(),
            llm_api_key=settings.llm_api_key,
            llm_model=settings.llm_model,
        )
        for pr in prs:
            pr["tss_score"] = architect.compute_tss(pr)

    return prs


@app.get("/scout/tags", tags=["scout"])
async def list_recent_tags(limit: int = Query(default=10, ge=1, le=50)) -> list[dict]:
    """Fetch recent release tags from the watched repository."""
    scout = GitHubScout(
        http_client=_get_client(),
        github_token=settings.github_token,
        owner=settings.github_repo_owner,
        repo=settings.github_repo_name,
    )
    try:
        return await scout.fetch_release_tags(limit=limit)
    except httpx.HTTPStatusError as exc:
        _handle_github_error(exc)


@app.post("/run-cycle", tags=["agent"], response_model=RunCycleResponse)
async def run_cycle(body: RunCycleRequest = RunCycleRequest()) -> RunCycleResponse:
    """
    Manually trigger one full scouting + deployment cycle.
    Returns immediately with results (synchronous, may take 30-120s).
    """
    result = await _run_full_cycle(
        dry_run=body.dry_run,
        min_tss=body.min_tss,
    )
    return RunCycleResponse(
        prs_analysed=result["prs_analysed"],
        markets_proposed=result["markets_proposed"],
        markets_deployed=result["markets_deployed"],
        proposals=result["proposals"],
        deployment_receipts=result["receipts"],
        errors=result["errors"],
    )


@app.post(
    "/run-cycle/background",
    tags=["agent"],
    status_code=status.HTTP_202_ACCEPTED,
)
async def run_cycle_background(
    background_tasks: BackgroundTasks,
    body: RunCycleRequest = RunCycleRequest(),
) -> dict:
    """Kick off a manual cycle asynchronously and return immediately."""
    async def _task():
        try:
            result = await _run_full_cycle(dry_run=body.dry_run, min_tss=body.min_tss)
            log.info(
                "Manual background cycle done: %d deployed, %d errors",
                result["markets_deployed"],
                len(result["errors"]),
            )
        except Exception as exc:
            log.exception("Manual background cycle failed: %s", exc)

    background_tasks.add_task(_task)
    return {"status": "accepted", "message": "Agentic cycle started in background."}


@app.get("/markets", tags=["blockchain"])
async def list_deployed_markets() -> list[dict]:
    """
    Fetch all deployed markets from the on-chain contract.
    Returns live data from the blockchain.
    """
    if not _kite_client or not _kite_client.is_ready():
        raise HTTPException(
            status_code=503,
            detail="Blockchain client not ready. Set KITE_WALLET_PRIVATE_KEY and KITE_MARKET_FACTORY_ADDRESS.",
        )
    try:
        w3_info = await _kite_client.get_contract_info()
        return [w3_info]  # Extend: call getAllMarkets() for full list
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.get("/deployments", tags=["agent"])
async def recent_deployments(limit: int = Query(default=20, ge=1, le=50)) -> list[dict]:
    """Return the most recent market deployment receipts from this session."""
    return list(_agent_state["recent_deployments"])[:limit]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_client() -> httpx.AsyncClient:
    if _http_client is None:
        raise RuntimeError("HTTP client not initialised.")
    return _http_client


def _handle_github_error(exc: httpx.HTTPStatusError) -> None:
    if exc.response.status_code == 401:
        raise HTTPException(status_code=502, detail="GitHub token invalid or missing.")
    if exc.response.status_code in (403, 429):
        reset = exc.response.headers.get("X-RateLimit-Reset", "unknown")
        raise HTTPException(
            status_code=429,
            detail=f"GitHub rate limit. Resets at {reset}.",
        )
    raise HTTPException(
        status_code=502,
        detail=f"GitHub API error {exc.response.status_code}",
    )


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _utc_now_str() -> str:
    return _utc_now().isoformat()