"""
Market Architect Agent — FastAPI Entry Point (v3)
=================================================
Added in v3:
  • WebSocket /ws/logs endpoint — streams all Python logs to the terminal UI
  • ws_logger.WebSocketLogHandler attached to root logger at startup
  • log_broadcaster background task drains the asyncio queue and broadcasts
"""

import asyncio
import logging
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from agents.architect import MarketArchitect
from agents.scout import GitHubScout
from agents.resolver import continuous_resolver_loop
from blockchain.kite_client import KiteClient
from config import Settings
from db import connect_db, disconnect_db
from ws_logger import WebSocketLogHandler, ws_manager, log_broadcaster

# ── Logging ───────────────────────────────────────────────────────────────────
# Attach the WebSocket handler to the root logger so every log.info() /
# log.warning() / log.error() from scout.py, architect.py, resolver.py
# is intercepted and pushed to connected browser terminals.

_ws_handler = WebSocketLogHandler()
_ws_handler.setFormatter(
    logging.Formatter(
        '[%(asctime)s] [%(name)s] %(levelname)s: %(message)s',
        datefmt='%H:%M:%S',
    )
)
logging.getLogger().addHandler(_ws_handler)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
)
log = logging.getLogger('market_architect')

# ── App-level singletons ──────────────────────────────────────────────────────
settings = Settings()  # type: ignore[call-arg]
_http_client: httpx.AsyncClient | None = None
_kite_client: KiteClient | None = None

# ── Live agent state ──────────────────────────────────────────────────────────
_agent_state: dict[str, Any] = {
    'started_at': None,
    'cycles_run': 0,
    'total_prs_analysed': 0,
    'total_markets_proposed': 0,
    'total_markets_deployed': 0,
    'last_cycle_at': None,
    'next_cycle_at': None,
    'last_cycle_errors': [],
    'recent_deployments': deque(maxlen=50),
    'recent_proposals': deque(maxlen=50),
    'loop_running': False,
}


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _http_client, _kite_client, _agent_state

    await connect_db()

    _http_client = httpx.AsyncClient(timeout=30.0)
    _kite_client = KiteClient(
        wallet_private_key=settings.kite_wallet_private_key,
        rpc_url=settings.kite_rpc_url,
        contract_address=settings.kite_market_factory_address,
        initial_liquidity_eth=settings.market_initial_liquidity_eth,
        resolution_days=settings.market_resolution_days,
        chain_id=settings.kite_chain_id,
    )

    await _kite_client.sync_deployed_prs_from_db()

    _agent_state['started_at'] = _utc_now()
    _agent_state['loop_running'] = True

    log.info('=' * 60)
    log.info(' Market Architect Agent v3 — Starting Up')
    log.info('=' * 60)
    log.info('  RPC:       %s', settings.kite_rpc_url)
    log.info('  Contract:  %s', settings.kite_market_factory_address or '(not set)')
    log.info('  Wallet:    %s', _kite_client.wallet_address)
    log.info('  Interval:  %ds', settings.poll_interval_seconds)
    log.info('  Dry run:   %s', settings.dry_run)
    log.info('  Web3 OK:   %s', _kite_client.is_ready())
    log.info('=' * 60)

    # ── Start background tasks ────────────────────────────────────────────────
    broadcaster_task = asyncio.create_task(log_broadcaster())   # ← NEW: WS log pump
    scout_task       = asyncio.create_task(_continuous_scout_loop())
    resolver_task    = asyncio.create_task(
        continuous_resolver_loop(_kite_client, settings)
    )

    yield

    _agent_state['loop_running'] = False
    for t in (broadcaster_task, scout_task, resolver_task):
        t.cancel()
        try:
            await t
        except asyncio.CancelledError:
            pass

    await _http_client.aclose()
    await disconnect_db()
    log.info('Market Architect Agent shut down.')


app = FastAPI(
    title='Market Architect Agent',
    description=(
        'Autonomous agent that monitors Solana core repositories and '
        'deploys prediction markets on the Kite AI blockchain.'
    ),
    version='3.0.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


# ── WebSocket endpoint ────────────────────────────────────────────────────────

@app.websocket('/ws/logs')
async def websocket_logs(websocket: WebSocket) -> None:
    """
    Real-time log stream. Connect from the Terminal page to receive
    every log.info / log.warning / log.error emitted by the agent.
    """
    await ws_manager.connect(websocket)
    try:
        # Keep the connection alive — we only push; the client needn't send anything.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# ── Background scout loop ─────────────────────────────────────────────────────

async def _continuous_scout_loop() -> None:
    interval = settings.poll_interval_seconds
    await asyncio.sleep(5)

    while True:
        cycle_start = datetime.now(timezone.utc)
        log.info('━━━ Auto-cycle #%d starting ━━━', _agent_state['cycles_run'] + 1)

        try:
            result = await _run_full_cycle(
                dry_run=settings.dry_run,
                min_tss=settings.min_tss_score,
            )
            _agent_state['last_cycle_errors'] = result['errors']
        except Exception as exc:
            log.error('Auto-cycle crashed: %s', exc, exc_info=True)
            _agent_state['last_cycle_errors'] = [str(exc)]

        duration_ms = int(
            (datetime.now(timezone.utc) - cycle_start).total_seconds() * 1000
        )

        try:
            from db import db
            await db.agentcycle.create(data={
                'cycleType': 'SCOUT',
                'startedAt': cycle_start,
                'completedAt': datetime.now(timezone.utc),
                'durationMs': duration_ms,
                'prsAnalysed': _agent_state.get('_last_prs', 0),
                'marketsProposed': _agent_state.get('_last_proposed', 0),
                'marketsDeployed': _agent_state.get('_last_deployed', 0),
                'errors': _agent_state['last_cycle_errors'],
            })
        except Exception as exc:
            log.warning('Could not write AgentCycle to DB: %s', exc)

        _agent_state['next_cycle_at'] = f'in ~{interval}s'
        log.info('━━━ Cycle complete. Sleeping %ds ━━━', interval)
        await asyncio.sleep(interval)


# ── Core cycle logic ──────────────────────────────────────────────────────────

async def _run_full_cycle(
    dry_run: bool = False,
    min_tss: float | None = None,
) -> dict[str, Any]:
    if _http_client is None or _kite_client is None:
        raise RuntimeError('Agent not initialised.')

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

    # 1. Fetch PRs
    try:
        prs = await scout.fetch_merged_prs(limit=settings.pr_fetch_limit)
        tags = await scout.fetch_release_tags(limit=10)
        log.info('Fetched %d PRs and %d tags.', len(prs), len(tags))
    except httpx.HTTPStatusError as exc:
        msg = f'GitHub fetch failed ({exc.response.status_code}): {exc.response.text[:200]}'
        log.error(msg)
        errors.append(msg)
        _update_state(0, 0, 0, errors)
        return {'errors': errors, 'proposals': [], 'receipts': []}

    _agent_state['total_prs_analysed'] += len(prs)

    # 2. TSS filter
    high_signal = architect.filter_high_signal(prs)
    log.info('%d / %d PRs passed TSS ≥ %.2f', len(high_signal), len(prs), min_tss)

    new_prs = [
        pr for pr in high_signal
        if not _kite_client.already_deployed(pr.get('number', 0))
    ]
    skipped = len(high_signal) - len(new_prs)
    if skipped:
        log.info('Skipping %d already-deployed PRs.', skipped)

    # 3. Generate proposals
    for pr in new_prs:
        try:
            proposal = await architect.generate_market_proposal(pr)
            proposals.append(proposal)
            _agent_state['recent_proposals'].appendleft({
                'pr_number': pr.get('number'),
                'pr_title': pr.get('title', '')[:80],
                'market_title': proposal.get('title', '')[:80],
                'tss_score': proposal.get('tss_score'),
                'resolution_type': proposal.get('resolution_type'),
                'generated_at': _utc_now_str(),
            })
        except Exception as exc:
            msg = f"Proposal generation failed for PR #{pr.get('number')}: {exc}"
            log.warning(msg)
            errors.append(msg)

    _agent_state['total_markets_proposed'] += len(proposals)
    log.info('Generated %d market proposals.', len(proposals))

    # 4. Deploy on-chain + persist to DB
    if not dry_run and proposals:
        for proposal in proposals:
            try:
                receipt = await _kite_client.create_onchain_market(proposal)
                if receipt.get('skipped'):
                    continue

                receipts.append(receipt)
                _agent_state['recent_deployments'].appendleft({
                    **receipt,
                    'market_title': receipt.get('market_title', '')[:80],
                })

                db_market = await MarketArchitect.save_proposal_to_db(proposal, receipt)
                if db_market:
                    log.info(
                        "✅ Market deployed + persisted: '%s' | db=%s | tx=%s",
                        receipt.get('market_title', '')[:50],
                        db_market.id,
                        str(receipt.get('transaction_hash', ''))[:16] + '…',
                    )
                else:
                    log.warning(
                        "Market deployed on-chain but DB save failed: '%s'",
                        receipt.get('market_title', '')[:50],
                    )

            except Exception as exc:
                msg = f"Deployment failed for '{proposal.get('title', '')}': {exc}"
                log.error(msg)
                errors.append(msg)

    elif dry_run:
        log.info('DRY RUN — skipping %d deployments.', len(proposals))

    _agent_state['_last_prs'] = len(prs)
    _agent_state['_last_proposed'] = len(proposals)
    _agent_state['_last_deployed'] = len(receipts)
    _update_state(len(prs), len(proposals), len(receipts), errors)

    return {
        'prs_analysed': len(prs),
        'markets_proposed': len(proposals),
        'markets_deployed': len(receipts),
        'proposals': proposals,
        'receipts': receipts,
        'errors': errors,
    }


def _update_state(prs: int, proposed: int, deployed: int, errors: list[str]) -> None:
    _agent_state['cycles_run'] += 1
    _agent_state['total_markets_deployed'] += deployed
    _agent_state['last_cycle_at'] = _utc_now_str()
    _agent_state['last_cycle_errors'] = errors


# ── Pydantic schemas ──────────────────────────────────────────────────────────

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


# ── REST Routes ───────────────────────────────────────────────────────────────

@app.get('/health', tags=['meta'])
async def health() -> dict:
    return {
        'status': 'ok',
        'agent': 'market_architect',
        'version': '3.0.0',
        'loop_running': _agent_state['loop_running'],
        'cycles_run': _agent_state['cycles_run'],
        'web3_ready': _kite_client.is_ready() if _kite_client else False,
        'ws_connections': len(ws_manager.active_connections),
    }


@app.get('/status', tags=['meta'])
async def agent_status() -> dict:
    contract_info: dict = {}
    if _kite_client:
        try:
            contract_info = await _kite_client.get_contract_info()
        except Exception as exc:
            contract_info = {'error': str(exc)}

    return {
        'agent_state': {
            **{k: v for k, v in _agent_state.items()
               if k not in ('recent_deployments', 'recent_proposals', '_last_prs', '_last_proposed', '_last_deployed')},
            'recent_deployments': list(_agent_state['recent_deployments'])[:10],
            'recent_proposals': list(_agent_state['recent_proposals'])[:10],
        },
        'config': {
            'repo': f"{settings.github_repo_owner}/{settings.github_repo_name}",
            'poll_interval_seconds': settings.poll_interval_seconds,
            'min_tss_score': settings.min_tss_score,
            'dry_run': settings.dry_run,
            'initial_liquidity_eth': settings.market_initial_liquidity_eth,
            'resolution_days': settings.market_resolution_days,
        },
        'contract': contract_info,
    }


@app.get('/scout/prs', tags=['scout'])
async def list_recent_prs(
    limit: int = Query(default=20, ge=1, le=100),
    score: bool = Query(default=True),
) -> list[dict]:
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
            pr['tss_score'] = architect.compute_tss(pr)

    return prs


@app.get('/scout/tags', tags=['scout'])
async def list_recent_tags(limit: int = Query(default=10, ge=1, le=50)) -> list[dict]:
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


@app.post('/run-cycle', tags=['agent'], response_model=RunCycleResponse)
async def run_cycle(body: RunCycleRequest = RunCycleRequest()) -> RunCycleResponse:
    result = await _run_full_cycle(dry_run=body.dry_run, min_tss=body.min_tss)
    return RunCycleResponse(
        prs_analysed=result['prs_analysed'],
        markets_proposed=result['markets_proposed'],
        markets_deployed=result['markets_deployed'],
        proposals=result['proposals'],
        deployment_receipts=result['receipts'],
        errors=result['errors'],
    )


@app.post('/run-cycle/background', tags=['agent'], status_code=status.HTTP_202_ACCEPTED)
async def run_cycle_background(
    background_tasks: BackgroundTasks,
    body: RunCycleRequest = RunCycleRequest(),
) -> dict:
    async def _task():
        try:
            result = await _run_full_cycle(dry_run=body.dry_run, min_tss=body.min_tss)
            log.info(
                'Manual background cycle done: %d deployed, %d errors',
                result['markets_deployed'], len(result['errors']),
            )
        except Exception as exc:
            log.exception('Manual background cycle failed: %s', exc)

    background_tasks.add_task(_task)
    return {'status': 'accepted', 'message': 'Agentic cycle started in background.'}


@app.get('/markets', tags=['blockchain'])
async def list_deployed_markets(
    status_filter: str = Query(default='OPEN', description='OPEN, RESOLVED, INVALID, or ALL'),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict]:
    try:
        from db import db
        where = {} if status_filter == 'ALL' else {'status': status_filter}
        markets = await db.market.find_many(
            where=where,
            order={'createdAt': 'desc'},
            take=limit,
        )
        return [
            {
                'id': m.id,
                'onchain_market_id': m.onchainMarketId,
                'title': m.title,
                'category': m.category,
                'status': m.status,
                'outcome': m.outcome,
                'resolution_type': m.resolutionType,
                'data_source_url': m.dataSourceUrl,
                'tss_score': m.tssScore,
                'source_pr_number': m.sourcePrNumber,
                'created_at': m.createdAt.isoformat() if m.createdAt else None,
                'resolved_at': m.resolvedAt.isoformat() if m.resolvedAt else None,
                'resolution_deadline': m.resolutionDeadline.isoformat() if m.resolutionDeadline else None,
                'resolve_attempts': m.resolveAttempts,
                'last_error': m.lastError,
            }
            for m in markets
        ]
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.get('/markets/{market_id}', tags=['blockchain'])
async def get_market(market_id: str) -> dict:
    try:
        from db import db
        market = await db.market.find_unique(
            where={'id': market_id},
            include={'resolutionLogs': True},
        )
        if not market:
            raise HTTPException(status_code=404, detail='Market not found')
        return {
            'id': market.id,
            'onchain_market_id': market.onchainMarketId,
            'title': market.title,
            'question': market.question,
            'category': market.category,
            'status': market.status,
            'outcome': market.outcome,
            'resolution_type': market.resolutionType,
            'data_source_url': market.dataSourceUrl,
            'evaluation_logic': market.evaluationLogic,
            'agent_reason': market.agentReason,
            'tss_score': market.tssScore,
            'source_pr_number': market.sourcePrNumber,
            'source_pr_url': market.sourcePrUrl,
            'transaction_hash': market.transactionHash,
            'resolution_tx_hash': market.resolutionTxHash,
            'resolution_note': market.resolutionNote,
            'created_at': market.createdAt.isoformat() if market.createdAt else None,
            'resolved_at': market.resolvedAt.isoformat() if market.resolvedAt else None,
            'resolution_deadline': market.resolutionDeadline.isoformat() if market.resolutionDeadline else None,
            'resolve_attempts': market.resolveAttempts,
            'resolution_logs': [
                {
                    'attempt': rl.attemptNumber,
                    'resolver_type': rl.resolverType,
                    'decision': rl.decision,
                    'reasoning': rl.reasoning,
                    'tx_hash': rl.txHash,
                    'attempted_at': rl.attemptedAt.isoformat(),
                }
                for rl in (market.resolutionLogs or [])
            ],
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.get('/deployments', tags=['agent'])
async def recent_deployments(limit: int = Query(default=20, ge=1, le=50)) -> list[dict]:
    return list(_agent_state['recent_deployments'])[:limit]


@app.get('/cycles', tags=['agent'])
async def recent_cycles(limit: int = Query(default=10, ge=1, le=50)) -> list[dict]:
    try:
        from db import db
        cycles = await db.agentcycle.find_many(
            order={'startedAt': 'desc'},
            take=limit,
        )
        return [
            {
                'id': c.id,
                'cycle_type': c.cycleType,
                'started_at': c.startedAt.isoformat(),
                'duration_ms': c.durationMs,
                'prs_analysed': c.prsAnalysed,
                'markets_proposed': c.marketsProposed,
                'markets_deployed': c.marketsDeployed,
                'markets_resolved': c.marketsResolved,
                'errors': c.errors,
            }
            for c in cycles
        ]
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_client() -> httpx.AsyncClient:
    if _http_client is None:
        raise RuntimeError('HTTP client not initialised.')
    return _http_client


def _handle_github_error(exc: httpx.HTTPStatusError) -> None:
    if exc.response.status_code == 401:
        raise HTTPException(status_code=502, detail='GitHub token invalid or missing.')
    if exc.response.status_code in (403, 429):
        reset = exc.response.headers.get('X-RateLimit-Reset', 'unknown')
        raise HTTPException(status_code=429, detail=f'GitHub rate limit. Resets at {reset}.')
    raise HTTPException(status_code=502, detail=f'GitHub API error {exc.response.status_code}')


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _utc_now_str() -> str:
    return _utc_now().isoformat()