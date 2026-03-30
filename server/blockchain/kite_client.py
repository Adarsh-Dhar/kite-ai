"""
blockchain/kite_client.py — Kite AI Web3 Integration
=====================================================
Real implementation using web3.py to interact with the KitePredictionMarket
contract deployed on the Kite AI testnet (chainId 2368).

Handles:
  • Real wallet address derivation from private key
  • On-chain market creation via KitePredictionMarket.createMarket()
  • Transaction signing, broadcasting, and receipt waiting
  • Duplicate market deduplication (tracks deployed PR numbers)
  • Gas estimation and nonce management
"""

from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

# ── Lazy web3 import (graceful fallback if not installed) ─────────────────────
try:
    from web3 import AsyncWeb3, Web3
    from web3.middleware import ExtraDataToPOAMiddleware
    from eth_account import Account
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    log.warning(
        "web3 package not installed. Run: pip install web3\n"
        "Blockchain calls will be mocked until web3 is available."
    )


# ── Data models ───────────────────────────────────────────────────────────────

@dataclass
class MarketDeploymentReceipt:
    """Returned after a successful on-chain market deployment."""
    market_id: int                 # On-chain marketId (uint256 from contract)
    transaction_hash: str
    block_number: int
    contract_address: str          # The KitePredictionMarket contract address
    initial_liquidity_wei: int
    deployed_at: int               # Unix timestamp
    question: str
    category: str


# ── Kite AI Client ────────────────────────────────────────────────────────────

class KiteClient:
    """
    Async Kite AI blockchain client — real web3.py implementation.

    Connects to KitePredictionMarket.sol and calls createMarket() for each
    high-signal PR that passes the TSS filter.

    Args:
        wallet_private_key: Hex-encoded private key (with or without 0x prefix).
        rpc_url: JSON-RPC endpoint for the Kite AI chain.
        contract_address: Deployed KitePredictionMarket contract address.
        initial_liquidity_eth: KITE to seed each new market (minimum 0.01).
        resolution_days: How many days until the market's trading deadline.
        chain_id: Network chain ID (Kite testnet = 2368).
        abi_path: Path to the contract ABI JSON file.
    """

    ABI_PATH = Path(__file__).parent.parent / "contract" / "PredictionMarket.json"

    def __init__(
        self,
        wallet_private_key: str,
        rpc_url: str = "https://rpc-testnet.gokite.ai",
        contract_address: str = "",
        initial_liquidity_eth: float = 0.05,
        resolution_days: int = 30,
        chain_id: int = 2368,
        abi_path: Path | None = None,
    ) -> None:
        self._private_key = self._normalise_key(wallet_private_key)
        self._rpc_url = rpc_url
        self._contract_address = contract_address
        self._liquidity_wei = int(initial_liquidity_eth * 1e18)
        self._resolution_days = resolution_days
        self._chain_id = chain_id
        self._abi_path = abi_path or self.ABI_PATH

        # Derive wallet address
        if WEB3_AVAILABLE and self._private_key:
            acct = Account.from_key(self._private_key)
            self._wallet_address: str = acct.address
        else:
            self._wallet_address = "0x0000000000000000000000000000000000000000"

        # Load ABI
        self._contract_abi: list[dict] = self._load_abi()

        # Web3 instance (initialised lazily)
        self._w3: AsyncWeb3 | None = None

        # In-memory set of PR numbers already deployed this session.
        # Persisted as a simple JSON file to survive restarts.
        self._deployed_prs: set[int] = self._load_deployed_prs()

        log.info(
            "KiteClient initialised | wallet=%s | contract=%s | rpc=%s",
            self._wallet_address,
            self._contract_address or "(not set)",
            self._rpc_url,
        )

    # ── Public API ─────────────────────────────────────────────────────────────

    @property
    def wallet_address(self) -> str:
        return self._wallet_address

    def is_ready(self) -> bool:
        """Returns True if the client has everything needed for real deployments."""
        return bool(
            WEB3_AVAILABLE
            and self._private_key
            and self._contract_address
            and self._contract_address != "0xMarketFactoryContractAddress"
        )

    def already_deployed(self, pr_number: int) -> bool:
        """Returns True if a market for this PR was already deployed."""
        return pr_number in self._deployed_prs

    async def get_contract_info(self) -> dict[str, Any]:
        """Fetch live contract state (market count, fee, owner)."""
        if not self.is_ready():
            return {"error": "Client not fully configured", "mock": True}
        try:
            w3 = await self._get_w3()
            contract = w3.eth.contract(
                address=Web3.to_checksum_address(self._contract_address),
                abi=self._contract_abi,
            )
            market_count = await contract.functions.marketCount().call()
            fee_bps = await contract.functions.platformFeeBps().call()
            owner = await contract.functions.owner().call()
            balance = await w3.eth.get_balance(
                Web3.to_checksum_address(self._wallet_address)
            )
            return {
                "market_count": market_count,
                "platform_fee_bps": fee_bps,
                "owner": owner,
                "wallet_address": self._wallet_address,
                "wallet_balance_eth": balance / 1e18,
                "contract_address": self._contract_address,
                "chain_id": self._chain_id,
            }
        except Exception as exc:
            log.error("Failed to fetch contract info: %s", exc)
            return {"error": str(exc)}

    async def create_onchain_market(
        self,
        market_data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Deploy a prediction market on the Kite AI blockchain.

        Calls KitePredictionMarket.createMarket(question, category, oracle, deadline)
        with msg.value = initial_liquidity_wei.

        Args:
            market_data: Proposal dict with keys: title, description, options,
                         source_pr_number, tss_score, agent_reason.

        Returns:
            A dict with transaction_hash, block_number, market_id, etc.
        """
        pr_number = market_data.get("source_pr_number", 0)
        title = market_data.get("title", "Untitled")

        # Dedup guard
        if pr_number and self.already_deployed(pr_number):
            log.info("PR #%s already deployed — skipping.", pr_number)
            return {"skipped": True, "reason": f"PR #{pr_number} already deployed"}

        if not self.is_ready():
            log.warning("KiteClient not fully configured — using mock deployment.")
            return self._mock_receipt(market_data)

        try:
            receipt = await self._deploy_market(market_data)
            # Mark as deployed
            if pr_number:
                self._deployed_prs.add(pr_number)
                self._save_deployed_prs()
            return receipt
        except Exception as exc:
            log.error("On-chain market deployment failed for '%s': %s", title, exc)
            raise RuntimeError(f"Deployment failed: {exc}") from exc

    # ── Private: Web3 interaction ──────────────────────────────────────────────

    async def _get_w3(self) -> AsyncWeb3:
        """Return (or create) the AsyncWeb3 instance."""
        if self._w3 is None:
            self._w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(self._rpc_url))
            # Kite AI testnet uses PoA — inject middleware to handle extraData
            self._w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        return self._w3

    async def _deploy_market(self, market_data: dict[str, Any]) -> dict[str, Any]:
        """Core transaction-building, signing, and broadcasting logic."""
        w3 = await self._get_w3()

        checksum_contract = Web3.to_checksum_address(self._contract_address)
        checksum_wallet = Web3.to_checksum_address(self._wallet_address)

        contract = w3.eth.contract(
            address=checksum_contract,
            abi=self._contract_abi,
        )

        # Build market params
        question = market_data.get("description") or market_data.get("title", "?")
        # Truncate to reasonable length
        question = question[:300]
        category = self._infer_category(market_data)
        oracle = checksum_wallet  # deployer is oracle for now
        deadline = int(time.time()) + self._resolution_days * 86400

        log.info(
            "Building createMarket tx | question='%s...' | liquidity=%.4f ETH",
            question[:60],
            self._liquidity_wei / 1e18,
        )

        # Check wallet balance
        balance = await w3.eth.get_balance(checksum_wallet)
        if balance < self._liquidity_wei:
            raise RuntimeError(
                f"Insufficient wallet balance: have {balance / 1e18:.4f} KITE, "
                f"need {self._liquidity_wei / 1e18:.4f} KITE"
            )

        # Get current nonce
        nonce = await w3.eth.get_transaction_count(checksum_wallet)

        # Estimate gas
        try:
            gas_estimate = await contract.functions.createMarket(
                question, category, oracle, deadline
            ).estimate_gas({
                "from": checksum_wallet,
                "value": self._liquidity_wei,
            })
            gas_limit = int(gas_estimate * 1.3)  # 30% buffer
        except Exception as gas_exc:
            log.warning("Gas estimation failed (%s), using fallback 500_000", gas_exc)
            gas_limit = 500_000

        gas_price = await w3.eth.gas_price

        # Build transaction
        tx = await contract.functions.createMarket(
            question,
            category,
            oracle,
            deadline,
        ).build_transaction({
            "from": checksum_wallet,
            "value": self._liquidity_wei,
            "nonce": nonce,
            "gas": gas_limit,
            "gasPrice": gas_price,
            "chainId": self._chain_id,
        })

        # Sign
        account = Account.from_key(self._private_key)
        signed = account.sign_transaction(tx)

        # Broadcast
        tx_hash = await w3.eth.send_raw_transaction(signed.raw_transaction)
        log.info("Transaction sent: %s — waiting for receipt…", tx_hash.hex())

        # Wait for mining (60s timeout)
        raw_receipt = await w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)

        if raw_receipt["status"] == 0:
            raise RuntimeError(
                f"Transaction reverted. Hash: {tx_hash.hex()}"
            )

        # Parse marketId from MarketCreated event log
        market_id = self._extract_market_id(contract, raw_receipt)

        log.info(
            "Market deployed ✓  marketId=%s  tx=%s  block=%d",
            market_id,
            tx_hash.hex()[:14] + "…",
            raw_receipt["blockNumber"],
        )

        return {
            "market_id": market_id,
            "transaction_hash": tx_hash.hex(),
            "block_number": raw_receipt["blockNumber"],
            "contract_address": self._contract_address,
            "initial_liquidity_eth": self._liquidity_wei / 1e18,
            "deployed_at": int(time.time()),
            "question": question,
            "category": category,
            "oracle": oracle,
            "resolution_deadline": deadline,
            "gas_used": raw_receipt["gasUsed"],
            "market_title": market_data.get("title", ""),
            "source_pr_number": market_data.get("source_pr_number"),
            "tss_score": market_data.get("tss_score"),
        }

    @staticmethod
    def _extract_market_id(contract: Any, receipt: Any) -> int | None:
        """Parse the MarketCreated event to get the new market's ID."""
        try:
            logs = contract.events.MarketCreated().process_receipt(receipt)
            if logs:
                return logs[0]["args"]["marketId"]
        except Exception as exc:
            log.warning("Could not parse MarketCreated event: %s", exc)
        return None

    # ── Private: Mock fallback ─────────────────────────────────────────────────

    @staticmethod
    def _mock_receipt(market_data: dict[str, Any]) -> dict[str, Any]:
        """
        Deterministic mock receipt used when the client is not fully configured.
        Makes it easy to test the pipeline end-to-end without real credentials.
        """
        import hashlib
        import uuid

        title = market_data.get("title", "Untitled")
        mock_hash = "0x" + hashlib.sha256(title.encode()).hexdigest()
        mock_addr = "0x" + hashlib.md5(title.encode()).hexdigest()[:40]

        log.warning("MOCK deployment for '%s' — configure KiteClient for real txs.", title)
        return {
            "market_id": None,
            "transaction_hash": mock_hash,
            "block_number": 14_000_000,
            "contract_address": mock_addr,
            "initial_liquidity_eth": 0.05,
            "deployed_at": int(time.time()),
            "question": market_data.get("description", ""),
            "category": KiteClient._infer_category(market_data),
            "oracle": "0x0000000000000000000000000000000000000000",
            "resolution_deadline": int(time.time()) + 30 * 86400,
            "gas_used": 0,
            "market_title": title,
            "source_pr_number": market_data.get("source_pr_number"),
            "tss_score": market_data.get("tss_score"),
            "mock": True,
        }

    # ── Private: Helpers ───────────────────────────────────────────────────────

    @staticmethod
    def _normalise_key(key: str) -> str:
        """Strip whitespace and ensure 0x prefix."""
        key = key.strip()
        if key and not key.startswith("0x"):
            key = "0x" + key
        return key

    @staticmethod
    def _infer_category(market_data: dict[str, Any]) -> str:
        """Pick a category tag from the market data / PR labels."""
        title_lower = (market_data.get("title", "") + " " + market_data.get("agent_reason", "")).lower()
        if any(k in title_lower for k in ["consensus", "alpenglow", "vote", "leader"]):
            return "Consensus"
        if any(k in title_lower for k in ["runtime", "bpf", "sbf", "loader"]):
            return "Runtime"
        if any(k in title_lower for k in ["security", "cve", "vuln"]):
            return "Security"
        if any(k in title_lower for k in ["perf", "scheduler", "banking"]):
            return "Performance"
        if any(k in title_lower for k in ["release", "upgrade", "migration"]):
            return "Release"
        return "Solana"

    def _load_abi(self) -> list[dict]:
        try:
            with open(self._abi_path) as f:
                data = json.load(f)
            # Handle both {"abi": [...]} and flat [...] formats
            if isinstance(data, list):
                return data
            return data.get("abi", [])
        except FileNotFoundError:
            log.warning("ABI file not found at %s — contract calls will fail.", self._abi_path)
            return []
        except json.JSONDecodeError as exc:
            log.error("Invalid ABI JSON at %s: %s", self._abi_path, exc)
            return []

    _DEPLOYED_PRS_PATH = Path(__file__).parent.parent / ".deployed_prs.json"

    def _load_deployed_prs(self) -> set[int]:
        try:
            with open(self._DEPLOYED_PRS_PATH) as f:
                return set(json.load(f))
        except (FileNotFoundError, json.JSONDecodeError):
            return set()

    def _save_deployed_prs(self) -> None:
        try:
            with open(self._DEPLOYED_PRS_PATH, "w") as f:
                json.dump(list(self._deployed_prs), f)
        except Exception as exc:
            log.warning("Could not persist deployed PRs list: %s", exc)