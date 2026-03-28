'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Search, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// Mock repository data for the 360 repos heatmap
const repos = Array.from({ length: 360 }, (_, i) => ({
  id: `repo-${i}`,
  name: `${['ethereum', 'solana', 'bitcoin', 'polygon', 'arbitrum'][i % 5]}/repo-${i}`,
  ecosystem: ['Ethereum', 'Solana', 'Bitcoin', 'Polygon', 'Arbitrum'][i % 5],
  language: ['Rust', 'Go', 'TypeScript', 'Python', 'Move'][i % 5],
  status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Resolved' : 'Pending',
  activity: Math.random() * 100,
  lastScan: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  commits: Math.floor(Math.random() * 500) + 10,
}));

export default function ExplorePage() {
  const [ecosystemFilter, setEcosystemFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesEcosystem =
        ecosystemFilter === 'All' || repo.ecosystem === ecosystemFilter;
      const matchesLanguage =
        languageFilter === 'All' || repo.language === languageFilter;
      const matchesStatus =
        statusFilter === 'All' || repo.status === statusFilter;
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesEcosystem && matchesLanguage && matchesStatus && matchesSearch;
    });
  }, [ecosystemFilter, languageFilter, statusFilter, searchTerm]);

  const getActivityColor = (activity: number) => {
    if (activity > 75) return 'bg-[#00ff00]';
    if (activity > 50) return 'bg-[#ffcc00]';
    if (activity > 25) return 'bg-[#ff6600]';
    return 'bg-[#333333]';
  };

  const getActivityIntensity = (activity: number) => {
    return Math.ceil((activity / 100) * 100);
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000] border-b border-[#1a1a1a] px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-white mb-2">The Fleet</h1>
            <p className="text-[#888888] mb-8">
              Monitor 360 repositories across ecosystems. Commit velocity heatmap reveals activity patterns and market opportunities.
            </p>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ecosystem Filter */}
              <div className="relative">
                <label className="block text-[#888888] text-xs font-semibold mb-2">
                  Ecosystem
                </label>
                <div className="relative">
                  <select
                    value={ecosystemFilter}
                    onChange={(e) => setEcosystemFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    <option>All</option>
                    <option>Ethereum</option>
                    <option>Solana</option>
                    <option>Bitcoin</option>
                    <option>Polygon</option>
                    <option>Arbitrum</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Language Filter */}
              <div className="relative">
                <label className="block text-[#888888] text-xs font-semibold mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    <option>All</option>
                    <option>Rust</option>
                    <option>Go</option>
                    <option>TypeScript</option>
                    <option>Python</option>
                    <option>Move</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <label className="block text-[#888888] text-xs font-semibold mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Resolved</option>
                    <option>Pending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <label className="block text-[#888888] text-xs font-semibold mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={18} />
                  <input
                    type="text"
                    placeholder="repo name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#888888] focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heatmap Grid */}
        <section className="px-8 py-12 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Activity Heatmap ({filteredRepos.length} repos)
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#333333]" />
                  <span className="text-[#888888]">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#ff6600]" />
                  <span className="text-[#888888]">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#ffcc00]" />
                  <span className="text-[#888888]">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#00ff00]" />
                  <span className="text-[#888888]">Very High</span>
                </div>
              </div>
            </div>

            {/* Responsive Heatmap Grid */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 overflow-x-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))' }}>
                {filteredRepos.slice(0, 120).map((repo) => (
                  <div
                    key={repo.id}
                    className={`w-6 h-6 rounded cursor-pointer hover:ring-2 hover:ring-[#00ff00] transition-all ${getActivityColor(
                      repo.activity
                    )}`}
                    title={`${repo.name}: ${repo.activity.toFixed(1)}% activity`}
                  />
                ))}
              </div>
              <p className="text-[#888888] text-xs mt-4">
                Showing first 120 repositories. Total: {filteredRepos.length}
              </p>
            </div>
          </div>
        </section>

        {/* Scout List Table */}
        <section className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Scout List</h2>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#000000]">
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Repository
                    </th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Language
                    </th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">
                      Last Scan
                    </th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepos.slice(0, 10).map((repo) => (
                    <tr
                      key={repo.id}
                      className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{repo.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#888888] text-sm">{repo.language}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={repo.status === 'Active' ? 'badge-active' : repo.status === 'Resolved' ? 'badge-inactive' : 'badge-warning'}>
                          {repo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-[#1a1a1a] rounded h-2">
                            <div
                              className={`h-full rounded ${getActivityColor(repo.activity)}`}
                              style={{ width: `${repo.activity}%` }}
                            />
                          </div>
                          <span className="text-[#888888] text-xs w-8 text-right">
                            {repo.activity.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[#888888] text-sm">{repo.lastScan}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/repo/${repo.name.split('/')[0]}/${repo.name.split('/')[1]}`}
                          className="text-[#00ff00] hover:underline text-sm font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-[#000000] border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888] text-sm">
                  Showing 10 of {filteredRepos.length} repositories
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
