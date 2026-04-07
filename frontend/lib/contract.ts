
import { CONTRACT_ABI } from "./abi";
import { CONTRACT_ADDRESS } from "./address";
export const RPC_URL = 'https://rpc-testnet.gokite.ai';
export const CHAIN_ID = 2368;
export const CHAIN_HEX = '0x940'; // 2368 in hex
export const DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH = 0.05;
export const MARKET_SERVICE_FEE_BPS = 1_000;

// ─── Types ────────────────────────────────────────────────────────────────────

export enum MarketStatus {
  OPEN = 0,
  PAUSED = 1,
  RESOLVED = 2,
}

export enum Outcome {
  UNRESOLVED = 0,
  YES = 1,
  NO = 2,
  INVALID = 3,
}

export interface Market {
  id: number;
  question: string;
  category: string;
  creator: string;
  oracle: string;
  createdAt: number;
  resolutionDeadline: number;
  status: MarketStatus;
  outcome: Outcome;
  yesReserve: bigint;
  noReserve: bigint;
  yesSupply: bigint;
  noSupply: bigint;
  totalVolume: bigint;
  feesCollected: bigint;
}

export interface DraftMarket {
  title: string;
  description: string;
  options?: string[];
  agent_reason?: string;
  resolution_type: string;
  data_source_url: string;
  evaluation_logic: Record<string, unknown>;
  resolution_condition: string;
}

// ─── Read Helpers (no wallet needed) ─────────────────────────────────────────

async function rpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

/** Returns a read-only ethers Contract instance via public RPC */
async function getReadContract() {
  const { ethers } = await import('ethers');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/** Returns a write-enabled ethers Contract instance via MetaMask */
async function getWriteContract() {
  if (typeof window === 'undefined' || !window.ethereum)
    throw new Error('No injected wallet provider found.');

  const { ethers } = await import('ethers');
  await switchToKiteChain();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function getCreateMarketCosts(initialLiquidityEth = DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH) {
  const serviceFeeEth = initialLiquidityEth * (MARKET_SERVICE_FEE_BPS / 10_000);
  const totalEth = initialLiquidityEth + serviceFeeEth;
  return {
    initialLiquidityEth,
    serviceFeeEth,
    totalEth,
  };
}

// ─── Chain switching ──────────────────────────────────────────────────────────

export async function switchToKiteChain(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_HEX }],
    });
  } catch (switchError: any) {
    // Chain not added yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CHAIN_HEX,
          chainName: 'Kite AI Testnet',
          nativeCurrency: { name: 'KITE', symbol: 'KITE', decimals: 18 },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: ['https://testnet.kitescan.io'],
        }],
      });
    } else {
      throw switchError;
    }
  }
}

// ─── Contract Reads ───────────────────────────────────────────────────────────

export async function getAllMarkets(): Promise<Market[]> {
  const contract = await getReadContract();
  const raw: any[] = await contract.getAllMarkets();
  return raw.map((m, i) => ({
    id: i,
    question: m.question,
    category: m.category,
    creator: m.creator,
    oracle: m.oracle,
    createdAt: Number(m.createdAt),
    resolutionDeadline: Number(m.resolutionDeadline),
    status: Number(m.status) as MarketStatus,
    outcome: Number(m.outcome) as Outcome,
    yesReserve: BigInt(m.yesReserve),
    noReserve: BigInt(m.noReserve),
    yesSupply: BigInt(m.yesSupply),
    noSupply: BigInt(m.noSupply),
    totalVolume: BigInt(m.totalVolume),
    feesCollected: BigInt(m.feesCollected),
  }));
}

export async function getMarketById(id: number): Promise<Market> {
  const contract = await getReadContract();
  const m = await contract.getMarketInfo(id);
  return {
    id,
    question: m.question,
    category: m.category,
    creator: m.creator,
    oracle: m.oracle,
    createdAt: Number(m.createdAt),
    resolutionDeadline: Number(m.resolutionDeadline),
    status: Number(m.status) as MarketStatus,
    outcome: Number(m.outcome) as Outcome,
    yesReserve: BigInt(m.yesReserve),
    noReserve: BigInt(m.noReserve),
    yesSupply: BigInt(m.yesSupply),
    noSupply: BigInt(m.noSupply),
    totalVolume: BigInt(m.totalVolume),
    feesCollected: BigInt(m.feesCollected),
  };
}

export async function getYesProbability(marketId: number): Promise<number> {
  const contract = await getReadContract();
  const raw = await contract.getYesProbability(marketId);
  // Returns 1e18 = 100%
  return Number(raw) / 1e18;
}

export async function quoteBuy(
  marketId: number,
  isYes: boolean,
  amountInWei: bigint
): Promise<{ sharesOut: bigint; fee: bigint }> {
  const contract = await getReadContract();
  const [sharesOut, fee] = await contract.quoteBuy(marketId, isYes, amountInWei);
  return { sharesOut: BigInt(sharesOut), fee: BigInt(fee) };
}

export async function getUserPositions(
  marketId: number,
  address: string
): Promise<{ yes: bigint; no: bigint }> {
  const contract = await getReadContract();
  const [yes, no] = await contract.getUserPositions(marketId, address);
  return { yes: BigInt(yes), no: BigInt(no) };
}

// ─── Contract Writes ──────────────────────────────────────────────────────────

export async function buyShares(
  marketId: number,
  isYes: boolean,
  amountEth: string,
  minShares: bigint = BigInt(0)
): Promise<string> {
  const { ethers } = await import('ethers');
  const contract = await getWriteContract();
  const value = ethers.parseEther(amountEth);
  const tx = await contract.buyShares(marketId, isYes, minShares, { value });
  await tx.wait();
  return tx.hash;
}

export async function sellShares(
  marketId: number,
  isYes: boolean,
  shares: bigint,
  minOut: bigint = BigInt(0)
): Promise<string> {
  const contract = await getWriteContract();
  const tx = await contract.sellShares(marketId, isYes, shares, minOut);
  await tx.wait();
  return tx.hash;
}

export async function redeemWinnings(marketId: number): Promise<string> {
  const contract = await getWriteContract();
  const tx = await contract.redeemWinnings(marketId);
  await tx.wait();
  return tx.hash;
}

export async function createMarketFromDraft(
  draft: DraftMarket,
  oracleAddress: string,
  initialLiquidityEth = DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH,
): Promise<string> {
  const { ethers } = await import('ethers');
  const contract = await getWriteContract();
  const { totalEth } = getCreateMarketCosts(initialLiquidityEth);
  const question = draft.title.trim() || draft.description.trim();
  const category = draft.resolution_type.trim() || 'General';
  const resolutionDeadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const tx = await contract.createMarket(
    question,
    category,
    oracleAddress,
    resolutionDeadline,
    { value: ethers.parseEther(totalEth.toString()) },
  );
  await tx.wait();
  return tx.hash;
}

export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum)
    throw new Error('No injected wallet provider found.');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
}

// ─── Formatting Utilities ─────────────────────────────────────────────────────

export function formatEth(wei: bigint): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(4);
}

export function formatPercent(prob: number): string {
  return (prob * 100).toFixed(1) + '%';
}

export function getStatusLabel(status: MarketStatus): string {
  return ['OPEN', 'PAUSED', 'RESOLVED'][status] ?? 'UNKNOWN';
}

export function getOutcomeLabel(outcome: Outcome): string {
  return ['UNRESOLVED', 'YES', 'NO', 'INVALID'][outcome] ?? 'UNKNOWN';
}

export function timeUntil(unixTs: number): string {
  const diff = unixTs - Math.floor(Date.now() / 1000);
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours}h ${mins}m`;
}

// Extend window type for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}