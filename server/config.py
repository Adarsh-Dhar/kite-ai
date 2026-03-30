"""
config.py — Application Settings
=================================
Loads all configuration from environment variables (or a .env file via
python-dotenv). Pydantic BaseSettings provides automatic type coercion,
validation, and clear error messages for missing required fields.
"""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── GitHub ────────────────────────────────────────────────────────────────
    github_token: str = Field(
        ...,
        alias="GITHUB_TOKEN",
        description="Personal access token for the GitHub API (classic or fine-grained).",
    )
    github_repo_owner: str = Field(
        default="anza-xyz",
        alias="GITHUB_REPO_OWNER",
    )
    github_repo_name: str = Field(
        default="agave",
        alias="GITHUB_REPO_NAME",
    )

    # ── LLM (Groq) ────────────────────────────────────────────────────────────
    llm_api_key: str = Field(
        default="",
        alias="GROQ_API_KEY",
        description="API key for the Groq platform.",
    )
    llm_model: str = Field(
        default="llama-3.3-70b-versatile",
        alias="GROQ_MODEL",
    )

    # ── Kite AI Blockchain ────────────────────────────────────────────────────
    kite_api_key: str = Field(
        default="",
        alias="KITE_API_KEY",
        description="Kite AI platform API key for agent passport management.",
    )
    kite_wallet_private_key: str = Field(
        default="",
        alias="KITE_WALLET_PRIVATE_KEY",
        description="Hex-encoded private key of the deployer wallet.",
    )
    kite_rpc_url: str = Field(
        default="https://rpc-testnet.gokite.ai",
        alias="KITE_RPC_URL",
    )
    kite_market_factory_address: str = Field(
        default="",
        alias="KITE_MARKET_FACTORY_ADDRESS",
        description="Smart contract address of the deployed KitePredictionMarket.",
    )
    kite_chain_id: int = Field(
        default=2368,
        alias="KITE_CHAIN_ID",
        description="Chain ID for the Kite AI testnet.",
    )

    # ── Agent behaviour ───────────────────────────────────────────────────────
    min_tss_score: float = Field(
        default=0.65,
        alias="MIN_TSS_SCORE",
        description="Minimum Technical Significance Score for a PR to be market-worthy.",
    )
    poll_interval_seconds: int = Field(
        default=300,
        alias="POLL_INTERVAL_SECONDS",
        description="Seconds between autonomous scouting cycles.",
    )
    pr_fetch_limit: int = Field(
        default=50,
        alias="PR_FETCH_LIMIT",
        description="Number of PRs to fetch per cycle.",
    )
    market_resolution_days: int = Field(
        default=30,
        alias="MARKET_RESOLUTION_DAYS",
        description="Days after which a deployed market's trading closes.",
    )
    market_initial_liquidity_eth: float = Field(
        default=0.05,
        alias="MARKET_INITIAL_LIQUIDITY_ETH",
        description="Initial KITE liquidity to seed each market (in ether).",
    )
    dry_run: bool = Field(
        default=False,
        alias="DRY_RUN",
        description="If True, skip on-chain deployment (test mode).",
    )

    model_config = {
        "env_file": ".env",
        "populate_by_name": True,
        "extra": "ignore",
    }