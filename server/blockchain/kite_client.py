"""
blockchain/kite_client.py — Kite AI Web3 Integration (v2)
==========================================================
Real implementation using web3.py to interact with the KitePredictionMarket
contract deployed on the Kite AI testnet (chainId 2368).

Changes in v2:
  • _load_deployed_prs / _save_deployed_prs now use Prisma DB instead of JSON file
  • already_deployed() queries the DB
  • get_all_open_markets() added for resolver agent
  • resolve_onchain_market() kept and cleaned up
"""

from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

# ── Lazy web3 import ──────────────────────────────────────────────────────────
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


class KiteClient:
    """
    Async Kite AI blockchain client — real web3.py implementation with Prisma DB.

    Args:
        wallet_private_key: Hex-encoded private key (with or without 0x prefix).
        rpc_url: JSON-RPC endpoint for the Kite AI chain.
        contract_address: Deployed KitePredictionMarket contract address.
        initial_liquidity_eth: KITE to seed each new market (minimum 0.01).
        resolution_days: How many days until the market's trading deadline.
        chain_id: Network chain ID (Kite testnet = 2368).
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

        if WEB3_AVAILABLE and self._private_key:
            acct = Account.from_key(self._private_key)
            self._wallet_address: str = acct.address
        else:
            self._wallet_address = "0x0000000000000000000000000000000000000000"

        self._contract_abi: list[dict] = self._load_abi()
        self._w3: AsyncWeb3 | None = None

        # In-memory cache of deployed PR numbers (backed by DB at startup)
        self._deployed_prs_cache: set[int] = set()

        log.info(
            "KiteClient initialised | wallet=%s | contract=%s | rpc=%s",
            self._wallet_address,
            self._contract_address or "(not set)",
            self._rpc_url,
        )

    # ── Startup DB sync ───────────────────────────────────────────────────────

    async def sync_deployed_prs_from_db(self) -> None:
        """
        Load already-deployed PR numbers from Prisma at startup.
        """
        from db import db
        records = await db.deployedpr.find_many()
        self._deployed_prs_cache = {r.prNumber for r in records}
        log.info(
            "Synced %d deployed PRs from DB.", len(self._deployed_prs_cache)
        )

    # ── Public API ─────────────────────────────────────────────────────────────

    @property
    def wallet_address(self) -> str:
        return self._wallet_address

    def is_ready(self) -> bool:
        return bool(
            WEB3_AVAILABLE
            and self._private_key
            and self._contract_address
            and self._contract_address != "0xMarketFactoryContractAddress"
        )

    def already_deployed(self, pr_number: int) -> bool:
        """Returns True if a market for this PR exists in the DB cache."""
        return pr_number in self._deployed_prs_cache

    async def mark_deployed(self, pr_number: int) -> None:
        """Add to cache (DB write is handled by architect.save_proposal_to_db)."""
        self._deployed_prs_cache.add(pr_number)

    async def get_contract_info(self) -> dict[str, Any]:
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

    async def get_all_open_markets(self) -> list[dict[str, Any]]:
        """
        Fetch all OPEN markets from the DB (used by legacy resolver interface).
        Returns a list of dicts with market_id and metadata.
        """
        try:
            from db import db
            markets = await db.market.find_many(where={"status": "OPEN"})
            return [
                {
                    "market_id": m.onchainMarketId,
                    "db_id": m.id,
                    "title": m.title,
                    "resolution_type": m.resolutionType,
                    "data_source_url": m.dataSourceUrl,
                    "evaluation_logic": m.evaluationLogic,
                }
                for m in markets
                if m.onchainMarketId is not None
            ]
        except Exception as exc:
            log.error("get_all_open_markets DB error: %s", exc)
            return []

    async def create_onchain_market(
        self,
        market_data: dict[str, Any],
    ) -> dict[str, Any]:
        """Deploy a prediction market on the Kite AI blockchain."""
        pr_number = market_data.get("source_pr_number", 0)
        title = market_data.get("title", "Untitled")

        if pr_number and self.already_deployed(pr_number):
            log.info("PR #%s already deployed — skipping.", pr_number)
            return {"skipped": True, "reason": f"PR #{pr_number} already deployed"}

        if not self.is_ready():
            log.warning("KiteClient not fully configured — using mock deployment.")
            return self._mock_receipt(market_data)

        try:
            receipt = await self._deploy_market(market_data)
            if pr_number:
                await self.mark_deployed(pr_number)
            return receipt
        except Exception as exc:
            log.error("On-chain market deployment failed for '%s': %s", title, exc)
            raise RuntimeError(f"Deployment failed: {exc}") from exc

    async def resolve_onchain_market(
        self, market_id: int, outcome: str
    ) -> dict[str, Any]:
        """
        Call resolveMarket(marketId, outcome) on-chain.
        Outcome: "YES" → 1, "NO" → 2, "INVALID" → 3.
        """
        outcome_map = {"YES": 1, "NO": 2, "INVALID": 3}
        if outcome not in outcome_map:
            raise ValueError(f"Invalid outcome: {outcome}")

        if not self.is_ready():
            log.warning("KiteClient not fully configured — mock resolve.")
            return {"mock": True, "market_id": market_id, "outcome": outcome}

        try:
            w3 = await self._get_w3()
            contract = w3.eth.contract(
                address=Web3.to_checksum_address(self._contract_address),
                abi=self._contract_abi,
            )
            checksum_wallet = Web3.to_checksum_address(self._wallet_address)
            nonce = await w3.eth.get_transaction_count(checksum_wallet)
            gas_price = await w3.eth.gas_price

            tx = await contract.functions.resolveMarket(
                int(market_id), outcome_map[outcome]
            ).build_transaction({
                "from": checksum_wallet,
                "nonce": nonce,
                "gas": 200_000,
                "gasPrice": gas_price,
                "chainId": self._chain_id,
            })

            account = Account.from_key(self._private_key)
            signed = account.sign_transaction(tx)
            tx_hash = await w3.eth.send_raw_transaction(signed.raw_transaction)

            log.info(
                "resolveMarket tx sent: %s for market %s outcome %s",
                tx_hash.hex(), market_id, outcome,
            )

            receipt = await w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
            if receipt["status"] == 0:
                raise RuntimeError(f"Transaction reverted. Hash: {tx_hash.hex()}")

            return {
                "market_id": market_id,
                "outcome": outcome,
                "tx_hash": tx_hash.hex(),
                "block_number": receipt["blockNumber"],
            }
        except Exception as exc:
            log.error("Failed to resolve market %s: %s", market_id, exc)
            raise

    # ── Private: Web3 ─────────────────────────────────────────────────────────

    async def _get_w3(self) -> AsyncWeb3:
        if self._w3 is None:
            self._w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(self._rpc_url))
            self._w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        return self._w3

    async def _deploy_market(self, market_data: dict[str, Any]) -> dict[str, Any]:
        w3 = await self._get_w3()
        checksum_contract = Web3.to_checksum_address(self._contract_address)
        checksum_wallet = Web3.to_checksum_address(self._wallet_address)
        contract = w3.eth.contract(address=checksum_contract, abi=self._contract_abi)

        question = (market_data.get("description") or market_data.get("title", "?"))[:300]
        category = self._infer_category(market_data)
        oracle = checksum_wallet
        deadline = int(time.time()) + self._resolution_days * 86400

        log.info(
            "Building createMarket tx | question='%s...' | liquidity=%.4f ETH",
            question[:60], self._liquidity_wei / 1e18,
        )

        balance = await w3.eth.get_balance(checksum_wallet)
        if balance < self._liquidity_wei:
            raise RuntimeError(
                f"Insufficient balance: have {balance / 1e18:.4f} KITE, "
                f"need {self._liquidity_wei / 1e18:.4f} KITE"
            )

        nonce = await w3.eth.get_transaction_count(checksum_wallet)

        try:
            gas_estimate = await contract.functions.createMarket(
                question, category, oracle, deadline
            ).estimate_gas({"from": checksum_wallet, "value": self._liquidity_wei})
            gas_limit = int(gas_estimate * 1.3)
        except Exception as gas_exc:
            log.warning("Gas estimation failed (%s), using fallback 500_000", gas_exc)
            gas_limit = 500_000

        gas_price = await w3.eth.gas_price

        tx = await contract.functions.createMarket(
            question, category, oracle, deadline,
        ).build_transaction({
            "from": checksum_wallet,
            "value": self._liquidity_wei,
            "nonce": nonce,
            "gas": gas_limit,
            "gasPrice": gas_price,
            "chainId": self._chain_id,
        })

        account = Account.from_key(self._private_key)
        signed = account.sign_transaction(tx)
        tx_hash = await w3.eth.send_raw_transaction(signed.raw_transaction)
        log.info("Transaction sent: %s — waiting for receipt…", tx_hash.hex())

        raw_receipt = await w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        if raw_receipt["status"] == 0:
            raise RuntimeError(f"Transaction reverted. Hash: {tx_hash.hex()}")

        market_id = self._extract_market_id(contract, raw_receipt)
        log.info(
            "Market deployed ✓  marketId=%s  tx=%s  block=%d",
            market_id, tx_hash.hex()[:14] + "…", raw_receipt["blockNumber"],
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
        try:
            logs = contract.events.MarketCreated().process_receipt(receipt)
            if logs:
                return logs[0]["args"]["marketId"]
        except Exception as exc:
            log.warning("Could not parse MarketCreated event: %s", exc)
        return None

    @staticmethod
    def _mock_receipt(market_data: dict[str, Any]) -> dict[str, Any]:
        import hashlib
        title = market_data.get("title", "Untitled")
        mock_hash = "0x" + hashlib.sha256(title.encode()).hexdigest()
        mock_addr = "0x" + hashlib.md5(title.encode()).hexdigest()[:40]
        log.warning("MOCK deployment for '%s'", title)
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

    @staticmethod
    def _normalise_key(key: str) -> str:
        key = key.strip()
        if key and not key.startswith("0x"):
            key = "0x" + key
        return key

    @staticmethod
    def _infer_category(market_data: dict[str, Any]) -> str:
        title_lower = (
            market_data.get("title", "") + " " + market_data.get("agent_reason", "")
        ).lower()
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
            if isinstance(data, list):
                return data
            return data.get("abi", [])
        except FileNotFoundError:
            log.warning("ABI file not found at %s", self._abi_path)
            return []
        except json.JSONDecodeError as exc:
            log.error("Invalid ABI JSON at %s: %s", self._abi_path, exc)
            return []