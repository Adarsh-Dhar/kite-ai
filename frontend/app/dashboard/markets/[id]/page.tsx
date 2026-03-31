'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import {
  getMarketById,
  getYesProbability,
  quoteBuy,
  getUserPositions,
  buyShares,
  sellShares,
  redeemWinnings,
  connectWallet,
  Market,
  MarketStatus,
  Outcome,
  formatEth,
  timeUntil,
  switchToKiteChain,
} from '@/lib/contract';
import {
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Wallet,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
import { CONTRACT_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESS } from '@/lib/address';

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────

function CategoryPill({ cat }: { cat: string }) {
  return (
    <span className="px-2 py-0.5 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] text-[10px] font-bold tracking-widest uppercase rounded">
      {cat}
    </span>
  );
}

function StatusRow({ market }: { market: Market }) {
  const labels: Record<MarketStatus, { text: string; dot: string }> = {
    [MarketStatus.OPEN]:     { text: 'Open for trading', dot: 'bg-[#00ff00] animate-pulse' },
    [MarketStatus.PAUSED]:   { text: 'Trading paused',   dot: 'bg-[#ffcc00]' },
    [MarketStatus.RESOLVED]: { text: 'Resolved',         dot: 'bg-[#888888]' },
  };
  const { text, dot } = labels[market.status] ?? { text: 'Unknown', dot: 'bg-[#333]' };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="text-sm text-[#888888]">{text}</span>
    </div>
  );
}

function OutcomeBanner({ outcome }: { outcome: Outcome }) {
  if (outcome === Outcome.UNRESOLVED) return null;
  const map = {
    [Outcome.YES]:     { text: 'Resolved YES ✓', cls: 'border-[#00ff00]/30 bg-[#00ff00]/5 text-[#00ff00]' },
    [Outcome.NO]:      { text: 'Resolved NO ✗',  cls: 'border-[#ff3333]/30 bg-[#ff3333]/5 text-[#ff3333]' },
    [Outcome.INVALID]: { text: 'Resolved INVALID', cls: 'border-[#888]/30 bg-[#888]/5 text-[#888]' },
  };
  const { text, cls } = map[outcome] ?? { text: '', cls: '' };
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-bold ${cls}`}>
      <ShieldAlert size={16} />
      {text}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Probability arc
// ─────────────────────────────────────────────────────────────────────────────

function ProbabilityArc({ yesPct }: { yesPct: number }) {
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const yesArc = (yesPct / 100) * circ;
  const noArc  = circ - yesArc;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="10" />
        {/* NO arc */}
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="#ff3333" strokeWidth="10" strokeOpacity="0.5"
          strokeDasharray={`${noArc} ${yesArc}`}
          strokeDashoffset={-yesArc}
          strokeLinecap="round"
        />
        {/* YES arc */}
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="#00ff00" strokeWidth="10" strokeOpacity="0.85"
          strokeDasharray={`${yesArc} ${noArc}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#00ff00] font-mono">{yesPct}%</span>
        <span className="text-[10px] text-[#555555] font-bold tracking-widest uppercase">YES</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Buy panel
// ─────────────────────────────────────────────────────────────────────────────

type Side = 'YES' | 'NO';
type TxState = 'idle' | 'quoting' | 'pending' | 'success' | 'error';

function BuyPanel({
  market,
  wallet,
  onWalletConnect,
  onTxSuccess,
}: {
  market: Market;
  wallet: string | null;
  onWalletConnect: () => void;
  onTxSuccess: () => void;
}) {
  const [side,      setSide]      = useState<Side>('YES');
  const [amount,    setAmount]    = useState('0.05');
  const [quote,     setQuote]     = useState<{ sharesOut: bigint; fee: bigint } | null>(null);
  const [txState,   setTxState]   = useState<TxState>('idle');
  const [txHash,    setTxHash]    = useState<string | null>(null);
  const [errMsg,    setErrMsg]    = useState<string | null>(null);

  const isABIEmpty = CONTRACT_ABI.length === 0;
  const isOpen     = market.status === MarketStatus.OPEN;
  const deadline   = timeUntil(market.resolutionDeadline);

  // Auto-quote whenever amount/side changes
  useEffect(() => {
    if (!amount || isNaN(+amount) || +amount <= 0 || isABIEmpty) { setQuote(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const { ethers } = await import('ethers');
        const amtWei = ethers.parseEther(amount);
        const q = await quoteBuy(market.id, side === 'YES', amtWei);
        if (!cancelled) setQuote(q);
      } catch { if (!cancelled) setQuote(null); }
    })();
    return () => { cancelled = true; };
  }, [amount, side, market.id, isABIEmpty]);

  async function handleBuy() {
    if (!wallet) { onWalletConnect(); return; }
    setTxState('pending');
    setErrMsg(null);
    try {
      const hash = await buyShares(market.id, side === 'YES', amount);
      setTxHash(hash);
      setTxState('success');
      onTxSuccess();
    } catch (e: any) {
      setErrMsg(e.message ?? 'Transaction failed');
      setTxState('error');
    }
  }

  const payout = quote
    ? (Number(quote.sharesOut) / 1e18).toFixed(4)
    : '—';

  const fee = quote
    ? (Number(quote.fee) / 1e18).toFixed(6)
    : '—';

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#111111] flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Place a Vote</h3>
        {wallet ? (
          <span className="text-[10px] font-mono text-[#444444]">
            {wallet.slice(0, 6)}…{wallet.slice(-4)}
          </span>
        ) : (
          <button
            onClick={onWalletConnect}
            className="flex items-center gap-1.5 text-xs text-[#00ff00] hover:underline"
          >
            <Wallet size={12} />
            Connect wallet
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* ABI warning */}
        {isABIEmpty && (
          <div className="flex items-center gap-2 text-[#ffcc00] text-xs bg-[#ffcc00]/5 border border-[#ffcc00]/20 rounded-lg px-3 py-2">
            <AlertCircle size={12} />
            ABI not configured — voting disabled
          </div>
        )}

        {/* Side selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('YES')}
            disabled={!isOpen || isABIEmpty}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
              side === 'YES'
                ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/20'
                : 'bg-[#111111] text-[#555555] hover:text-[#00ff00] hover:border-[#00ff00]/30 border border-[#1a1a1a]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ArrowUpRight size={16} />
            YES
          </button>
          <button
            onClick={() => setSide('NO')}
            disabled={!isOpen || isABIEmpty}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
              side === 'NO'
                ? 'bg-[#ff3333] text-white shadow-lg shadow-[#ff3333]/20'
                : 'bg-[#111111] text-[#555555] hover:text-[#ff3333] hover:border-[#ff3333]/30 border border-[#1a1a1a]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ArrowDownRight size={16} />
            NO
          </button>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-[#444444] mb-1.5">
            Amount (KITE)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={!isOpen || isABIEmpty}
              className="w-full bg-[#111111] border border-[#222222] rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00ff00]/50 transition-colors disabled:opacity-40"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              {['0.05','0.1','0.5'].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="text-[10px] px-1.5 py-0.5 bg-[#1a1a1a] rounded text-[#555555] hover:text-[#00ff00] transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-[#080808] border border-[#111111] rounded-lg p-3 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-[#444444]">
            <span>Estimated shares</span>
            <span className="text-[#888888]">{payout}</span>
          </div>
          <div className="flex justify-between text-[#444444]">
            <span>Platform fee (2%)</span>
            <span className="text-[#888888]">{fee} KITE</span>
          </div>
          <div className="border-t border-[#111111] pt-1.5 flex justify-between">
            <span className="text-[#555555]">Side</span>
            <span className={side === 'YES' ? 'text-[#00ff00]' : 'text-[#ff3333]'}>{side}</span>
          </div>
        </div>

        {/* Deadline */}
        {isOpen && (
          <div className="flex items-center gap-2 text-[11px] text-[#333333]">
            <Clock size={11} />
            <span>Trading closes in <span className="text-[#555555]">{deadline}</span></span>
          </div>
        )}

        {/* CTA */}
        {txState === 'success' ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#00ff00] text-sm font-semibold">
              <CheckCircle2 size={16} />
              Transaction confirmed!
            </div>
            <a
              href={`https://testnet.kitescan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#444444] hover:text-[#00ff00] transition-colors"
            >
              View on explorer <ExternalLink size={10} />
            </a>
            <button
              onClick={() => { setTxState('idle'); setTxHash(null); }}
              className="text-xs text-[#444444] hover:text-white transition-colors underline"
            >
              Place another
            </button>
          </div>
        ) : txState === 'error' ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-[#ff3333] text-xs bg-[#ff3333]/5 border border-[#ff3333]/20 rounded-lg px-3 py-2">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              {errMsg}
            </div>
            <button
              onClick={() => setTxState('idle')}
              className="w-full py-3 bg-[#1a1a1a] border border-[#222222] text-[#888888] rounded-lg text-sm font-bold hover:border-[#00ff00]/30 hover:text-[#00ff00] transition-all"
            >
              Try again
            </button>
          </div>
        ) : (
          <button
            onClick={handleBuy}
            disabled={txState === 'pending' || !isOpen || isABIEmpty}
            className={`w-full py-3 rounded-lg text-sm font-black tracking-wider transition-all flex items-center justify-center gap-2 ${
              side === 'YES'
                ? 'bg-[#00ff00] text-black hover:shadow-lg hover:shadow-[#00ff00]/30'
                : 'bg-[#ff3333] text-white hover:shadow-lg hover:shadow-[#ff3333]/30'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {txState === 'pending' ? (
              <><Loader2 size={14} className="animate-spin" /> Confirming…</>
            ) : !wallet ? (
              <><Wallet size={14} /> Connect wallet to vote</>
            ) : !isOpen ? (
              'Market closed'
            ) : (
              `Vote ${side} · ${amount || '0'} KITE`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Redeem panel (shown when market is resolved and user has shares)
// ─────────────────────────────────────────────────────────────────────────────

function RedeemPanel({
  market,
  wallet,
  positions,
  onTxSuccess,
}: {
  market: Market;
  wallet: string | null;
  positions: { yes: bigint; no: bigint } | null;
  onTxSuccess: () => void;
}) {
  const [txState, setTxState] = useState<TxState>('idle');
  const [errMsg,  setErrMsg]  = useState<string | null>(null);
  const [hash,    setHash]    = useState<string | null>(null);

  if (market.status !== MarketStatus.RESOLVED) return null;
  if (!wallet || !positions) return null;

  const winningShares =
    market.outcome === Outcome.YES  ? positions.yes :
    market.outcome === Outcome.NO   ? positions.no  :
    positions.yes + positions.no;

  if (winningShares === BigInt(0)) return null;

  async function handleRedeem() {
    setTxState('pending');
    setErrMsg(null);
    try {
      const h = await redeemWinnings(market.id);
      setHash(h);
      setTxState('success');
      onTxSuccess();
    } catch (e: any) {
      setErrMsg(e.message ?? 'Redeem failed');
      setTxState('error');
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#00ff00]/30 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-[#00ff00] font-bold text-sm">
        <CheckCircle2 size={16} />
        You have winnings to claim!
      </div>
      <p className="text-[#555555] text-xs">
        You hold <span className="text-white font-mono">{(Number(winningShares) / 1e18).toFixed(4)}</span> winning shares.
      </p>
      {txState === 'success' ? (
        <div className="text-[#00ff00] text-xs font-semibold">
          Claimed! <a href={`https://testnet.kitescan.io/tx/${hash}`} target="_blank" className="underline">View tx</a>
        </div>
      ) : (
        <button
          onClick={handleRedeem}
          disabled={txState === 'pending'}
          className="w-full py-2.5 bg-[#00ff00] text-black rounded-lg text-sm font-black hover:shadow-lg hover:shadow-[#00ff00]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {txState === 'pending' ? <><Loader2 size={13} className="animate-spin" /> Claiming…</> : 'Claim Winnings'}
        </button>
      )}
      {errMsg && <p className="text-[#ff3333] text-xs">{errMsg}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Market detail page
// ─────────────────────────────────────────────────────────────────────────────

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const marketId = parseInt(id, 10);

  const [market,    setMarket]    = useState<Market | null>(null);
  const [yesPct,    setYesPct]    = useState<number>(50);
  const [wallet,    setWallet]    = useState<string | null>(null);
  const [positions, setPositions] = useState<{ yes: bigint; no: bigint } | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const isABIEmpty = CONTRACT_ABI.length === 0;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const m = await getMarketById(marketId);
      setMarket(m);
      try {
        const prob = await getYesProbability(marketId);
        setYesPct(Math.round(prob * 100));
      } catch { /* use reserve ratio */ }
    } catch (e: any) {
      setError(e.message ?? 'Failed to load market');
    } finally {
      setLoading(false);
    }
  }, [marketId]);

  useEffect(() => { load(); }, [load]);

  // Load wallet + positions
  useEffect(() => {
    if (!market || !wallet || isABIEmpty) return;
    getUserPositions(market.id, wallet)
      .then(setPositions)
      .catch(() => {});
  }, [market, wallet, isABIEmpty]);

  // Detect already-connected wallet
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    window.ethereum.request({ method: 'eth_accounts' }).then((accs: string[]) => {
      if (accs[0]) setWallet(accs[0]);
    }).catch(() => {});
  }, []);

  async function handleConnectWallet() {
    try {
      const addr = await connectWallet();
      setWallet(addr);
    } catch (e: any) {
      console.error(e);
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh] gap-3 text-[#444444]">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading market…</span>
      </div>
    </DashboardLayout>
  );

  if (error || !market) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle size={32} className="text-[#ff3333]" />
        <p className="text-[#ff3333] text-sm">{error ?? 'Market not found'}</p>
        <Link href="/dashboard/markets" className="text-[#00ff00] text-sm hover:underline">
          ← Back to markets
        </Link>
      </div>
    </DashboardLayout>
  );

  const total = market.yesReserve + market.noReserve;
  const resolveDate = new Date(market.resolutionDeadline * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  // Override yesPct from reserves if prob call failed
  const displayYesPct = total > BigInt(0)
    ? Math.round(Number((market.yesReserve * BigInt(100)) / total))
    : yesPct;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-[#000000]">

        {/* ── Top bar ── */}
        <section className="border-b border-[#111111] px-8 py-5 bg-[#030303]">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/dashboard/markets"
              className="inline-flex items-center gap-1.5 text-[#444444] hover:text-[#00ff00] text-sm transition-colors mb-4"
            >
              <ChevronLeft size={15} />
              All Markets
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <CategoryPill cat={market.category} />
                  <span className="text-[#333333] text-xs font-mono">#{market.id}</span>
                  <StatusRow market={market} />
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white leading-snug">
                  {market.question}
                </h1>
              </div>
              <button
                onClick={load}
                className="p-2 text-[#333333] hover:text-[#00ff00] transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {market.status === MarketStatus.RESOLVED && (
              <div className="mt-3">
                <OutcomeBanner outcome={market.outcome} />
              </div>
            )}
          </div>
        </section>

        {/* ── Body ── */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: details ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Probability */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xs font-bold tracking-widest uppercase text-[#444444] mb-5">
                  Market Probability
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ProbabilityArc yesPct={displayYesPct} />
                  <div className="flex-1 w-full space-y-3">
                    {/* YES bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#00ff00] font-bold">YES</span>
                        <span className="text-[#00ff00] font-mono">{displayYesPct}%</span>
                      </div>
                      <div className="h-2 bg-[#111111] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00ff00] rounded-full transition-all duration-700"
                          style={{ width: `${displayYesPct}%` }}
                        />
                      </div>
                    </div>
                    {/* NO bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#ff3333] font-bold">NO</span>
                        <span className="text-[#ff3333] font-mono">{100 - displayYesPct}%</span>
                      </div>
                      <div className="h-2 bg-[#111111] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ff3333] rounded-full transition-all duration-700"
                          style={{ width: `${100 - displayYesPct}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#333333] pt-1">
                      Based on current liquidity reserves. Prices shift as shares are bought.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Volume',  value: `${formatEth(market.totalVolume)} KITE` },
                  { label: 'Total Liquidity', value: `${formatEth(total)} KITE` },
                  { label: 'Fees Collected', value: `${formatEth(market.feesCollected)} KITE` },
                  { label: 'Resolution',    value: resolveDate },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#333333] mb-1.5">{label}</p>
                    <p className="text-white font-mono text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Market metadata */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 space-y-3">
                <h2 className="text-xs font-bold tracking-widest uppercase text-[#444444] mb-4">
                  Market Details
                </h2>
                {[
                  { label: 'Creator', value: `${market.creator.slice(0, 10)}…${market.creator.slice(-8)}` },
                  { label: 'Oracle',  value: `${market.oracle.slice(0, 10)}…${market.oracle.slice(-8)}` },
                  { label: 'Contract', value: `${CONTRACT_ADDRESS.slice(0, 10)}…${CONTRACT_ADDRESS.slice(-8)}` },
                  { label: 'Deadline', value: `${resolveDate} (${timeUntil(market.resolutionDeadline)})` },
                  { label: 'YES Reserve', value: `${formatEth(market.yesReserve)} KITE` },
                  { label: 'NO Reserve',  value: `${formatEth(market.noReserve)} KITE` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#0d0d0d] last:border-0">
                    <span className="text-[#444444] text-xs">{label}</span>
                    <span className="text-white text-xs font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* User positions */}
              {wallet && positions && (positions.yes > BigInt(0) || positions.no > BigInt(0)) && (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-[#444444] mb-4">
                    Your Positions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-[#00ff00]/60 uppercase tracking-widest mb-1">YES Shares</p>
                      <p className="text-[#00ff00] font-mono font-bold">{(Number(positions.yes) / 1e18).toFixed(4)}</p>
                    </div>
                    <div className="bg-[#ff3333]/5 border border-[#ff3333]/20 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-[#ff3333]/60 uppercase tracking-widest mb-1">NO Shares</p>
                      <p className="text-[#ff3333] font-mono font-bold">{(Number(positions.no) / 1e18).toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: action panels ── */}
            <div className="space-y-4">
              <BuyPanel
                market={market}
                wallet={wallet}
                onWalletConnect={handleConnectWallet}
                onTxSuccess={load}
              />

              <RedeemPanel
                market={market}
                wallet={wallet}
                positions={positions}
                onTxSuccess={load}
              />

              {/* Chain info */}
              <div className="bg-[#0a0a0a] border border-[#111111] rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#333333]">Network</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#444444]">Kite AI Testnet</span>
                  <span className="text-[#333333] font-mono">2368</span>
                </div>
                <button
                  onClick={switchToKiteChain}
                  className="w-full py-2 text-xs border border-[#1a1a1a] rounded-lg text-[#444444] hover:border-[#00ff00]/30 hover:text-[#00ff00] transition-all"
                >
                  Switch network
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}