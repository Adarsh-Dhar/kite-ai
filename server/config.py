"""
config.py — Application Settings v2
=====================================
Adds DATABASE_URL and NVD_API_KEY to support Prisma and security tools.
"""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = Field(
        default="postgresql://user:password@localhost:5432/kite_markets",
        alias="DATABASE_URL",
        description="PostgreSQL connection string for Prisma.",
    )

    # ── GitHub ────────────────────────────────────────────────────────────────
    github_token: str = Field(
        ...,
        alias="GITHUB_TOKEN",
    )
    github_repo_owner: str = Field(default="anza-xyz", alias="GITHUB_REPO_OWNER")
    github_repo_name: str = Field(default="agave", alias="GITHUB_REPO_NAME")

    # ── LLM (Groq) ────────────────────────────────────────────────────────────
    llm_api_key: str = Field(default="", alias="GROQ_API_KEY")
    llm_model: str = Field(default="llama-3.3-70b-versatile", alias="GROQ_MODEL")

    # ── Kite AI Blockchain ────────────────────────────────────────────────────
    kite_api_key: str = Field(default="", alias="KITE_API_KEY")
    kite_wallet_private_key: str = Field(default="", alias="KITE_WALLET_PRIVATE_KEY")
    kite_rpc_url: str = Field(default="https://rpc-testnet.gokite.ai", alias="KITE_RPC_URL")
    kite_market_factory_address: str = Field(default="", alias="KITE_MARKET_FACTORY_ADDRESS")
    kite_chain_id: int = Field(default=2368, alias="KITE_CHAIN_ID")

    # ── Security Tools ────────────────────────────────────────────────────────
    nvd_api_key: str = Field(
        default="",
        alias="NVD_API_KEY",
        description="Optional NIST NVD API key — increases rate limits.",
    )

    # ── Agent behaviour ───────────────────────────────────────────────────────
    min_tss_score: float = Field(default=0.65, alias="MIN_TSS_SCORE")
    poll_interval_seconds: int = Field(default=300, alias="POLL_INTERVAL_SECONDS")
    pr_fetch_limit: int = Field(default=50, alias="PR_FETCH_LIMIT")
    market_resolution_days: int = Field(default=30, alias="MARKET_RESOLUTION_DAYS")
    market_initial_liquidity_eth: float = Field(default=0.05, alias="MARKET_INITIAL_LIQUIDITY_ETH")
    dry_run: bool = Field(default=False, alias="DRY_RUN")

    model_config = {
        "env_file": ".env",
        "populate_by_name": True,
        "extra": "ignore",
    }