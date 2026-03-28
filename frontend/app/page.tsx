'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MarketCard } from '@/components/market-card';
import { MetricCard } from '@/components/metric-card';
import { TrendingUp, Users, Zap } from 'lucide-react';

const featuredMarkets = [
  {
    id: 'btc-1',
    title: 'BTC Level End Earn',
    price: 27611.95,
    change: 12.34,
    createdAt: '2h ago',
    volume: 350000,
  },
  {
    id: 'btc-2',
    title: 'Enemies Clan | BTC Game',
    price: 15000,
    change: 8.5,
    createdAt: '1h ago',
    volume: 150000,
  },
  {
    id: 'btc-3',
    title: 'Bitcoin Surge Prediction',
    price: 28500,
    change: -2.1,
    createdAt: '3h ago',
    volume: 200000,
  },
  {
    id: 'btc-4',
    title: 'Altcoin Rally Indicator',
    price: 4200,
    change: 15.7,
    createdAt: '30m ago',
    volume: 120000,
  },
  {
    id: 'btc-5',
    title: 'DeFi Protocol Lock',
    price: 85000000,
    change: 5.2,
    createdAt: '45m ago',
    volume: 500000,
  },
  {
    id: 'btc-6',
    title: 'NFT Floor Price Move',
    price: 2.5,
    change: -1.8,
    createdAt: '20m ago',
    volume: 45000,
  },
];

const recentMarkets = [
  {
    id: 'market-1',
    title: 'BTC/USDT Momentum',
    price: 27611.95,
    change: 12.34,
    timestamp: 'Mar 27, 13:15',
  },
  {
    id: 'market-2',
    title: 'Ethereum Gas Wars',
    price: 1850,
    change: 4.2,
    timestamp: 'Mar 27, 13:10',
  },
  {
    id: 'market-3',
    title: 'Solana Network Health',
    price: 105,
    change: -3.1,
    timestamp: 'Mar 27, 13:05',
  },
  {
    id: 'market-4',
    title: 'Binance Trading Volume',
    price: 2400000000,
    change: 8.7,
    timestamp: 'Mar 27, 13:00',
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000] border-b border-[#1a1a1a] px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                <span className="text-[#00ff00]">PREDICT BTC LEVEL</span>
                <br />
                END EARN MONEY WITH
                <br />
                <span className="text-[#00ff00]">FRIENDS &</span> COLLABORATORS
              </h1>
              <p className="text-[#888888] text-lg max-w-2xl mx-auto">
                Real-time command center for cryptocurrency market intelligence. Make predictions, earn rewards, collaborate with your network.
              </p>
            </div>

            {/* Live Ticker */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
              {recentMarkets.map((market) => (
                <div
                  key={market.id}
                  className="flex-shrink-0 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 whitespace-nowrap hover:border-[#00ff00]/30 transition-colors cursor-pointer"
                >
                  <div className="text-sm font-semibold text-white">{market.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#00ff00] font-mono">${market.price.toLocaleString()}</span>
                    <span className={`text-xs font-semibold ${
                      market.change >= 0 ? 'text-[#00ff00]' : 'text-[#ff3333]'
                    }`}>
                      {market.change >= 0 ? '+' : ''}{market.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Live Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                label="API Quota Usage"
                value="7,234 / 10,000"
                icon={<Zap size={20} />}
                change={2.1}
                subtext="Resets in 4 days"
              />
              <MetricCard
                label="Total Value Locked"
                value="$847.2M"
                icon={<TrendingUp size={20} />}
                change={15.3}
                subtext="Across all markets"
              />
              <MetricCard
                label="Agent Confidence"
                value="94.2%"
                icon={<Users size={20} />}
                change={3.8}
                subtext="Based on recent wins"
              />
            </div>
          </div>
        </section>

        {/* Featured Markets Grid */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">High Signal Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMarkets.map((market) => (
                <MarketCard key={market.id} {...market} />
              ))}
            </div>
          </div>
        </section>

        {/* Market List Table */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">All Active Markets</h2>
              <button className="text-[#888888] hover:text-[#00ff00] transition-colors text-sm">
                View all →
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#000000]">
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Market Name
                    </th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">
                      Value
                    </th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentMarkets.map((market) => (
                    <tr
                      key={market.id}
                      className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{market.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-active">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="metric-value">${market.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[#888888] text-sm">{market.timestamp}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={`/market/${market.id}`}
                          className="text-[#00ff00] hover:underline text-sm font-semibold"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-[#000000] border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888] text-sm">
                  Showing 4 of 247 markets
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
