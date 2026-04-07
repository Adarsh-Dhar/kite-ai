'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import {
  connectWallet,
  createMarketFromDraft,
  DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH,
  getCreateMarketCosts,
  type DraftMarket,
} from '@/lib/contract';
import { ArrowRight, Loader2, Sparkles, Wallet, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

type DraftApiResponse = DraftMarket & {
  resolution_type: string;
  data_source_url: string;
  evaluation_logic: Record<string, unknown>;
  resolution_condition: string;
};

function safeParseJson(value: string): Record<string, unknown> {
  if (!value.trim()) return {};
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Evaluation logic must be a JSON object.');
  }
  return parsed as Record<string, unknown>;
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export default function CreateMarketPage() {
  const [prompt, setPrompt] = useState('Will the next major Solana upgrade ship on time?');
  const [draft, setDraft] = useState<DraftApiResponse | null>(null);
  const [evaluationLogicText, setEvaluationLogicText] = useState('{}');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const costs = getCreateMarketCosts(DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH);

  async function handleDraftSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setTxHash('');
    setIsDrafting(true);

    try {
      const response = await fetch('/api/market/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail ?? payload?.error ?? 'Failed to draft market.');
      }

      setDraft(payload as DraftApiResponse);
      setEvaluationLogicText(JSON.stringify(payload.evaluation_logic ?? {}, null, 2));
    } catch (draftError) {
      setError(formatError(draftError));
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleDeploy() {
    if (!draft) return;

    setError('');
    setTxHash('');
    setIsDeploying(true);

    try {
      const connectedWallet = await connectWallet();
      setWalletAddress(connectedWallet);

      const evaluationLogic = safeParseJson(evaluationLogicText);
      const payload: DraftMarket = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        options: draft.options ?? ['Yes', 'No'],
        agent_reason: draft.agent_reason ?? '',
        resolution_type: draft.resolution_type.trim(),
        data_source_url: draft.data_source_url.trim(),
        evaluation_logic: evaluationLogic,
        resolution_condition: draft.resolution_condition.trim(),
      };

      const hash = await createMarketFromDraft(payload, connectedWallet, DEFAULT_MARKET_INITIAL_LIQUIDITY_ETH);
      setTxHash(hash);
    } catch (deployError) {
      setError(formatError(deployError));
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(0,255,0,0.12),transparent_32%),linear-gradient(180deg,#060606_0%,#000000_44%,#050505_100%)] px-6 py-8 md:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#060606]/80 shadow-[0_0_0_1px_rgba(0,255,0,0.05),0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00ff00]/20 bg-[#00ff00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#00ff00]">
                  <Sparkles size={14} />
                  Draft Market
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                  What market do you want to build?
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[#9a9a9a] md:text-base">
                  Describe the outcome you want to trade on. The architect will draft a market question, resolution rules, and a data source for review before you sign the deployment with your wallet.
                </p>

                <form onSubmit={handleDraftSubmit} className="space-y-4 pt-2">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={5}
                    placeholder="Example: Will the next major Solana upgrade ship on time?"
                    className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-4 text-sm text-white placeholder:text-[#555] outline-none transition focus:border-[#00ff00]/60 focus:ring-2 focus:ring-[#00ff00]/10"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isDrafting || !prompt.trim()}
                      className="inline-flex items-center gap-2 rounded-full bg-[#00ff00] px-5 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_24px_rgba(0,255,0,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDrafting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                      Draft market
                    </button>
                    <span className="text-xs text-[#6d6d6d]">
                      Drafting is free. Deployment costs {costs.initialLiquidityEth.toFixed(3)} KITE + 10% fee.
                    </span>
                  </div>
                </form>
              </div>

              <div className="grid gap-4 rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#00ff00]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#666]">Deployment Cost</p>
                    <p className="text-lg font-bold text-white">
                      {costs.initialLiquidityEth.toFixed(3)} KITE + {costs.serviceFeeEth.toFixed(3)} KITE fee
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-4 text-sm text-[#9a9a9a]">
                  The connected wallet signs the onchain transaction. The draft is only persisted in the UI until you deploy.
                </div>
                <div className="grid gap-3 text-sm text-[#9a9a9a]">
                  <div className="flex items-center justify-between rounded-xl border border-[#171717] bg-[#090909] px-4 py-3">
                    <span>Initial liquidity</span>
                    <span className="font-mono text-white">{costs.initialLiquidityEth.toFixed(3)} KITE</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#171717] bg-[#090909] px-4 py-3">
                    <span>Service fee</span>
                    <span className="font-mono text-white">{costs.serviceFeeEth.toFixed(3)} KITE</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#171717] bg-[#090909] px-4 py-3">
                    <span>Total required</span>
                    <span className="font-mono text-[#00ff00]">{costs.totalEth.toFixed(3)} KITE</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-[#ff3333]/30 bg-[#ff3333]/10 px-5 py-4 text-sm text-[#ff9a9a]">
              {error}
            </div>
          )}

          {txHash && (
            <div className="rounded-2xl border border-[#00ff00]/30 bg-[#00ff00]/10 px-5 py-4 text-sm text-[#d4ffd4]">
              Market deployment submitted from {walletAddress || 'your wallet'}. Transaction hash: <span className="font-mono text-white">{txHash}</span>
            </div>
          )}

          {draft ? (
            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6 rounded-3xl border border-[#1a1a1a] bg-[#090909]/95 p-6 md:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#666]">Review Draft</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Editable market details</h2>
                </div>

                <div className="grid gap-5">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Title</span>
                    <input
                      value={draft.title}
                      onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                      className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#00ff00]/60"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Description</span>
                    <textarea
                      value={draft.description}
                      onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                      rows={4}
                      className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#00ff00]/60"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Resolution type</span>
                      <input
                        value={draft.resolution_type}
                        onChange={(event) => setDraft({ ...draft, resolution_type: event.target.value })}
                        className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#00ff00]/60"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Data source URL</span>
                      <input
                        value={draft.data_source_url}
                        onChange={(event) => setDraft({ ...draft, data_source_url: event.target.value })}
                        className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#00ff00]/60"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Resolution condition</span>
                    <textarea
                      value={draft.resolution_condition}
                      onChange={(event) => setDraft({ ...draft, resolution_condition: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#00ff00]/60"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#666]">Evaluation logic</span>
                    <textarea
                      value={evaluationLogicText}
                      onChange={(event) => setEvaluationLogicText(event.target.value)}
                      rows={8}
                      className="w-full rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] px-4 py-3 font-mono text-sm text-[#d7d7d7] outline-none focus:border-[#00ff00]/60"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="inline-flex items-center gap-2 rounded-full bg-[#00ff00] px-5 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_24px_rgba(0,255,0,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeploying ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                    Deploy Market (Costs {costs.initialLiquidityEth.toFixed(3)} KITE + 10% Fee)
                  </button>
                  <Link href="/markets" className="text-sm text-[#9a9a9a] transition hover:text-[#00ff00]">
                    View markets
                  </Link>
                </div>
              </div>

              <aside className="space-y-6 rounded-3xl border border-[#1a1a1a] bg-[#090909]/95 p-6 md:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#666]">Preview</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">What will be deployed</h2>
                </div>

                <div className="space-y-4 rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#666]">Title</p>
                    <p className="mt-1 text-lg font-semibold text-white">{draft.title || 'Untitled market'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#666]">Description</p>
                    <p className="mt-1 text-sm leading-6 text-[#bcbcbc]">{draft.description || 'No description yet.'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#666]">Resolution rules</p>
                    <p className="mt-1 text-sm leading-6 text-[#bcbcbc]">{draft.resolution_condition || 'No resolution condition yet.'}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-5 text-sm text-[#9a9a9a]">
                  <div className="flex items-center gap-2 text-white">
                    <ExternalLink size={16} className="text-[#00ff00]" />
                    Resolved with {draft.resolution_type || 'LLM_JUDGE'}
                  </div>
                  <p>
                    The backend drafts the market JSON. Your wallet signs the onchain createMarket transaction directly on Kite testnet.
                  </p>
                  <p className="font-mono text-xs text-[#666] break-all">
                    {draft.data_source_url || 'No data source selected yet.'}
                  </p>
                </div>
              </aside>
            </section>
          ) : (
            <section className="rounded-3xl border border-[#1a1a1a] bg-[#090909]/95 p-8 text-center text-[#8b8b8b]">
              <p className="text-lg font-semibold text-white">Draft a market to start reviewing it.</p>
              <p className="mt-2 text-sm">
                The architect will return a structured proposal that you can edit before deployment.
              </p>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}