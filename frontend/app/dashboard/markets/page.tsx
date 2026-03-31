'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { CONTRACT_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESS } from '@/lib/address';
import {
  getAllMarkets,
  Market,
  MarketStatus,
  Outcome,
  formatEth,
  timeUntil,
} from '@/lib/contract';
import {
  TrendingUp,
  Clock,
  Activity,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

// ── Status helpers ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MarketStatus }) {
  const map: Record<MarketStatus, { label: string; cls: string }> = {
    [MarketStatus.OPEN]:     { label: 'OPEN',     cls: 'bg-[#00ff00]/10 text-[#00ff00] border-[#00ff00]/30' },
    [MarketStatus.PAUSED]:   { label: 'PAUSED',   cls: 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/30' },
    [MarketStatus.RESOLVED]: { label: 'RESOLVED', cls: 'bg-[#888888]/10 text-[#888888] border-[#888888]/30' },
  };
  const { label, cls } = map[status] ?? { label: 'UNKNOWN', cls: '' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  if (outcome === Outcome.UNRESOLVED) return null;
  const map: Record<number, { label: string; cls: string }> = {
    [Outcome.YES]:     { label: 'YES ✓',    cls: 'bg-[#00ff00]/10 text-[#00ff00] border-[#00ff00]/30' },
    [Outcome.NO]:      { label: 'NO ✗',     cls: 'bg-[#ff3333]/10 text-[#ff3333] border-[#ff3333]/30' },
    [Outcome.INVALID]: { label: 'INVALID',  cls: 'bg-[#888888]/10 text-[#888888] border-[#888888]/30' },
  };
  const { label, cls } = map[outcome] ?? { label: '', cls: '' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${cls}`}>
      {label}
    </span>
  );
}

// ── Probability bar ────────────────────────────────────────────────────────

function ProbBar({ yesReserve, noReserve }: { yesReserve: bigint; noReserve: bigint }) {
  const total = yesReserve + noReserve;
  if (total === BigInt(0)) return <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full" />;
  const yesPct = Number((yesReserve * BigInt(10000)) / total) / 100;
  return (
    <div className="w-full h-1.5 bg-[#ff3333]/30 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#00ff00] rounded-full transition-all duration-500"
        style={{ width: `${yesPct}%` }}
      />
    </div>
  );
}

// ── Market card ────────────────────────────────────────────────────────────

function MarketCard({ market }: { market: Market }) {
  const total = market.yesReserve + market.noReserve;
  const yesPct = total > BigInt(0)
    ? Math.round(Number((market.yesReserve * BigInt(10000)) / total) / 100)
    : 50;
  const isOpen = market.status === MarketStatus.OPEN;
  const deadline = timeUntil(market.resolutionDeadline);

  return (
    <Link href={`/dashboard/markets/${market.id}`}>
      <div className="group relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#00ff00]/40 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-[#00ff00]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-[#444444] uppercase mb-1">
              {market.category} · #{market.id}
            </p>
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#00ff00] transition-colors">
              {market.question}
            </h3>
          </div>
          <ChevronRight
            size={16}
            className="text-[#333333] group-hover:text-[#00ff00] shrink-0 mt-0.5 transition-colors"
          />
        </div>

        {/* Probability */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#00ff00] font-bold">YES {yesPct}%</span>
            <span className="text-[#ff3333] font-bold">NO {100 - yesPct}%</span>
          </div>
          <ProbBar yesReserve={market.yesReserve} noReserve={market.noReserve} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={market.status} />
            <OutcomeBadge outcome={market.outcome} />
          </div>
          <div className="flex items-center gap-2 text-[#555555] text-xs">
            {isOpen && (
              <>
                <Clock size={11} />
                <span>{deadline}</span>
              </>
            )}
            {!isOpen && market.outcome !== Outcome.UNRESOLVED && (
              <span className="text-[#555555]">Settled</span>
            )}
          </div>
        </div>

        {/* Volume */}
        <div className="mt-3 pt-3 border-t border-[#111111] flex items-center justify-between text-[11px]">
          <span className="text-[#444444]">
            Volume <span className="text-[#666666] font-mono">{formatEth(market.totalVolume)} KITE</span>
          </span>
          <span className="text-[#444444]">
            Liquidity <span className="text-[#666666] font-mono">{formatEth(total)} KITE</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Summary stats ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3 text-[#444444]">
        {icon}
        <span className="text-xs font-semibold tracking-widest uppercase text-[#555555]">{label}</span>
      </div>
      <div className="text-2xl font-black text-[#00ff00] font-mono">{value}</div>
      {sub && <div className="text-xs text-[#444444] mt-1">{sub}</div>}
    </div>
  );
}

// ── Filter bar ─────────────────────────────────────────────────────────────

const FILTERS = ['All', 'Open', 'Resolved', 'Paused'] as const;
type Filter = typeof FILTERS[number];

// ── Page ───────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [markets, setMarkets]   = useState<Market[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<Filter>('All');
  const [search, setSearch]     = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMarkets();
      // Reverse so newest first
      setMarkets([...data].reverse());
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message ?? 'Failed to load markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Filtered list
  const filtered = markets.filter(m => {
    const matchFilter =
      filter === 'All'      ? true :
      filter === 'Open'     ? m.status === MarketStatus.OPEN :
      filter === 'Resolved' ? m.status === MarketStatus.RESOLVED :
      filter === 'Paused'   ? m.status === MarketStatus.PAUSED : true;

    const matchSearch = !search || m.question.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  // Stats
  const openCount     = markets.filter(m => m.status === MarketStatus.OPEN).length;
  const resolvedCount = markets.filter(m => m.status === MarketStatus.RESOLVED).length;
  const totalVol      = markets.reduce((acc, m) => acc + m.totalVolume, BigInt(0));

  const isABIEmpty = CONTRACT_ABI.length === 0;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-[#000000]">

        {/* ── Hero header ── */}
        <section className="border-b border-[#111111] px-8 py-10 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#444444] uppercase mb-2">
                  Kite AI Testnet
                </p>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  Prediction <span className="text-[#00ff00]">Markets</span>
                </h1>
                <p className="text-[#555555] text-sm mt-2 font-mono">
                  {`${(CONTRACT_ADDRESS as string).slice(0, 10)}…${(CONTRACT_ADDRESS as string).slice(-8)}`}
                </p>
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#222222] text-[#888888] rounded-lg hover:border-[#00ff00]/50 hover:text-[#00ff00] transition-all text-sm"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* ABI warning */}
            {isABIEmpty && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-[#ffcc00]/5 border border-[#ffcc00]/20 rounded-lg text-[#ffcc00] text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>
                  ABI not configured — open <code className="font-mono text-xs bg-[#111] px-1 rounded">frontend/lib/contract.ts</code> and paste your ABI + contract address to enable live data.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── Stats row ── */}
        <section className="px-8 py-6 border-b border-[#0d0d0d]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Markets"
              value={markets.length.toString()}
              sub="All time"
              icon={<Layers size={14} />}
            />
            <StatCard
              label="Open"
              value={openCount.toString()}
              sub="Accepting bets"
              icon={<Activity size={14} />}
            />
            <StatCard
              label="Resolved"
              value={resolvedCount.toString()}
              sub="Settled"
              icon={<BarChart3 size={14} />}
            />
            <StatCard
              label="Total Volume"
              value={`${formatEth(totalVol)}`}
              sub="KITE traded"
              icon={<TrendingUp size={14} />}
            />
          </div>
        </section>

        {/* ── Filters + Search ── */}
        <section className="px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filter tabs */}
            <div className="flex gap-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-1">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all ${
                    filter === f
                      ? 'bg-[#00ff00] text-black'
                      : 'text-[#555555] hover:text-[#888888]'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search markets…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />

            <span className="text-[#333333] text-xs font-mono whitespace-nowrap">
              {filtered.length} market{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </section>

        {/* ── Markets grid ── */}
        <section className="px-8 pb-12">
          <div className="max-w-7xl mx-auto">

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 animate-pulse">
                    <div className="h-3 bg-[#1a1a1a] rounded w-1/3 mb-3" />
                    <div className="h-4 bg-[#1a1a1a] rounded w-full mb-2" />
                    <div className="h-4 bg-[#1a1a1a] rounded w-3/4 mb-4" />
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full mb-3" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-[#1a1a1a] rounded w-16" />
                      <div className="h-5 bg-[#1a1a1a] rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle size={36} className="text-[#ff3333]" />
                <p className="text-[#ff3333] text-sm font-semibold">{error}</p>
                <button
                  onClick={load}
                  className="px-6 py-2 bg-[#00ff00] text-black rounded-lg font-bold text-sm hover:bg-[#00ff00]/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <BarChart3 size={36} className="text-[#222222]" />
                <p className="text-[#444444] text-sm">
                  {markets.length === 0 ? 'No markets deployed yet' : 'No markets match your filters'}
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(m => (
                  <MarketCard key={m.id} market={m} />
                ))}
              </div>
            )}

            {/* Footer meta */}
            {!loading && markets.length > 0 && (
              <p className="text-center text-[#2a2a2a] text-xs font-mono mt-8">
                Last refreshed {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}