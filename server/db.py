"""
server/db.py — Prisma Database Client
======================================
Singleton async Prisma client.  Import `db` everywhere and call
`await db.connect()` once at startup (handled in main.py lifespan).

Usage:
    from db import db
    market = await db.market.find_unique(where={"id": market_id})
"""

from __future__ import annotations

import logging
from prisma import Prisma

log = logging.getLogger(__name__)

# Global singleton — initialised in main.py lifespan
db: Prisma = Prisma(auto_register=True)


async def connect_db() -> None:
    """Connect to PostgreSQL via Prisma. Call once at startup."""
    await db.connect()
    log.info("Prisma DB connected.")


async def disconnect_db() -> None:
    """Disconnect cleanly at shutdown."""
    await db.disconnect()
    log.info("Prisma DB disconnected.")