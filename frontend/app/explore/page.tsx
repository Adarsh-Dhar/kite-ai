'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Search, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { SkeletonCell } from '@/components/SkeletonCell';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RepoData {
  repository: string;
  ecosystem: string;
  language: string;
  activityScore: number;
  status: 'Active' | 'Pending' | 'Resolved';
  lastScan: string;
  prCount?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getActivityColor(score: number): string {
  if (score > 80) return 'bg-[#00ff00] shadow-[0_0_8px_#22c55e]';
  if (score > 50) return 'bg-[#00cc00]';
  if (score > 25) return 'bg-[#006600]';
  return 'bg-[#1a1a1a]';
}

function getActivityBarColor(score: number): string {
  if (score > 80) return 'bg-[#00ff00]';
  if (score > 50) return 'bg-[#ffcc00]';
  if (score > 25) return 'bg-[#ff6600]';
  return 'bg-[#333333]';
}

function formatLastScan(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return isoString;
  }
}

// ── Page component ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

export default function ExplorePage() {
  // Data state
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Filter state
  const [ecosystemFilter, setEcosystemFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/explore');
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data: RepoData[] = await res.json();
      setRepos(data);
      setLastFetched(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [ecosystemFilter, languageFilter, statusFilter, searchTerm]);

  // ── Derived filter options ─────────────────────────────────────────────────

  const ecosystems = useMemo(() => {
    const set = new Set(repos.map((r) => r.ecosystem).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [repos]);

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [repos]);

  // ── Filtered + paginated data ──────────────────────────────────────────────

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      if (ecosystemFilter !== 'All' && repo.ecosystem !== ecosystemFilter) return false;
      if (languageFilter !== 'All' && repo.language !== languageFilter) return false;
      if (statusFilter !== 'All' && repo.status !== statusFilter) return false;
      if (searchTerm && !repo.repository.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [repos, ecosystemFilter, languageFilter, statusFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / ITEMS_PER_PAGE));
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    active: repos.filter((r) => r.status === 'Active').length,
    pending: repos.filter((r) => r.status === 'Pending').length,
    highHeat: repos.filter((r) => r.activityScore > 80).length,
  }), [repos]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="w-full">

        {/* Hero */}
        <section className="bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000] border-b border-[#1a1a1a] px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">The Fleet</h1>
                <p className="text-[#888888]">
                  Real-time AI-scouted repositories. Activity scores derived from average TSS across the last 7 days.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastFetched && (
                  <span className="text-[#444444] text-xs font-mono">
                    Updated {formatLastScan(lastFetched.toISOString())}
                  </span>
                )}
                <button
                  onClick={fetchRepos}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg hover:border-[#00ff00]/50 hover:text-[#00ff00] transition-colors text-sm"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Quick stats (only when data is loaded) */}
            {!loading && !error && repos.length > 0 && (
              <div className="flex gap-6 mb-8 text-sm">
                <div>
                  <span className="text-[#00ff00] font-bold">{repos.length}</span>
                  <span className="text-[#555555] ml-1">repos tracked</span>
                </div>
                <div>
                  <span className="text-[#00ff00] font-bold">{stats.active}</span>
                  <span className="text-[#555555] ml-1">active markets</span>
                </div>
                <div>
                  <span className="text-[#ffcc00] font-bold">{stats.pending}</span>
                  <span className="text-[#555555] ml-1">pending</span>
                </div>
                <div>
                  <span className="text-[#00ff00] font-bold">{stats.highHeat}</span>
                  <span className="text-[#555555] ml-1">high heat</span>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ecosystem */}
              <div>
                <label className="block text-[#888888] text-xs font-semibold mb-2">Ecosystem</label>
                <div className="relative">
                  <select
                    value={ecosystemFilter}
                    onChange={(e) => setEcosystemFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    {ecosystems.map((e) => <option key={e}>{e}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[#888888] text-xs font-semibold mb-2">Language</label>
                <div className="relative">
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    {languages.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[#888888] text-xs font-semibold mb-2">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-[#00ff00]/30 transition-colors"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[#888888] text-xs font-semibold mb-2">Search</label>
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

        {/* Heatmap */}
        <section className="px-8 py-12 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Activity Heatmap
                {!loading && (
                  <span className="text-[#555555] font-normal text-base ml-2">
                    ({filteredRepos.length} repos)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#1a1a1a]" />
                  <span className="text-[#888888]">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#006600]" />
                  <span className="text-[#888888]">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#00cc00]" />
                  <span className="text-[#888888]">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#00ff00] shadow-[0_0_6px_#22c55e]" />
                  <span className="text-[#888888]">Very High</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
              {loading ? (
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))' }}>
                  {Array.from({ length: 120 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded bg-[#1a1a1a] animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 text-[#ff3333] py-8 justify-center">
                  <AlertCircle size={20} />
                  <span className="text-sm">Could not load heatmap data</span>
                </div>
              ) : filteredRepos.length === 0 ? (
                <p className="text-[#555555] text-sm text-center py-8">No repositories match your filters.</p>
              ) : (
                <>
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))' }}>
                    {filteredRepos.slice(0, 120).map((repo) => (
                      <Link
                        key={repo.repository}
                        href={`/repo/${repo.repository.split('/')[0]}/${repo.repository.split('/')[1]}`}
                      >
                        <div
                          className={`w-6 h-6 rounded cursor-pointer hover:ring-2 hover:ring-[#00ff00] transition-all ${getActivityColor(repo.activityScore)}`}
                          title={`${repo.repository}: ${repo.activityScore}% activity | ${repo.status}`}
                        />
                      </Link>
                    ))}
                  </div>
                  <p className="text-[#555555] text-xs mt-4">
                    Showing first {Math.min(120, filteredRepos.length)} of {filteredRepos.length} repositories.
                    {filteredRepos.length > 120 && ' Use filters or search to narrow results.'}
                  </p>
                </>
              )}
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
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Repository</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Ecosystem</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Language</th>
                    <th className="px-6 py-4 text-left text-[#888888] font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">Activity (TSS)</th>
                    <th className="px-6 py-4 text-right text-[#888888] font-semibold text-sm">Last Scan</th>
                    <th className="px-6 py-4 text-center text-[#888888] font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <tr key={i} className="border-b border-[#1a1a1a]">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <SkeletonCell />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <AlertCircle size={28} className="text-[#ff3333]" />
                          <p className="text-[#ff3333] text-sm">{error}</p>
                          <button
                            onClick={fetchRepos}
                            className="px-4 py-2 bg-[#00ff00] text-black rounded-lg text-sm font-bold hover:bg-[#00ff00]/90 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRepos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#555555] text-sm">
                        No repositories match your current filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedRepos.map((repo) => {
                      const [owner, repoName] = repo.repository.split('/');
                      return (
                        <tr
                          key={repo.repository}
                          className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-white font-medium font-mono text-sm">{repo.repository}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#888888] text-sm">{repo.ecosystem}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#888888] text-sm">{repo.language}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={
                              repo.status === 'Active'
                                ? 'badge-active'
                                : repo.status === 'Resolved'
                                  ? 'badge-inactive'
                                  : 'badge-warning'
                            }>
                              {repo.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-[#1a1a1a] rounded h-2">
                                <div
                                  className={`h-full rounded ${getActivityBarColor(repo.activityScore)}`}
                                  style={{ width: `${repo.activityScore}%` }}
                                />
                              </div>
                              <span className="text-[#888888] text-xs w-8 text-right tabular-nums">
                                {repo.activityScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[#888888] text-sm">{formatLastScan(repo.lastScan)}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              href={`/repo/${owner}/${repoName}`}
                              className="text-[#00ff00] hover:underline text-sm font-semibold"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-[#000000] border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888] text-sm">
                  {loading
                    ? 'Loading...'
                    : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRepos.length)}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredRepos.length)} of ${filteredRepos.length} repositories`
                  }
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 border border-[#1a1a1a] rounded text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00] transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-[#555555] text-sm px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-2 border border-[#1a1a1a] rounded text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00] transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empty state when DB has no data yet */}
        {!loading && !error && repos.length === 0 && (
          <section className="px-8 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-12 text-center">
                <p className="text-[#555555] text-sm mb-2">No repository data found in the database yet.</p>
                <p className="text-[#333333] text-xs">
                  The scout agent needs to run at least one cycle and PRs must have a{' '}
                  <code className="font-mono text-[#444444]">repoName</code> field saved to the{' '}
                  <code className="font-mono text-[#444444]">DeployedPR</code> table.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="h-12" />
      </div>
    </DashboardLayout>
  );
}