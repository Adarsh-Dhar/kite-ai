'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Play, Pause, Filter, Copy } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Mock log entries
const initialLogs = [
  { id: 1, time: '13:42:15', type: 'COMMIT', repo: 'ethereum/go-ethereum', message: 'Merged PR #4521 - Improve hashing algorithm', status: 'SUCCESS' },
  { id: 2, time: '13:41:42', type: 'SCAN', repo: 'solana/solana', message: 'Deep scan completed', status: 'SUCCESS' },
  { id: 3, time: '13:40:28', type: 'RELEASE', repo: 'bitcoin/bitcoin', message: 'Version 28.0 released', status: 'SUCCESS' },
  { id: 4, time: '13:39:55', type: 'ALERT', repo: 'uniswap/v4-core', message: 'Unusual gas spike detected', status: 'WARNING' },
  { id: 5, time: '13:38:12', type: 'COMMIT', repo: 'polygon/contracts', message: 'Bug fix: validator consensus', status: 'SUCCESS' },
  { id: 6, time: '13:37:33', type: 'PR', repo: 'arbitrum/stylus', message: 'Pull request opened #892', status: 'INFO' },
  { id: 7, time: '13:36:04', type: 'ISSUE', repo: 'optimism/optimism', message: 'Performance regression reported', status: 'WARNING' },
  { id: 8, time: '13:34:51', type: 'SCAN', repo: 'ethereum/execution-specs', message: 'Deep scan in progress...', status: 'INFO' },
  { id: 9, time: '13:33:22', type: 'COMMIT', repo: 'lido/lido-dao', message: 'Treasury management update', status: 'SUCCESS' },
  { id: 10, time: '13:31:45', type: 'ALERT', repo: 'makerdao/dss', message: 'Liquidation threshold breached', status: 'ERROR' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'text-[#00ff00]';
    case 'WARNING':
      return 'text-[#ffcc00]';
    case 'ERROR':
      return 'text-[#ff3333]';
    default:
      return 'text-[#888888]';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-[#00ff00]/10';
    case 'WARNING':
      return 'bg-[#ffcc00]/10';
    case 'ERROR':
      return 'bg-[#ff3333]/10';
    default:
      return 'bg-[#1a1a1a]';
  }
};

export default function TerminalPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [isRunning, setIsRunning] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'All',
    repository: 'All',
    status: 'All',
  });
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when logs update
  useEffect(() => {
    if (isRunning && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isRunning]);

  // Simulate real-time logs
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newLog = {
        id: Math.max(...logs.map(l => l.id)) + 1,
        time: new Date().toLocaleTimeString(),
        type: ['COMMIT', 'SCAN', 'RELEASE', 'ALERT', 'PR', 'ISSUE'][Math.floor(Math.random() * 6)],
        repo: ['ethereum/go-ethereum', 'solana/solana', 'bitcoin/bitcoin', 'uniswap/v4-core', 'polygon/contracts', 'arbitrum/stylus'][Math.floor(Math.random() * 6)],
        message: ['Merged PR', 'Deep scan completed', 'Version released', 'Unusual spike detected', 'Pull request opened', 'Bug detected'][Math.floor(Math.random() * 6)],
        status: ['SUCCESS', 'WARNING', 'ERROR', 'INFO', 'SUCCESS'][Math.floor(Math.random() * 5)],
      };
      setLogs((prev) => [...prev.slice(-99), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, logs]);

  const filteredLogs = logs.filter((log) => {
    const matchesType = filters.eventType === 'All' || log.type === filters.eventType;
    const matchesRepo = filters.repository === 'All' || log.repo === filters.repository;
    const matchesStatus = filters.status === 'All' || log.status === filters.status;
    return matchesType && matchesRepo && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <section className="border-b border-[#1a1a1a] px-8 py-6 bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">The Raw Feed</h1>
                <p className="text-[#888888]">
                  Real-time GitHub event stream from monitored repositories
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Real-time Indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
                  <span className="text-[#00ff00] text-sm font-semibold">
                    {isRunning ? 'Live' : 'Paused'}
                  </span>
                </div>

                {/* Play/Pause */}
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg hover:text-[#00ff00] hover:border-[#00ff00] transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Pause size={18} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg hover:text-[#00ff00] hover:border-[#00ff00] transition-colors"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#888888] text-xs font-semibold mb-2">
                    Event Type
                  </label>
                  <select
                    value={filters.eventType}
                    onChange={(e) =>
                      setFilters({ ...filters, eventType: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-[#888888] text-sm focus:border-[#00ff00] focus:outline-none"
                  >
                    <option>All</option>
                    <option>COMMIT</option>
                    <option>SCAN</option>
                    <option>RELEASE</option>
                    <option>ALERT</option>
                    <option>PR</option>
                    <option>ISSUE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] text-xs font-semibold mb-2">
                    Repository
                  </label>
                  <select
                    value={filters.repository}
                    onChange={(e) =>
                      setFilters({ ...filters, repository: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-[#888888] text-sm focus:border-[#00ff00] focus:outline-none"
                  >
                    <option>All</option>
                    <option>ethereum/go-ethereum</option>
                    <option>solana/solana</option>
                    <option>bitcoin/bitcoin</option>
                    <option>uniswap/v4-core</option>
                    <option>polygon/contracts</option>
                    <option>arbitrum/stylus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] text-xs font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-[#888888] text-sm focus:border-[#00ff00] focus:outline-none"
                  >
                    <option>All</option>
                    <option>SUCCESS</option>
                    <option>WARNING</option>
                    <option>ERROR</option>
                    <option>INFO</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Terminal Stream */}
        <section className="flex-1 overflow-auto px-8 py-6">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 h-full flex flex-col font-mono text-sm">
              {/* Log Entries */}
              <div className="flex-1 overflow-y-auto space-y-1 mb-4">
                {filteredLogs.map((log) => (
                  <div key={log.id}>
                    {/* Log Entry Row */}
                    <div
                      onClick={() =>
                        setExpandedLog(expandedLog === log.id ? null : log.id)
                      }
                      className={`p-3 rounded cursor-pointer hover:bg-[#1a1a1a] transition-colors ${getStatusBg(log.status)}`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-[#888888] w-12">[{log.time}]</span>
                        <span className={`w-10 font-bold text-xs ${getStatusColor(log.status)}`}>
                          {log.status === 'SUCCESS' ? '✓' : log.status === 'WARNING' ? '⚠' : log.status === 'ERROR' ? '✗' : '→'} {log.type}
                        </span>
                        <span className="text-[#00ff00] flex-1 truncate">
                          {log.repo}
                        </span>
                        <span className="text-[#888888]">{log.message}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedLog === log.id && (
                      <div className="ml-4 mt-2 p-4 bg-[#1a1a1a] border-l-2 border-[#00ff00] text-[#888888] text-xs">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-[#00ff00]">Repository:</span> {log.repo}
                          </div>
                          <div>
                            <span className="text-[#00ff00]">Timestamp:</span> {log.time}
                          </div>
                          <div>
                            <span className="text-[#00ff00]">Event Type:</span> {log.type}
                          </div>
                          <div>
                            <span className="text-[#00ff00]">Status:</span> {log.status}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#00ff00]">Message:</span> {log.message}
                        </div>
                        <div className="mt-3 p-2 bg-[#0a0a0a] rounded text-xs space-y-1">
                          <div>
                            <span className="text-[#888888]">TX Hash:</span>{' '}
                            <span className="text-[#00ff00]">
                              0x{Math.random().toString(16).slice(2, 18)}...
                            </span>
                          </div>
                          <div>
                            <span className="text-[#888888]">Confirmation:</span>{' '}
                            <span className="text-[#00ff00]">{Math.floor(Math.random() * 1000) + 100}+</span>
                          </div>
                          <button className="mt-2 flex items-center gap-2 px-2 py-1 bg-[#1a1a1a] hover:bg-[#333333] rounded text-[#00ff00] transition-colors">
                            <Copy size={12} />
                            Copy Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              {/* Footer Info */}
              <div className="border-t border-[#1a1a1a] pt-3 flex items-center justify-between text-xs text-[#888888]">
                <span>Total entries: {filteredLogs.length}</span>
                <span>Showing live stream • Scroll to bottom for latest</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
