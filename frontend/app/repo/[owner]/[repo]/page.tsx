'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MetricCard } from '@/components/metric-card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChevronLeft, ExternalLink, Star, GitBranch } from 'lucide-react';
import Link from 'next/link';

// Mock data
const commitVelocityData = [
  { week: 'W1', commits: 120 },
  { week: 'W2', commits: 145 },
  { week: 'W3', commits: 98 },
  { week: 'W4', commits: 187 },
  { week: 'W5', commits: 165 },
  { week: 'W6', commits: 201 },
  { week: 'W7', commits: 178 },
  { week: 'W8', commits: 215 },
];

const marketOutcomesData = [
  { outcome: 'Win', value: 45 },
  { outcome: 'Loss', value: 28 },
  { outcome: 'Resolved', value: 27 },
];

const accuracyTimelineData = [
  { month: 'Jan', accuracy: 82 },
  { month: 'Feb', accuracy: 88 },
  { month: 'Mar', accuracy: 91 },
];

const activityTimeline = [
  {
    id: 1,
    timestamp: 'Mar 25, 14:32',
    event: 'Merged PR #4521',
    description: 'Implement improved hashing algorithm',
    market: 'Ethereum Gas Optimization',
  },
  {
    id: 2,
    timestamp: 'Mar 24, 09:15',
    event: 'Commit: 5a3c2e1',
    description: 'Fix critical bug in validator consensus',
    market: 'Protocol Stability Index',
  },
  {
    id: 3,
    timestamp: 'Mar 23, 16:42',
    event: 'Released v2.1.0',
    description: 'Major version release with security patches',
    market: 'Ethereum Network Health',
  },
  {
    id: 4,
    timestamp: 'Mar 22, 11:20',
    event: 'Opened Issue #4567',
    description: 'Performance regression in block validation',
    market: null,
  },
  {
    id: 5,
    timestamp: 'Mar 21, 13:55',
    event: 'Merged PR #4510',
    description: 'Upgrade dependencies to latest versions',
    market: 'Smart Contract Efficiency',
  },
];

const COLORS = ['#00ff00', '#ff3333', '#ffcc00'];

export default function RepoIntelPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = React.use(params);
  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header */}
        <section className="border-b border-[#1a1a1a] px-8 py-6 bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <Link href="/explore" className="flex items-center gap-2 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors mb-4">
              <ChevronLeft size={20} />
              <span>Back to Fleet</span>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  {owner}/{repo}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[#888888]">
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>3.2k stars</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch size={16} />
                    <span>TypeScript</span>
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-[#00ff00] hover:underline"
                  >
                    View on GitHub
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Dashboard */}
        <section className="px-8 py-8 bg-[#000000]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Historical Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                label="Historical Accuracy"
                value="91%"
                change={3.2}
                subtext="Last 30 days prediction accuracy"
              />
              <MetricCard
                label="Total Markets Created"
                value="127"
                change={12}
                subtext="Markets from this repository"
              />
              <MetricCard
                label="Avg Resolution Time"
                value="18.5h"
                subtext="Average market resolution"
              />
              <MetricCard
                label="AI Engagement Rate"
                value="94.3%"
                change={-0.8}
                subtext="Markets actively monitored"
              />
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Commit Velocity Chart */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Commit Velocity (8-Week)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={commitVelocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="week" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                      }}
                      cursor={{ fill: '#00ff00' }}
                    />
                    <Bar dataKey="commits" fill="#00ff00" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Prediction Accuracy Timeline */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  AI Prediction Accuracy
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={accuracyTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="month" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} domain={[70, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                      }}
                      cursor={{ stroke: '#00ff00' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#00ff00"
                      strokeWidth={3}
                      dot={{ fill: '#00ff00', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Outcomes Pie Chart */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Market Outcomes</h3>
              <div className="flex items-center justify-center h-300">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketOutcomesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ outcome, value }) => `${outcome}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {marketOutcomesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="px-8 py-8 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Activity Timeline</h2>

            <div className="space-y-4">
              {activityTimeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 hover:border-[#00ff00]/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-bold">{item.event}</h3>
                          <p className="text-[#888888] text-sm mt-1">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-[#888888] text-xs whitespace-nowrap ml-4">
                          {item.timestamp}
                        </span>
                      </div>

                      {item.market && (
                        <div className="mt-3">
                          <Link
                            href={`/market/${item.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] border border-[#333333] text-[#00ff00] text-xs rounded hover:border-[#00ff00] transition-colors"
                          >
                            {item.market}
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Padding */}
        <div className="h-12" />
      </div>
    </DashboardLayout>
  );
}
