"""
blockchain/kite_client.py — Kite AI SDK Integration
=====================================================
Handles:
  • Agent Passport creation / retrieval
  • Session Key derivation (ephemeral keys for agentic transactions)
  • On-chain market deployment via the Kite Market Factory smart contract
  • x402 payment protocol for USDC-denominated market creation fees

All blockchain calls are currently MOCKED with realistic data structures.
Replace the mock sections with actual Kite AI SDK / web3.py / ethers calls
once you have access to the Kite AI SDK package.

Kite AI concepts modelled here:
  - Agent Passport: An on-chain identity NFT that anchors an autonomous agent
    to a wallet address and grants it permissions to operate on the platform.
  - Session Key: A short-lived derived key (EIP-7715 / AA extension) that allows
    the agent to sign transactions without exposing the master private key.
  - x402 Payment: HTTP-native micro-payment protocol; the agent pays a USDC fee
    per market creation directly within the API request lifecycle.
"""

from __future__ import annotations

import hashlib
import logging
import time
import uuid
from dataclasses import dataclass, field
from typing import Any

import httpx

log = logging.getLogger(__name__)


# ── Data models ───────────────────────────────────────────────────────────────

@dataclass
class AgentPassport:
    """On-chain identity record for the Market Architect agent."""

    passport_id: str          # UUID-based on-chain identifier
    agent_name: str = "MarketArchitectV1"
    agent_version: str = "1.0.0"
    wallet_address: str = ""
    permissions: list[str] = field(default_factory=lambda: [
        "create_market",
        "fund_market",
        "resolve_market",
    ])
    is_active: bool = True
    created_at: int = field(default_factory=lambda: int(time.time()))


@dataclass
class SessionKey:
    """
    Short-lived ephemeral key derived from the master wallet.

    In a real implementation this would be an ERC-4337 / EIP-7715 session key
    stored off-chain and valid only for a specific smart contract + method scope.
    """

    session_id: str
    ephemeral_public_key: str     # Derived public key (hex)
    scope_contract: str           # Contract this key may interact with
    scope_methods: list[str]      # Allowed method selectors
    valid_until: int              # Unix timestamp
    max_spend_usdc: float         # Maximum USDC spend authorised per session


@dataclass
class MarketDeploymentReceipt:
    """Returned after a successful on-chain market deployment."""

    market_id: str
    transaction_hash: str
    block_number: int
    market_address: str          # Deployed prediction market contract address
    creation_fee_usdc: float
    x402_payment_ref: str        # x402 payment reference for auditing
    deployed_at: int             # Unix timestamp


# ── Kite AI Client ────────────────────────────────────────────────────────────

class KiteClient:
    """
    Async Kite AI blockchain client.

    Args:
        api_key: Kite platform API key (used for passport management endpoints).
        wallet_private_key: Hex private key of the deployer wallet.
        rpc_url: JSON-RPC endpoint for the Kite AI chain.
        market_factory_address: Address of the Market Factory smart contract.
        session_key_ttl_seconds: Lifetime of generated session keys.
        market_creation_fee_usdc: Fee charged per market deployment.
    """

    def __init__(
        self,
        api_key: str,
        wallet_private_key: str,
        rpc_url: str = "https://rpc.kiteai.xyz",
        market_factory_address: str = "0xMarketFactoryContractAddress",
        session_key_ttl_seconds: int = 3600,
        market_creation_fee_usdc: float = 1.00,
    ) -> None:
        self._api_key = api_key
        self._private_key = wallet_private_key
        self._rpc_url = rpc_url
        self._factory_address = market_factory_address
        self._session_ttl = session_key_ttl_seconds
        self._creation_fee = market_creation_fee_usdc

        # Derive a mock wallet address from the private key for traceability.
        self._wallet_address = self._derive_address(wallet_private_key)

        # Cache the passport to avoid redundant on-chain lookups.
        self._passport: AgentPassport | None = None

    # ── Public API ─────────────────────────────────────────────────────────────

    async def get_or_create_passport(self) -> AgentPassport:
        """
        Retrieve the existing Agent Passport or mint a new one.

        Real implementation: call the Kite Passport Registry smart contract
        ``getPassport(walletAddress)`` — if it returns zero address, call
        ``mintPassport(agentMetadata)``.
        """
        if self._passport:
            return self._passport

        log.info("Fetching Agent Passport for wallet %s …", self._wallet_address)

        # ── MOCK ──────────────────────────────────────────────────────────────
        # Replace this block with an actual RPC call, e.g.:
        #   contract = load_contract(PASSPORT_REGISTRY_ABI, PASSPORT_REGISTRY_ADDR)
        #   passport_data = await contract.functions.getPassport(self._wallet_address).call()
        #   if passport_data["passportId"] == "0x0000...":
        #       tx = await contract.functions.mintPassport({...}).transact(...)
        # ─────────────────────────────────────────────────────────────────────
        self._passport = AgentPassport(
            passport_id=str(uuid.uuid5(uuid.NAMESPACE_DNS, self._wallet_address)),
            wallet_address=self._wallet_address,
        )
        log.info("Agent Passport ready: %s", self._passport.passport_id)
        return self._passport

    async def create_session_key(self) -> SessionKey:
        """
        Derive a short-lived session key scoped to market creation methods.

        Real implementation: use EIP-7715 ``wallet_grantPermissions`` or the
        Kite AI SDK ``SessionKeyManager.create()`` to register the ephemeral
        key on-chain with spend limits.
        """
        passport = await self.get_or_create_passport()
        now = int(time.time())
        valid_until = now + self._session_ttl

        # Deterministic ephemeral key derivation (mock — NOT cryptographically secure).
        entropy = f"{self._private_key}:{now}:{passport.passport_id}"
        ephemeral_pub = "0x" + hashlib.sha256(entropy.encode()).hexdigest()

        session = SessionKey(
            session_id=str(uuid.uuid4()),
            ephemeral_public_key=ephemeral_pub,
            scope_contract=self._factory_address,
            scope_methods=["createMarket(bytes)", "fundMarket(uint256,uint256)"],
            valid_until=valid_until,
            max_spend_usdc=50.0,   # Guard rail: max $50 USDC per session
        )

        log.info(
            "Session key created: %s (valid for %ds, scope=%s)",
            session.session_id,
            self._session_ttl,
            self._factory_address,
        )
        # ── MOCK ──────────────────────────────────────────────────────────────
        # Real: register session_key on Kite AA module via SDK
        #   kite_sdk.session_keys.register(
        #       ephemeral_pub=session.ephemeral_public_key,
        #       scope=session.scope_contract,
        #       methods=session.scope_methods,
        #       expires=session.valid_until,
        #       max_spend=session.max_spend_usdc,
        #   )
        # ─────────────────────────────────────────────────────────────────────
        return session

    async def create_onchain_market(
        self,
        market_data: dict[str, Any],
        session_key: SessionKey,
    ) -> dict[str, Any]:
        """
        Deploy a prediction market on the Kite AI blockchain.

        Flow:
          1. Validate the session key is still live.
          2. Execute an x402 USDC payment for the market creation fee.
          3. Call ``MarketFactory.createMarket(title, description, options)``
             signed with the session key.
          4. Return a structured deployment receipt.

        Args:
            market_data: The proposal dict (keys: title, description, options, …).
            session_key: A valid ``SessionKey`` with sufficient remaining spend.

        Raises:
            ValueError: If the session key has expired or insufficient scope.
            RuntimeError: If the blockchain transaction reverts.
        """
        self._validate_session_key(session_key)

        title = market_data.get("title", "Untitled Market")
        log.info("Deploying market on-chain: '%s' …", title)

        # ── Step 1: x402 payment ──────────────────────────────────────────────
        payment_ref = await self._execute_x402_payment(
            amount_usdc=self._creation_fee,
            session_key=session_key,
            memo=f"Market creation fee: {title[:40]}",
        )

        # ── Step 2: Smart contract call ───────────────────────────────────────
        # ── MOCK ──────────────────────────────────────────────────────────────
        # Real implementation (pseudocode using web3.py / kite-sdk):
        #
        #   factory = self._load_contract(MARKET_FACTORY_ABI, self._factory_address)
        #   encoded = factory.encode_abi(
        #       "createMarket",
        #       args=[
        #           market_data["title"],
        #           market_data["description"],
        #           market_data["options"],          # ["Yes", "No"]
        #           int(time.time()) + 30 * 86400,   # resolution deadline (30 days)
        #           payment_ref,                     # x402 payment proof
        #       ],
        #   )
        #   user_op = await kite_sdk.build_user_operation(
        #       to=self._factory_address,
        #       data=encoded,
        #       session_key=session_key.ephemeral_public_key,
        #   )
        #   tx_hash = await kite_sdk.send_user_operation(user_op)
        #   receipt = await kite_sdk.wait_for_receipt(tx_hash)
        #   market_address = receipt.logs[0].address  # emitted by factory
        # ─────────────────────────────────────────────────────────────────────
        market_address = "0x" + hashlib.sha256(
            f"{title}:{time.time()}".encode()
        ).hexdigest()[:40]
        tx_hash = "0x" + hashlib.sha256(
            f"{payment_ref}:{market_address}".encode()
        ).hexdigest()
        block_number = 14_000_000 + abs(hash(tx_hash)) % 100_000  # simulated block

        receipt = MarketDeploymentReceipt(
            market_id=str(uuid.uuid4()),
            transaction_hash=tx_hash,
            block_number=block_number,
            market_address=market_address,
            creation_fee_usdc=self._creation_fee,
            x402_payment_ref=payment_ref,
            deployed_at=int(time.time()),
        )

        log.info(
            "Market deployed ✓  address=%s  tx=%s  block=%d",
            receipt.market_address,
            receipt.transaction_hash[:12] + "…",
            receipt.block_number,
        )

        return {
            "market_id": receipt.market_id,
            "transaction_hash": receipt.transaction_hash,
            "block_number": receipt.block_number,
            "market_address": receipt.market_address,
            "creation_fee_usdc": receipt.creation_fee_usdc,
            "x402_payment_ref": receipt.x402_payment_ref,
            "deployed_at": receipt.deployed_at,
            "market_title": title,
        }

    # ── Private helpers ────────────────────────────────────────────────────────

    async def _execute_x402_payment(
        self,
        amount_usdc: float,
        session_key: SessionKey,
        memo: str = "",
    ) -> str:
        """
        Execute an x402 micro-payment for the market creation fee.

        x402 is an HTTP-native payment protocol: the server returns a 402
        Payment Required response containing a payment request header; the
        client agent pays the exact amount via USDC transfer and re-submits
        the request with a ``X-Payment`` header containing a signed receipt.

        Real implementation:
          1. POST to Kite payment endpoint → receive 402 with ``Pay-To`` header.
          2. Sign a USDC transfer using the session key.
          3. Re-submit with ``X-Payment: <signed_receipt>``.

        ── MOCK ────────────────────────────────────────────────────────────────
        """
        payment_ref = f"x402-{uuid.uuid4().hex[:16]}"
        log.info(
            "x402 payment executed: %.2f USDC | ref=%s | memo='%s'",
            amount_usdc,
            payment_ref,
            memo,
        )
        return payment_ref

    def _validate_session_key(self, key: SessionKey) -> None:
        """Raise if the session key has expired or wrong scope."""
        now = int(time.time())
        if key.valid_until < now:
            raise ValueError(
                f"Session key {key.session_id} expired at {key.valid_until} (now={now})."
            )
        if self._factory_address not in key.scope_contract:
            raise ValueError(
                f"Session key scope '{key.scope_contract}' does not include "
                f"market factory '{self._factory_address}'."
            )

    @staticmethod
    def _derive_address(private_key: str) -> str:
        """
        Derive a mock wallet address from a private key hex string.
        Real: use eth_account.Account.from_key(private_key).address
        """
        if not private_key:
            return "0x0000000000000000000000000000000000000000"
        digest = hashlib.sha256(private_key.encode()).hexdigest()
        return "0x" + digest[:40]