'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MarketChart } from '@/components/market-chart';
import { ChevronLeft } from 'lucide-react';
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

export default function MarketPage({ params }: { params: { id: string } }) {
  const [betAmount, setBetAmount] = useState('15.00');
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarket() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/market/${params.id}`);
        if (!resp.ok) throw new Error('Market not found');
        const data = await resp.json();
        setMarket(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load market');
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
  }, [params.id]);

  const deals = [
    { id: 1, user: 'alice_trader', amount: 500, outcome: 'Win', timestamp: '2m ago' },
    { id: 2, user: 'btc_hodler', amount: 250, outcome: 'Pending', timestamp: '5m ago' },
    { id: 3, user: 'crypto_punk', amount: 1000, outcome: 'Win', timestamp: '12m ago' },
    { id: 4, user: 'whale_watch', amount: 750, outcome: 'Loss', timestamp: '18m ago' },
    { id: 5, user: 'market_maker', amount: 2000, outcome: 'Win', timestamp: '25m ago' },
  ];

  if (loading) return <div className="text-center text-white py-20">Loading market...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header */}
        <section className="border-b border-[#1a1a1a] px-8 py-6 bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors mb-4">
              <ChevronLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  BTC Level End Earn Market
                </h1>
                <p className="text-[#888888]">
                  Predict whether Bitcoin will reach $30,000 by March 31, 2026
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-active">Active</span>
                <span className="text-[#888888] text-sm">Expires: Mar 31, 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Proposition & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* The Proposition */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">The Proposition</h2>
                <p className="text-[#888888] leading-relaxed mb-4">
                  This market predicts whether Bitcoin will close above $30,000 USD on March 31, 2026. Resolution will be determined by the official CoinGecko BTC/USD price at market close UTC.
                </p>
                <p className="text-[#888888] text-sm">
                  Current prediction confidence: <span className="text-[#00ff00] font-semibold">87%</span>
                </p>
              </div>

              {/* AI Reasoning */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">AI Reasoning</h2>
                <div className="space-y-3">
                  <p className="text-[#888888]">
                    <span className="text-[#00ff00] font-semibold">Technical Strength:</span> Bitcoin has broken through key resistance levels with strong volume confirmation.
                  </p>
                  <p className="text-[#888888]">
                    <span className="text-[#00ff00] font-semibold">Market Sentiment:</span> Positive correlation with macro indices suggests sustained bullish pressure.
                  </p>
                  <p className="text-[#888888]">
                    <span className="text-[#00ff00] font-semibold">On-Chain Signals:</span> Large accumulation patterns detected in whale wallets over past 48 hours.
                  </p>
                </div>
                <div className="mt-4 p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                  <p className="text-sm text-[#888888]">
                    Associated Repository: <a href="#" className="text-[#00ff00] hover:underline">ethereum/go-ethereum</a>
                  </p>
                </div>
              </div>

              {/* Rules */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Rules & Resolution</h2>
                <ul className="space-y-2">
                  <li className="flex gap-3 text-[#888888]">
                    <span className="text-[#00ff00] font-bold">•</span>
                    <span>
                      <b>Resolution Type:</b> {market?.resolution_type || '—'}
                    </span>
                  </li>
                  <li className="flex gap-3 text-[#888888]">
                    <span className="text-[#00ff00] font-bold">•</span>
                    <span>
                      <b>Data Source URL:</b> {market?.data_source_url ? (
                        <a href={market.data_source_url} target="_blank" rel="noopener noreferrer" className="text-[#00ff00] underline break-all">{market.data_source_url}</a>
                      ) : '—'}
                    </span>
                  </li>
                  <li className="flex gap-3 text-[#888888]">
                    <span className="text-[#00ff00] font-bold">•</span>
                    <span>
                      <b>Evaluation Logic:</b>
                      <pre className="bg-[#181818] rounded p-2 mt-1 text-xs text-[#00ff00] whitespace-pre-wrap overflow-x-auto max-w-full">
                        {market?.evaluation_logic ? JSON.stringify(market.evaluation_logic, null, 2) : '—'}
                      </pre>
                    </span>
                  </li>
                  <li className="flex gap-3 text-[#888888]">
                    <span className="text-[#00ff00] font-bold">•</span>
                    <span>
                      <b>Resolution Condition:</b> {market?.resolution_condition || '—'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Chart */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Price History</h2>
                <MarketChart data={priceData} />
              </div>
            </div>

            {/* Right Column - Betting Panel */}
            <div className="space-y-6">
              {/* Current Price */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <p className="text-[#888888] text-sm mb-2">Current Market Price</p>
                <div className="text-5xl font-black text-[#00ff00] mb-2">
                  $27,611.95
                </div>
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
                  <button className="flex-1 px-4 py-2 bg-[#00ff00] text-[#000000] rounded font-semibold text-sm">
                    Wallet
                  </button>
                  <button className="flex-1 px-4 py-2 bg-[#1a1a1a] text-[#888888] rounded font-semibold text-sm hover:bg-[#333333] transition-colors">
                    Request
                  </button>
                </div>

                {/* Bet Amount Input */}
                <div className="mb-4">
                  <label className="block text-[#888888] text-xs font-semibold mb-2">
                    Bet Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]">$</span>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Prediction Selector */}
                <div className="mb-4">
                  <p className="text-[#888888] text-xs font-semibold mb-2">Your Prediction</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-3 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] rounded-lg font-semibold text-sm hover:bg-[#00ff00]/20 transition-colors">
                      YES (↑)
                    </button>
                    <button className="px-4 py-3 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg font-semibold text-sm hover:border-[#ff3333] hover:text-[#ff3333] transition-colors">
                      NO (↓)
                    </button>
                  </div>
                </div>

                {/* Fee Info */}
                <div className="text-xs text-[#888888] space-y-1 mb-6 p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                  <div className="flex justify-between">
                    <span>Bet Amount:</span>
                    <span>${betAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee (2%):</span>
                    <span>${(parseFloat(betAmount) * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#333333] pt-2 mt-2 flex justify-between text-[#00ff00] font-semibold">
                    <span>Total Cost:</span>
                    <span>${(parseFloat(betAmount) * 1.02).toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Bet Button */}
                <button className="btn-primary-green w-full">
                  Place Bet ${betAmount}
                </button>

                {/* Potential Payout */}
                <div className="text-xs text-[#888888] text-center mt-4">
                  Potential payout: <span className="text-[#00ff00] font-bold">${(parseFloat(betAmount) * 1.8).toFixed(2)}</span>
                </div>
              </div>

              {/* Market Stats */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Market Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-sm">Total Value</span>
                    <span className="text-white font-semibold">$3.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-sm">Active Bets</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-sm">YES / NO Ratio</span>
                    <span className="text-white font-semibold">65% / 35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-sm">Liquidity</span>
                    <span className="text-[#00ff00] font-semibold">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deal History */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Deal History</h2>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#000000]">
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">User</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Amount</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Prediction</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">@{deal.user}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#00ff00] font-semibold">${deal.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#888888] text-sm">YES ↑</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                          deal.outcome === 'Win'
                            ? 'bg-[#00ff00]/10 text-[#00ff00]'
                            : deal.outcome === 'Loss'
                              ? 'bg-[#ff3333]/10 text-[#ff3333]'
                              : 'bg-[#ffcc00]/10 text-[#ffcc00]'
                        }`}>
                          {deal.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[#888888] text-sm">{deal.timestamp}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer Padding */}
        <div className="h-12" />
      </div>
    </DashboardLayout>
  );
}
