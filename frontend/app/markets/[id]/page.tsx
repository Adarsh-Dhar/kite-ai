'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MarketChart } from '@/components/market-chart';
import { ChevronLeft, ExternalLink, ShieldCheck, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock price history data
const generatePriceData = () => {
  const data = [];
  let price = 27500;
  for (let i = 0; i < 48; i++) {
    price += (Math.random() - 0.45) * 500;
    data.push({
      time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${String((i % 2) * 30).padStart(2, '0')}`,
      price: Math.max(price, 20000),
    });
  }
  return data;
};

const priceData = generatePriceData();

// ── Resolution type metadata ──────────────────────────────────────────────────

const RESOLUTION_TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  GITHUB_PR:      { label: 'GitHub PR',       color: 'text-[#00ccff] bg-[#00ccff]/10 border-[#00ccff]/30', icon: '⌥' },
  GITHUB_RELEASE: { label: 'GitHub Release',  color: 'text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/30', icon: '🏷' },
  GITHUB_ISSUE:   { label: 'GitHub Issue',    color: 'text-[#ffcc00] bg-[#ffcc00]/10 border-[#ffcc00]/30', icon: '⚐' },
  CI_METRIC:      { label: 'CI/CD Metric',    color: 'text-[#ff9900] bg-[#ff9900]/10 border-[#ff9900]/30', icon: '⬡' },
  CVE_SECURITY:   { label: 'CVE Security',    color: 'text-[#ff3333] bg-[#ff3333]/10 border-[#ff3333]/30', icon: '⚠' },
  WEB3_RPC:       { label: 'On-Chain RPC',    color: 'text-[#aa44ff] bg-[#aa44ff]/10 border-[#aa44ff]/30', icon: '⬡' },
  DAO_GOVERNANCE: { label: 'DAO Governance',  color: 'text-[#ff00ff] bg-[#ff00ff]/10 border-[#ff00ff]/30', icon: '⬟' },
  LLM_JUDGE:      { label: 'LLM Judge',       color: 'text-[#888888] bg-[#888888]/10 border-[#888888]/30', icon: '🤖' },
};

// ── EvaluationLogic renderer ──────────────────────────────────────────────────

function EvaluationLogicPanel({ logic, resolutionType }: { logic: Record<string, unknown> | null; resolutionType: string }) {
  if (!logic) return null;

  const rows: Array<{ key: string; value: string; highlight?: boolean }> = [];

  // Parse the logic object into human-readable rows based on resolution_type
  switch (resolutionType) {
    case 'GITHUB_PR':
      if (logic.check)         rows.push({ key: 'Check field',   value: String(logic.check) });
      if (logic.yes_condition) rows.push({ key: '✓ YES if',      value: String(logic.yes_condition), highlight: true });
      if (logic.no_condition)  rows.push({ key: '✗ NO if',       value: String(logic.no_condition) });
      break;
    case 'GITHUB_RELEASE':
      if (logic.tag_pattern)   rows.push({ key: 'Tag pattern',   value: String(logic.tag_pattern) });
      if (logic.yes_condition) rows.push({ key: '✓ YES if',      value: String(logic.yes_condition), highlight: true });
      if (logic.no_condition)  rows.push({ key: '✗ NO if',       value: String(logic.no_condition) });
      break;
    case 'GITHUB_ISSUE':
      if (logic.issue_number)  rows.push({ key: 'Issue #',       value: String(logic.issue_number) });
      if (logic.yes_condition) rows.push({ key: '✓ YES if',      value: String(logic.yes_condition), highlight: true });
      if (logic.no_condition)  rows.push({ key: '✗ NO if',       value: String(logic.no_condition) });
      break;
    case 'CI_METRIC':
      if (logic.metric_name)   rows.push({ key: 'Metric',        value: String(logic.metric_name) });
      if (logic.artifact_name) rows.push({ key: 'Artifact',      value: String(logic.artifact_name) });
      if (logic.operator && logic.threshold !== undefined)
                               rows.push({ key: 'Threshold',     value: `${logic.operator} ${logic.threshold}`, highlight: true });
      if (logic.json_path)     rows.push({ key: 'JSON path',     value: String(logic.json_path) });
      break;
    case 'CVE_SECURITY':
      if (logic.keyword)        rows.push({ key: 'Keyword',      value: String(logic.keyword) });
      if (logic.min_severity)   rows.push({ key: 'Min severity', value: String(logic.min_severity), highlight: true });
      if (logic.yes_condition)  rows.push({ key: '✓ YES if',     value: String(logic.yes_condition), highlight: true });
      if (logic.cve_id)         rows.push({ key: 'Specific CVE', value: String(logic.cve_id) });
      break;
    case 'WEB3_RPC':
      if (logic.method)             rows.push({ key: 'Method',   value: String(logic.method) });
      if (logic.contract_address)   rows.push({ key: 'Contract', value: `${String(logic.contract_address).slice(0, 10)}…` });
      if (logic.event_name)         rows.push({ key: 'Event',    value: String(logic.event_name) });
      if (logic.threshold !== undefined)
                                    rows.push({ key: 'Threshold', value: String(logic.threshold), highlight: true });
      break;
    case 'DAO_GOVERNANCE':
      if (logic.space)          rows.push({ key: 'Space',        value: String(logic.space) });
      if (logic.proposal_id)    rows.push({ key: 'Proposal ID',  value: `${String(logic.proposal_id).slice(0, 14)}…` });
      if (logic.quorum_required !== undefined)
                                rows.push({ key: 'Quorum',       value: `${Number(logic.quorum_required) * 100}%`, highlight: true });
      if (logic.yes_condition)  rows.push({ key: '✓ YES if',     value: String(logic.yes_condition), highlight: true });
      break;
    case 'LLM_JUDGE':
      if (logic.question)           rows.push({ key: 'Question', value: String(logic.question) });
      if (logic.uncertainty_action) rows.push({ key: 'If uncertain', value: String(logic.uncertainty_action), highlight: true });
      if (Array.isArray(logic.fetch_urls) && logic.fetch_urls.length > 0)
                                    rows.push({ key: 'Source URLs', value: `${logic.fetch_urls.length} URL(s)` });
      break;
    default:
      // Fallback: render all keys generically
      for (const [k, v] of Object.entries(logic)) {
        rows.push({ key: k, value: typeof v === 'object' ? JSON.stringify(v) : String(v) });
      }
  }

  if (rows.length === 0) {
    // Render raw JSON as a fallback
    return (
      <pre className="text-xs font-mono text-[#555555] bg-[#080808] border border-[#111111] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(logic, null, 2)}
      </pre>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map(({ key, value, highlight }) => (
        <div key={key} className="flex items-start justify-between gap-4 text-xs py-1.5 border-b border-[#0d0d0d] last:border-0">
          <span className="text-[#555555] shrink-0 w-28">{key}</span>
          <span className={`font-mono text-right break-all ${highlight ? 'text-[#00ff00]' : 'text-[#888888]'}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Resolution type badge ─────────────────────────────────────────────────────

function ResolutionTypeBadge({ resolutionType }: { resolutionType: string }) {
  const meta = RESOLUTION_TYPE_META[resolutionType] ?? {
    label: resolutionType,
    color: 'text-[#888888] bg-[#888888]/10 border-[#888888]/30',
    icon: '?',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold tracking-wider ${meta.color}`}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

// ── Resolution Rules card ─────────────────────────────────────────────────────

function ResolutionRulesCard({ market }: { market: Record<string, unknown> }) {
  const resolutionType = String(market.resolution_type ?? '');
  const dataSourceUrl  = String(market.data_source_url ?? '');
  const resolutionCondition = String(market.resolution_condition ?? '');
  const evaluationLogic = market.evaluation_logic as Record<string, unknown> | null ?? null;

  const hasResolutionStrategy = resolutionType && resolutionType !== 'undefined';

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck size={18} className="text-[#00ff00]" />
        <h2 className="text-xl font-bold text-white">Resolution Rules</h2>
        {hasResolutionStrategy && <ResolutionTypeBadge resolutionType={resolutionType} />}
      </div>

      {!hasResolutionStrategy ? (
        <p className="text-[#555555] text-sm italic">No structured resolution strategy available for this market.</p>
      ) : (
        <div className="space-y-5">

          {/* How the market resolves */}
          {resolutionCondition && (
            <div className="p-3 bg-[#111111] border border-[#1a1a1a] rounded-lg">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#444444] mb-1.5">Plain-English Condition</p>
              <p className="text-[#cccccc] text-sm leading-relaxed">{resolutionCondition}</p>
            </div>
          )}

          {/* Data source URL */}
          {dataSourceUrl && (
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#444444] mb-1.5">Data Source URL</p>
              <a
                href={dataSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-[#00ccff] hover:text-[#00ff00] transition-colors break-all group"
              >
                <ExternalLink size={11} className="shrink-0 group-hover:text-[#00ff00]" />
                {dataSourceUrl}
              </a>
              <p className="text-[#333333] text-[10px] mt-1">The resolver agent calls this endpoint to determine the outcome.</p>
            </div>
          )}

          {/* Evaluation logic */}
          {evaluationLogic && (
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#444444] mb-2">Evaluation Logic</p>
              <div className="bg-[#080808] border border-[#111111] rounded-lg p-3">
                <EvaluationLogicPanel logic={evaluationLogic} resolutionType={resolutionType} />
              </div>
            </div>
          )}

          {/* Resolution type legend */}
          <div className="text-[10px] text-[#333333] pt-1 border-t border-[#111111]">
            Settlement method: <span className="text-[#555555] font-mono">{resolutionType}</span>
            {resolutionType === 'LLM_JUDGE' && (
              <span className="ml-2 text-[#ffcc00]">⚠ LLM fallback — higher uncertainty risk</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MarketPage({ params }: { params: { id: string } }) {
  const [betAmount, setBetAmount]   = useState('15.00');
  const [prediction, setPrediction] = useState<'YES' | 'NO' | null>(null);
  const [market, setMarket]         = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarket() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/market/${params.id}`);
        if (!resp.ok) throw new Error('Market not found');
        setMarket(await resp.json());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load market');
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
  }, [params.id]);

  const deals = [
    { id: 1, user: 'alice_trader', amount: 500,  outcome: 'Win',     timestamp: '2m ago' },
    { id: 2, user: 'btc_hodler',   amount: 250,  outcome: 'Pending', timestamp: '5m ago' },
    { id: 3, user: 'crypto_punk',  amount: 1000, outcome: 'Win',     timestamp: '12m ago' },
    { id: 4, user: 'whale_watch',  amount: 750,  outcome: 'Loss',    timestamp: '18m ago' },
    { id: 5, user: 'market_maker', amount: 2000, outcome: 'Win',     timestamp: '25m ago' },
  ];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#00ff00]/30 border-t-[#00ff00] rounded-full animate-spin" />
          <span className="text-[#444444] text-sm">Loading market…</span>
        </div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle size={32} className="text-[#ff3333]" />
        <p className="text-[#ff3333] text-sm">{error}</p>
        <Link href="/" className="text-[#00ff00] text-sm hover:underline">← Back to Dashboard</Link>
      </div>
    </DashboardLayout>
  );

  const title            = String(market?.title ?? 'BTC Level End Earn Market');
  const question         = String(market?.question ?? '');
  const agentReason      = String(market?.agent_reason ?? '');
  const status           = String(market?.status ?? 'OPEN');
  const resolutionDeadline = market?.resolution_deadline
    ? new Date(String(market.resolution_deadline)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Mar 31, 2026';
  const sourcePrNumber   = market?.source_pr_number ? Number(market.source_pr_number) : null;
  const sourcePrUrl      = market?.source_pr_url ? String(market.source_pr_url) : null;
  const tssScore         = market?.tss_score != null ? Number(market.tss_score) : null;
  const confidence       = market?.confidence ? Number(market.confidence) : 87;

  // Status chip
  const statusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    OPEN:     { label: 'Open',     cls: 'badge-active',   icon: <CheckCircle2 size={12} /> },
    RESOLVED: { label: 'Resolved', cls: 'badge-inactive', icon: <CheckCircle2 size={12} /> },
    INVALID:  { label: 'Invalid',  cls: 'badge-inactive', icon: <XCircle size={12} /> },
    PAUSED:   { label: 'Paused',   cls: 'badge-warning',  icon: <Clock size={12} /> },
  };
  const statusMeta = statusConfig[status] ?? statusConfig.OPEN;

  return (
    <DashboardLayout>
      <div className="w-full">

        {/* ── Header ── */}
        <section className="border-b border-[#1a1a1a] px-8 py-6 bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors mb-4 w-fit">
              <ChevronLeft size={20} />
              <span className="text-sm">Back to Dashboard</span>
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-black text-white mb-2 leading-snug">{title}</h1>
                {question && (
                  <p className="text-[#888888] text-sm max-w-2xl leading-relaxed">{question}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`flex items-center gap-1.5 ${statusMeta.cls}`}>
                  {statusMeta.icon}
                  {statusMeta.label}
                </span>
                <span className="text-[#888888] text-sm">Expires: {resolutionDeadline}</span>
              </div>
            </div>

            {/* PR metadata strip */}
            {sourcePrNumber && (
              <div className="flex items-center gap-4 mt-4 text-xs text-[#444444]">
                <span>Source:</span>
                {sourcePrUrl ? (
                  <a href={sourcePrUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#00ccff] hover:underline">
                    PR #{sourcePrNumber} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span>PR #{sourcePrNumber}</span>
                )}
                {tssScore != null && (
                  <>
                    <span>·</span>
                    <span>TSS Score: <span className="text-[#00ff00] font-mono">{(tssScore * 100).toFixed(0)}</span></span>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* The Proposition */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">The Proposition</h2>
                <p className="text-[#888888] leading-relaxed mb-4">
                  {question || 'This market predicts a verifiable outcome based on on-chain or off-chain evidence. Resolution is determined autonomously by the AI agent using the data source and evaluation logic below.'}
                </p>
                <p className="text-[#888888] text-sm">
                  Current prediction confidence: <span className="text-[#00ff00] font-semibold">{confidence}%</span>
                </p>
              </div>

              {/* AI Reasoning */}
              {agentReason && (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">AI Reasoning</h2>
                  <p className="text-[#888888] leading-relaxed">{agentReason}</p>
                  {sourcePrUrl && (
                    <div className="mt-4 p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                      <p className="text-sm text-[#888888]">
                        Associated PR:{' '}
                        <a href={sourcePrUrl} target="_blank" rel="noopener noreferrer" className="text-[#00ff00] hover:underline">
                          anza-xyz/agave #{sourcePrNumber}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Resolution Rules (dynamic) ── */}
              {market && <ResolutionRulesCard market={market} />}

              {/* Chart */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Price History</h2>
                <MarketChart data={priceData} />
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-6">

              {/* Current Price */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <p className="text-[#888888] text-sm mb-2">Current Market Price</p>
                <div className="text-5xl font-black text-[#00ff00] mb-2">$27,611.95</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#00ff00]">↑ 12.34%</span>
                  <span className="text-[#888888]">24h change</span>
                </div>
              </div>

              {/* Betting Interface */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Place Your Bet</h3>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 px-4 py-2 bg-[#00ff00] text-[#000000] rounded font-semibold text-sm">Wallet</button>
                  <button className="flex-1 px-4 py-2 bg-[#1a1a1a] text-[#888888] rounded font-semibold text-sm hover:bg-[#333333] transition-colors">Request</button>
                </div>

                {/* Bet Amount */}
                <div className="mb-4">
                  <label className="block text-[#888888] text-xs font-semibold mb-2">Bet Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]">$</span>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={e => setBetAmount(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Prediction Selector */}
                <div className="mb-4">
                  <p className="text-[#888888] text-xs font-semibold mb-2">Your Prediction</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPrediction('YES')}
                      className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                        prediction === 'YES'
                          ? 'bg-[#00ff00] text-black'
                          : 'bg-[#1a1a1a] border border-[#333333] text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00]'
                      }`}
                    >
                      YES (↑)
                    </button>
                    <button
                      onClick={() => setPrediction('NO')}
                      className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                        prediction === 'NO'
                          ? 'bg-[#ff3333] text-white'
                          : 'bg-[#1a1a1a] border border-[#333333] text-[#888888] hover:border-[#ff3333] hover:text-[#ff3333]'
                      }`}
                    >
                      NO (↓)
                    </button>
                  </div>
                </div>

                {/* Fee breakdown */}
                <div className="text-xs text-[#888888] space-y-1 mb-6 p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                  <div className="flex justify-between">
                    <span>Bet Amount:</span>
                    <span>${isNaN(+betAmount) ? '0.00' : (+betAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee (2%):</span>
                    <span>${isNaN(+betAmount) ? '0.00' : (+betAmount * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#333333] pt-2 mt-2 flex justify-between text-[#00ff00] font-semibold">
                    <span>Total Cost:</span>
                    <span>${isNaN(+betAmount) ? '0.00' : (+betAmount * 1.02).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={!prediction}
                  className="btn-primary-green w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {prediction ? `Vote ${prediction} · $${betAmount}` : 'Select YES or NO'}
                </button>

                {!isNaN(+betAmount) && +betAmount > 0 && (
                  <p className="text-xs text-[#888888] text-center mt-4">
                    Potential payout: <span className="text-[#00ff00] font-bold">${(+betAmount * 1.8).toFixed(2)}</span>
                  </p>
                )}
              </div>

              {/* Market Stats */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Market Stats</h3>
                <div className="space-y-3">
                  {[
                    ['Total Value',   '$3.2M'],
                    ['Active Bets',   '1,247'],
                    ['YES / NO Ratio','65% / 35%'],
                    ['Liquidity',     'High'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-[#888888] text-sm">{label}</span>
                      <span className={`font-semibold ${label === 'Liquidity' ? 'text-[#00ff00]' : 'text-white'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Deal History ── */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Deal History</h2>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#000000]">
                    {['User', 'Amount', 'Prediction', 'Status', 'Time'].map(h => (
                      <th key={h} className={`px-6 py-4 text-[#888888] font-semibold text-sm ${h === 'Time' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map(deal => (
                    <tr key={deal.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4"><span className="text-white font-medium">@{deal.user}</span></td>
                      <td className="px-6 py-4"><span className="text-[#00ff00] font-semibold">${deal.amount}</span></td>
                      <td className="px-6 py-4"><span className="text-[#888888] text-sm">YES ↑</span></td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                          deal.outcome === 'Win'     ? 'bg-[#00ff00]/10 text-[#00ff00]' :
                          deal.outcome === 'Loss'    ? 'bg-[#ff3333]/10 text-[#ff3333]' :
                                                       'bg-[#ffcc00]/10 text-[#ffcc00]'
                        }`}>
                          {deal.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right"><span className="text-[#888888] text-sm">{deal.timestamp}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="h-12" />
      </div>
    </DashboardLayout>
  );
}