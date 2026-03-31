"""
server/tools/web3_tools.py — Web3 / RPC Tool Library
======================================================
Read-only async functions for querying on-chain data.
Used by the Resolver Agent to verify deployment/usage metrics.

All functions are stateless and accept an rpc_url parameter.
The KiteClient's existing web3.py connection is reused where possible.

Tools:
  • get_block_info()          — fetch a specific block's metadata
  • get_contract_event_count() — count on-chain events matching a signature
  • get_epoch_info()          — query Solana-like epoch info (via custom RPC)
  • get_contract_call()       — call a read-only contract function
  • get_transaction_status()  — check if a tx was mined and succeeded
  • get_snapshot_proposal()   — fetch Snapshot.org DAO proposal results
"""

from __future__ import annotations


import logging
from typing import Any
import httpx
from server.config import Settings

log = logging.getLogger(__name__)

# ── lazy web3 import ──────────────────────────────────────────────────────────
try:
    from web3 import AsyncWeb3
    from web3.middleware import ExtraDataToPOAMiddleware
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    log.warning("web3 not installed — Web3Tools will be non-functional.")


class Web3Tools:
    """
    Async Web3 toolset for reading on-chain state.
    Instantiate once; share the w3 connection.
    """

    def __init__(self, rpc_url: str = None) -> None:
        # Use provided rpc_url or fallback to config
        if rpc_url is None:
            self._rpc_url = Settings().kite_rpc_url
        else:
            self._rpc_url = rpc_url
        self._w3: Any | None = None

    async def _get_w3(self) -> Any:
        if self._w3 is None:
            if not WEB3_AVAILABLE:
                raise RuntimeError("web3 package not installed.")
            self._w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(self._rpc_url))
            self._w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        return self._w3

    # ── Block Data ────────────────────────────────────────────────────────────

    async def get_latest_block_number(self) -> int | None:
        """Return the current head block number."""
        try:
            w3 = await self._get_w3()
            return await w3.eth.block_number
        except Exception as exc:
            log.error("Block number fetch error: %s", exc)
            return None

    async def get_block_info(self, block_identifier: int | str = "latest") -> dict[str, Any] | None:
        """
        Fetch block metadata.
        block_identifier: block number (int) or "latest" / "earliest".
        """
        try:
            w3 = await self._get_w3()
            block = await w3.eth.get_block(block_identifier)
            return {
                "number": block.get("number"),
                "timestamp": block.get("timestamp"),
                "hash": block.get("hash", b"").hex() if block.get("hash") else None,
                "transaction_count": len(block.get("transactions", [])),
                "gas_used": block.get("gasUsed"),
                "gas_limit": block.get("gasLimit"),
            }
        except Exception as exc:
            log.error("Block info fetch error: %s", exc)
            return None

    # ── Contract Calls ────────────────────────────────────────────────────────

    async def call_contract_function(
        self,
        contract_address: str,
        abi: list[dict],
        function_name: str,
        args: list | None = None,
    ) -> Any | None:
        """
        Call a read-only (view/pure) contract function and return the result.

        Example:
            count = await tools.call_contract_function(
                addr, abi, "marketCount", []
            )
        """
        try:
            w3 = await self._get_w3()
            checksum_addr = AsyncWeb3.to_checksum_address(contract_address)
            contract = w3.eth.contract(address=checksum_addr, abi=abi)
            fn = getattr(contract.functions, function_name)
            result = await fn(*(args or [])).call()
            return result
        except Exception as exc:
            log.error("Contract call %s() error: %s", function_name, exc)
            return None

    # ── Event Logs ────────────────────────────────────────────────────────────

    async def get_event_count(
        self,
        contract_address: str,
        abi: list[dict],
        event_name: str,
        from_block: int = 0,
        to_block: int | str = "latest",
        argument_filters: dict | None = None,
    ) -> int | None:
        """
        Count the number of times an event has been emitted by a contract.
        Used to verify interaction thresholds (e.g. "crossed 10,000 calls").
        """
        try:
            w3 = await self._get_w3()
            checksum_addr = AsyncWeb3.to_checksum_address(contract_address)
            contract = w3.eth.contract(address=checksum_addr, abi=abi)
            event = getattr(contract.events, event_name)
            logs = await event.get_logs(
                from_block=from_block,
                to_block=to_block,
                argument_filters=argument_filters or {},
            )
            return len(logs)
        except Exception as exc:
            log.error("Event count error (%s): %s", event_name, exc)
            return None

    async def get_raw_logs(
        self,
        address: str,
        topics: list[str],
        from_block: int = 0,
        to_block: int | str = "latest",
    ) -> list[dict] | None:
        """
        Low-level eth_getLogs query. Returns raw log dicts.
        """
        try:
            w3 = await self._get_w3()
            logs = await w3.eth.get_logs({
                "address": AsyncWeb3.to_checksum_address(address),
                "topics": topics,
                "fromBlock": from_block,
                "toBlock": to_block,
            })
            return [
                {
                    "block_number": log.get("blockNumber"),
                    "transaction_hash": log.get("transactionHash", b"").hex(),
                    "log_index": log.get("logIndex"),
                    "data": log.get("data"),
                }
                for log in logs
            ]
        except Exception as exc:
            log.error("Raw logs fetch error: %s", exc)
            return None

    # ── Transaction Status ─────────────────────────────────────────────────────

    async def get_transaction_status(self, tx_hash: str) -> dict[str, Any] | None:
        """
        Check if a transaction has been mined and whether it succeeded.
        Returns None if the tx is not yet mined (pending).
        """
        try:
            w3 = await self._get_w3()
            receipt = await w3.eth.get_transaction_receipt(tx_hash)
            if receipt is None:
                return None  # still pending
            return {
                "tx_hash": tx_hash,
                "block_number": receipt.get("blockNumber"),
                "status": receipt.get("status"),  # 1 = success, 0 = reverted
                "gas_used": receipt.get("gasUsed"),
            }
        except Exception as exc:
            log.error("Transaction status error: %s", exc)
            return None

    # ── Solana-style Epoch / Slot checks via raw RPC JSON-RPC ─────────────────

    async def get_solana_epoch_info(self, rpc_url: str) -> dict[str, Any] | None:
        """
        Query a Solana JSON-RPC endpoint for current epoch information.
        Used for "Will network upgrade activate at epoch X?" markets.
        """
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(
                    rpc_url,
                    json={"jsonrpc": "2.0", "id": 1, "method": "getEpochInfo", "params": []},
                )
                resp.raise_for_status()
                result = resp.json().get("result", {})
                return {
                    "epoch": result.get("epoch"),
                    "slot_index": result.get("slotIndex"),
                    "slots_in_epoch": result.get("slotsInEpoch"),
                    "absolute_slot": result.get("absoluteSlot"),
                    "block_height": result.get("blockHeight"),
                }
        except Exception as exc:
            log.error("Solana epoch info error: %s", exc)
            return None

    async def get_solana_block(self, rpc_url: str, slot: int) -> dict[str, Any] | None:
        """
        Fetch a Solana block by slot number.
        Used to verify snapshot serialization / block existence.
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    rpc_url,
                    json={
                        "jsonrpc": "2.0",
                        "id": 1,
                        "method": "getBlock",
                        "params": [slot, {"encoding": "json", "maxSupportedTransactionVersion": 0}],
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                if "error" in data:
                    return None
                block = data.get("result", {})
                return {
                    "slot": slot,
                    "block_time": block.get("blockTime"),
                    "block_height": block.get("blockHeight"),
                    "transaction_count": len(block.get("transactions", [])),
                    "parent_slot": block.get("parentSlot"),
                }
        except Exception as exc:
            log.error("Solana block fetch error: %s", exc)
            return None


# ── DAO / Governance Tools ────────────────────────────────────────────────────

class GovernanceTools:
    """
    Tools for fetching DAO governance data from Snapshot.org and
    on-chain vote contracts.
    """

    def __init__(self, http_client: httpx.AsyncClient) -> None:
        self._client = http_client

    async def get_snapshot_proposal(
        self, space: str, proposal_id: str
    ) -> dict[str, Any] | None:
        """
        Fetch a Snapshot.org governance proposal by ID.

        Resolution logic:
          state == "closed" AND scores[0] > scores[1] → YES (first choice wins)
          state == "closed" AND scores[1] >= scores[0] → NO
          state == "active" or "pending" → PENDING
          quorum not reached → INVALID
        """
        query = """
        query Proposal($id: String!) {
          proposal(id: $id) {
            id
            title
            state
            space { id name }
            scores
            scores_total
            quorum
            votes
            start
            end
            choices
            scores_state
          }
        }
        """
        try:
            resp = await self._client.post(
                "https://hub.snapshot.org/graphql",
                json={"query": query, "variables": {"id": proposal_id}},
                timeout=20.0,
            )
            resp.raise_for_status()
            data = resp.json().get("data", {}).get("proposal")
            if not data:
                return None
            return {
                "id": data.get("id"),
                "title": data.get("title"),
                "state": data.get("state"),          # active | closed | pending
                "choices": data.get("choices", []),
                "scores": data.get("scores", []),
                "scores_total": data.get("scores_total", 0),
                "quorum": data.get("quorum", 0),
                "votes": data.get("votes", 0),
                "start": data.get("start"),
                "end": data.get("end"),
                "scores_state": data.get("scores_state"),
                "quorum_reached": (data.get("scores_total", 0) >= data.get("quorum", 0)),
            }
        except Exception as exc:
            log.error("Snapshot proposal fetch error: %s", exc)
            return None

    async def get_simd_proposal_status(
        self, simd_number: int
    ) -> dict[str, Any] | None:
        """
        Check the status of a Solana Improvement and Modernization Document (SIMD)
        by scraping the Solana Foundation GitHub proposals repo.
        Returns: { number, title, status, authors, pr_url }
        """
        search_url = "https://api.github.com/search/issues"
        try:
            resp = await self._client.get(
                search_url,
                params={
                    "q": f"repo:solana-foundation/solana-improvement-documents SIMD-{simd_number:04d} in:title",
                    "per_page": 5,
                },
                timeout=20.0,
            )
            resp.raise_for_status()
            items = resp.json().get("items", [])
            if not items:
                return None
            item = items[0]
            return {
                "number": simd_number,
                "title": item.get("title"),
                "state": item.get("state"),
                "pr_url": item.get("html_url"),
                "labels": [l["name"] for l in item.get("labels", [])],
                "merged": item.get("pull_request", {}).get("merged_at") is not None,
            }
        except Exception as exc:
            log.error("SIMD proposal fetch error: %s", exc)
            return None