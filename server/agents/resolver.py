"""
server/agents/resolver.py — Market Resolver Agent
=================================================
Resolves open prediction markets on-chain by evaluating deterministic conditions
(e.g., GitHub PR merged/closed state) at regular intervals.
"""

import asyncio
import logging
import httpx
from typing import Any

log = logging.getLogger(__name__)

RESOLUTION_INTERVAL_SECONDS = 15 * 60  # 15 minutes

async def fetch_github(endpoint: str) -> dict[str, Any] | None:
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(endpoint)
            if resp.status_code == 200:
                return resp.json()
            log.warning(f"GitHub fetch failed: {endpoint} status={resp.status_code}")
    except Exception as exc:
        log.error(f"GitHub fetch error: {exc}")
    return None

async def resolve_cycle(kite_client, market_db):
    open_markets = await kite_client.get_all_open_markets()
    for market in open_markets:
        meta = market_db.get(market["market_id"])
        if not meta:
            continue
        pr_data = await fetch_github(meta["resolution_endpoint"])
        if pr_data is None:
            await kite_client.resolve_onchain_market(market["market_id"], "INVALID")
            continue
        if pr_data.get("merged") is True:
            outcome = "YES"
        elif pr_data.get("state") == "closed" and not pr_data.get("merged"):
            outcome = "NO"
        else:
            outcome = "PENDING"
        if outcome != "PENDING":
            await kite_client.resolve_onchain_market(market["market_id"], outcome)

async def continuous_resolver_loop(kite_client, market_db):
    await asyncio.sleep(10)
    while True:
        try:
            await resolve_cycle(kite_client, market_db)
        except Exception as exc:
            log.error(f"Resolver loop error: {exc}")
        await asyncio.sleep(RESOLUTION_INTERVAL_SECONDS)
