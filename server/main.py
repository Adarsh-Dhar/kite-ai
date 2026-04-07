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
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.architect import MarketArchitect
from agents.resolver import continuous_resolver_loop
from blockchain.kite_client import KiteClient
from config import Settings
from db import connect_db, disconnect_db
from ws_logger import WebSocketLogHandler, ws_manager, log_broadcaster, current_session_id

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
    'drafts_run': 0,
    'total_markets_drafted': 0,
    'last_draft_at': None,
    'last_draft_errors': [],
    'recent_deployments': deque(maxlen=50),
    'recent_drafts': deque(maxlen=50),
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
    log.info('  Resolver:   %s', settings.poll_interval_seconds)
    log.info('  Dry run:   %s', settings.dry_run)
    log.info('  Web3 OK:   %s', _kite_client.is_ready())
    log.info('=' * 60)

    # ── Start background tasks ────────────────────────────────────────────────
    broadcaster_task = asyncio.create_task(log_broadcaster())
    resolver_task = asyncio.create_task(
        continuous_resolver_loop(_kite_client, settings)
    )

    yield

    _agent_state['loop_running'] = False
    for t in (broadcaster_task, resolver_task):
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
async def websocket_logs(websocket: WebSocket, session: str | None = None) -> None:
    """
    Real-time log stream. Connect from the Terminal page to receive
    every log.info / log.warning / log.error emitted by the agent.
    
    Optional query param: ?session=<session_id> to filter logs from a specific session.
    """
    await ws_manager.connect(websocket, session_filter=session)
    try:
        # Keep the connection alive — we only push; the client needn't send anything.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


class DraftMarketRequest(BaseModel):
    prompt: str
    session_id: str | None = None


# ── REST Routes ───────────────────────────────────────────────────────────────

@app.get('/health', tags=['meta'])
async def health() -> dict:
    return {
        'status': 'ok',
        'agent': 'market_architect',
        'version': '3.0.0',
        'loop_running': _agent_state['loop_running'],
        'drafts_run': _agent_state['drafts_run'],
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
               if k not in ('recent_deployments', 'recent_drafts')},
            'recent_deployments': list(_agent_state['recent_deployments'])[:10],
            'recent_drafts': list(_agent_state['recent_drafts'])[:10],
        },
        'config': {
            'poll_interval_seconds': settings.poll_interval_seconds,
            'dry_run': settings.dry_run,
            'initial_liquidity_eth': settings.market_initial_liquidity_eth,
            'resolution_days': settings.market_resolution_days,
            'llm_model': settings.llm_model,
        },
        'contract': contract_info,
    }


@app.post('/api/market/draft', tags=['market'])
async def draft_market(body: DraftMarketRequest) -> dict:
    if _http_client is None:
        raise RuntimeError('HTTP client not initialised.')

    # Set session context for logging
    if body.session_id:
        current_session_id.set(body.session_id)

    architect = MarketArchitect(
        http_client=_http_client,
        llm_api_key=settings.llm_api_key,
        llm_model=settings.llm_model,
    )
    draft = await architect.draft_market(body.prompt)
    _agent_state['drafts_run'] += 1
    _agent_state['total_markets_drafted'] += 1
    _agent_state['last_draft_at'] = _utc_now_str()
    _agent_state['recent_drafts'].appendleft({
        'prompt': body.prompt[:160],
        'title': draft.get('title', '')[:120],
        'resolution_type': draft.get('resolution_type'),
        'created_at': _utc_now_str(),
    })
    return draft


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


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _utc_now_str() -> str:
    return _utc_now().isoformat()