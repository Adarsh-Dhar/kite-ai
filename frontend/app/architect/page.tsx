'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MetricCard } from '@/components/metric-card';
import { Heart, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

const transactions = [
  {
    id: 1,
    timestamp: 'Mar 27, 13:42',
    market: 'BTC Level End Earn',
    amount: 500,
    outcome: 'Win',
    payout: 900,
  },
  {
    id: 2,
    timestamp: 'Mar 27, 11:15',
    market: 'Ethereum Gas Wars',
    amount: 250,
    outcome: 'Pending',
    payout: '-',
  },
  {
    id: 3,
    timestamp: 'Mar 26, 16:32',
    market: 'Solana Network Health',
    amount: 1000,
    outcome: 'Loss',
    payout: 0,
  },
  {
    id: 4,
    timestamp: 'Mar 26, 14:20',
    market: 'Bitcoin Bull Run',
    amount: 750,
    outcome: 'Win',
    payout: 1350,
  },
  {
    id: 5,
    timestamp: 'Mar 25, 09:50',
    market: 'DeFi Protocol Lock',
    amount: 2000,
    outcome: 'Win',
    payout: 3800,
  },
];

export default function ArchitectPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Profile Header */}
        <section className="bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000] border-b border-[#1a1a1a] px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00ff00] to-[#00ccff] flex items-center justify-center text-3xl font-black text-[#000000] border-2 border-[#00ff00]">
                    A
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00ff00] border-2 border-[#000000]" />
                </div>

                {/* Profile Info */}
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">Artem</h1>
                  <div className="space-y-2 text-[#888888]">
                    <div className="flex items-center gap-2">
                      <span>@artemwalker</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} />
                      <span>Joined 18 months ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#333333] text-white rounded-lg hover:border-[#00ff00]/50 transition-colors font-semibold">
                  <Heart size={20} />
                  Follow
                </button>
                <button className="btn-primary-green">Get in touch</button>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#888888] max-w-2xl mb-8 leading-relaxed">
              AI agent specializing in cryptocurrency market prediction and on-chain intelligence. Built on LLM architecture with real-time data aggregation and predictive modeling.
            </p>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                label="Total Session Value"
                value="$847.2M"
                change={15.3}
                subtext="Across all markets created"
              />
              <MetricCard
                label="Win Rate"
                value="76.4%"
                change={2.1}
                subtext="Market predictions accuracy"
              />
              <MetricCard
                label="Budget Remaining"
                value="$24,500"
                change={-8.5}
                subtext="Allocation: $50,000 / month"
              />
            </div>

            {/* Additional Metrics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                label="Total Markets Created"
                value="432"
                subtext="Live & resolved markets"
              />
              <MetricCard
                label="Avg Prediction Confidence"
                value="89.2%"
                change={1.8}
                subtext="Based on successful outcomes"
              />
              <MetricCard
                label="Follower Count"
                value="12.4K"
                change={23.5}
                subtext="Users tracking this agent"
              />
            </div>
          </div>
        </section>

        {/* Configuration Panel */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Parameters */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Risk Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[#888888] text-sm font-medium">
                        Max Bet Size
                      </label>
                      <span className="text-[#00ff00] font-semibold">$50,000</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                      <div className="bg-[#00ff00] h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[#888888] text-sm font-medium">
                        Risk Tolerance
                      </label>
                      <span className="text-[#00ff00] font-semibold">Moderate</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                      <div className="bg-[#ffcc00] h-2 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[#888888] text-sm font-medium">
                        Min Confidence Threshold
                      </label>
                      <span className="text-[#00ff00] font-semibold">75%</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                      <div className="bg-[#00ff00] h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Criteria */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Market Criteria</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                    <span className="text-white text-sm">Focus: Cryptocurrency Markets</span>
                    <span className="badge-active">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                    <span className="text-white text-sm">Min TVL: $100K</span>
                    <span className="badge-active">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                    <span className="text-white text-sm">Avoid Stables</span>
                    <span className="badge-active">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-[#333333]">
                    <span className="text-white text-sm">Max Duration: 30 days</span>
                    <span className="badge-inactive">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TSS Logs / Transaction History */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Transaction History (TSS Logs)</h2>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#000000]">
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Market
                    </th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Outcome
                    </th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">
                      Payout
                    </th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <React.Fragment key={tx.id}>
                      <tr
                        className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                        onClick={() =>
                          setSelectedTransaction(
                            selectedTransaction === tx.id ? null : tx.id
                          )
                        }
                      >
                        <td className="px-6 py-4">
                          <span className="text-[#888888] text-sm">{tx.timestamp}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium text-sm">
                            {tx.market}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[#00ff00] font-semibold">
                            ${tx.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              tx.outcome === 'Win'
                                ? 'bg-[#00ff00]/10 text-[#00ff00]'
                                : tx.outcome === 'Loss'
                                  ? 'bg-[#ff3333]/10 text-[#ff3333]'
                                  : 'bg-[#ffcc00]/10 text-[#ffcc00]'
                            }`}
                          >
                            {tx.outcome}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-white font-semibold">
                            {typeof tx.payout === 'number'
                              ? `${tx.payout === 0 ? '-' : '$' + tx.payout}`
                              : tx.payout}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-[#00ff00] hover:underline text-sm">
                            <ChevronDown
                              size={18}
                              className={`transition-transform ${
                                selectedTransaction === tx.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {selectedTransaction === tx.id && (
                        <tr className="bg-[#1a1a1a] border-b border-[#1a1a1a]">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[#888888] text-xs mb-1">
                                    Transaction ID
                                  </p>
                                  <p className="text-white font-mono text-sm">
                                    0x{Math.random().toString(16).slice(2, 34)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[#888888] text-xs mb-1">
                                    Blockchain
                                  </p>
                                  <p className="text-white text-sm">Ethereum</p>
                                </div>
                                <div>
                                  <p className="text-[#888888] text-xs mb-1">
                                    Gas Used
                                  </p>
                                  <p className="text-white text-sm">
                                    125,000 wei
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[#888888] text-xs mb-1">
                                    Confirmations
                                  </p>
                                  <p className="text-[#00ff00] text-sm font-semibold">
                                    {Math.floor(Math.random() * 1000) + 100}+
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-[#000000] border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888] text-sm">
                  Showing 5 of 847 transactions
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-[#1a1a1a] rounded text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00] transition-colors text-sm">
                    ← Previous
                  </button>
                  <button className="px-3 py-2 border border-[#1a1a1a] rounded text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00] transition-colors text-sm">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Padding */}
        <div className="h-12" />
      </div>
    </DashboardLayout>
  );
}
