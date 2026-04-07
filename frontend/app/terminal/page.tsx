'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Terminal as TerminalIcon, Play, Pause, Filter, Copy, X, Eye } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedLog {
  id: number
  raw: string
  level: 'INFO' | 'ERROR' | 'WARNING' | 'DEBUG' | 'SYSTEM'
  time: string
  name: string
  message: string
}

// ── Log parsing helpers ───────────────────────────────────────────────────────

function detectLevel(raw: string): ParsedLog['level'] {
  if (raw.includes(' ERROR ') || raw.includes('ERROR:')) return 'ERROR'
  if (raw.includes(' WARNING ') || raw.includes('WARNING:')) return 'WARNING'
  if (raw.includes(' DEBUG ') || raw.includes('DEBUG:')) return 'DEBUG'
  if (raw.includes(' INFO ') || raw.includes('INFO:')) return 'INFO'
  return 'SYSTEM'
}

const LEVEL_COLOR: Record<ParsedLog['level'], string> = {
  INFO:    'text-blue-400',
  ERROR:   'text-red-500',
  WARNING: 'text-yellow-400',
  DEBUG:   'text-[#555555]',
  SYSTEM:  'text-[#00ff00]',
}

const LEVEL_BADGE: Record<ParsedLog['level'], string> = {
  INFO:    'bg-blue-400/10 text-blue-400 border border-blue-400/20',
  ERROR:   'bg-red-500/10 text-red-500 border border-red-500/20',
  WARNING: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  DEBUG:   'bg-[#333]/40 text-[#555] border border-[#333]/20',
  SYSTEM:  'bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/20',
}

let _idSeq = 0
function parseLog(raw: string): ParsedLog {
  const level = detectLevel(raw)
  // Try to extract time and logger name from the standard formatter
  // Format: [HH:MM:SS] [logger_name] LEVEL: message
  const match = raw.match(/^\[?(\d{2}:\d{2}:\d{2})\]?\s+\[?([^\]]+)\]?\s+\w+:\s*(.*)$/)
  // For system/initial logs, use a fixed time string to avoid hydration mismatch
  function getDeterministicTimeString() {
    // If it's a system message (not matching the log format), use '--:--:--'
    return '--:--:--';
  }
  return {
    id: ++_idSeq,
    raw,
    level,
    time: match?.[1] ?? getDeterministicTimeString(),
    name: match?.[2]?.trim() ?? 'agent',
    message: match?.[3]?.trim() ?? raw,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const FILTER_LEVELS: Array<ParsedLog['level'] | 'ALL'> = [
  'ALL', 'INFO', 'WARNING', 'ERROR', 'DEBUG',
]

export default function TerminalPage() {
  const searchParams = useSearchParams()
  const sessionParam = searchParams?.get('session')
  
  const [logs, setLogs] = useState<ParsedLog[]>([
    parseLog('[system] Initializing KiteAI Agent Terminal…'),
    parseLog('[system] Connecting to backend server…'),
  ])
  const [connected, setConnected] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [levelFilter, setLevelFilter] = useState<ParsedLog['level'] | 'ALL'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSession, setCurrentSession] = useState<string | null>(sessionParam || null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const wsRef = useRef<WebSocket | null>(null)
  const bufferRef = useRef<ParsedLog[]>([])

  // Keep pausedRef in sync
  useEffect(() => { pausedRef.current = paused }, [paused])

  // ── WebSocket connection ──────────────────────────────────────────────────
  useEffect(() => {
    let ws: WebSocket
    let reconnectTimer: ReturnType<typeof setTimeout>

    function connect() {
      // Build WebSocket URL with session filter if provided
      const baseWsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
        process.env.NEXT_PUBLIC_BACKEND_HOST ?? 'localhost:8000'
      }/ws/logs`
      
      const wsUrl = currentSession 
        ? `${baseWsUrl}?session=${encodeURIComponent(currentSession)}`
        : baseWsUrl
        
      ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        const sessionMsg = currentSession 
          ? `Listening for logs from session: ${currentSession}`
          : 'Listening for all agent activity…'
        setLogs((prev) => [
          ...prev,
          parseLog(`[system] INFO: Connection established. ${sessionMsg}`),
        ])
      }

      ws.onmessage = (event: MessageEvent) => {
        const parsed = parseLog(event.data as string)

        if (pausedRef.current) {
          // Buffer up to 200 messages while paused
          bufferRef.current = [...bufferRef.current, parsed].slice(-200)
          return
        }

        setLogs((prev) => {
          const next = [...prev, parsed]
          return next.length > 500 ? next.slice(next.length - 500) : next
        })
      }

      ws.onclose = () => {
        setConnected(false)
        setLogs((prev) => [
          ...prev,
          parseLog('[system] WARNING: Connection lost. Reconnecting in 5s…'),
        ])
        reconnectTimer = setTimeout(connect, 5000)
      }

      ws.onerror = () => {
        setLogs((prev) => [
          ...prev,
          parseLog('[system] ERROR: WebSocket error — see browser console for details.'),
        ])
      }
    }

    connect()
    return () => {
      clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [currentSession])

  // ── Flush buffer when unpausing ───────────────────────────────────────────
  useEffect(() => {
    if (!paused && bufferRef.current.length > 0) {
      setLogs((prev) => {
        const next = [...prev, ...bufferRef.current]
        bufferRef.current = []
        return next.length > 500 ? next.slice(next.length - 500) : next
      })
    }
  }, [paused])

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, paused])

  // ── Filtered view ─────────────────────────────────────────────────────────
  const visible = logs.filter((log) => {
    if (levelFilter !== 'ALL' && log.level !== levelFilter) return false
    if (searchTerm && !log.raw.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  function copyAll() {
    const text = visible.map((l) => l.raw).join('\n')
    navigator.clipboard.writeText(text).catch(console.error)
  }

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col">

        {/* ── Header ── */}
        <section className="border-b border-[#1a1a1a] px-8 py-6 bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">The Raw Feed</h1>
                <p className="text-[#888888]">
                  Live agent log stream from <span className="text-[#00ff00] font-mono">ws/logs</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Connection indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connected ? 'bg-[#00ff00] animate-pulse' : 'bg-[#ff3333]'
                    }`}
                  />
                  <span className={`text-sm font-semibold ${connected ? 'text-[#00ff00]' : 'text-[#ff3333]'}`}>
                    {connected ? (paused ? 'Paused' : 'Live') : 'Disconnected'}
                  </span>
                </div>

                {/* Pause / Resume */}
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg hover:text-[#00ff00] hover:border-[#00ff00] transition-colors"
                >
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                  <span>{paused ? 'Resume' : 'Pause'}</span>
                  {paused && bufferRef.current.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-[#ffcc00]/20 text-[#ffcc00] text-xs rounded">
                      +{bufferRef.current.length}
                    </span>
                  )}
                </button>

                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters((s) => !s)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${
                    showFilters
                      ? 'bg-[#1a1a1a] border-[#00ff00] text-[#00ff00]'
                      : 'bg-[#1a1a1a] border-[#333333] text-[#888888] hover:border-[#00ff00] hover:text-[#00ff00]'
                  }`}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

                {/* Copy all */}
                <button
                  onClick={copyAll}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#888888] rounded-lg hover:text-[#00ff00] hover:border-[#00ff00] transition-colors text-sm"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* Session indicator */}
            {currentSession && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-[#1a1a1a]/50 border border-[#00ff00]/20 rounded-lg">
                <Eye size={16} className="text-[#00ff00]" />
                <div className="flex-1">
                  <p className="text-[#00ff00] text-sm font-semibold">Watching Draft Generation</p>
                  <p className="text-[#666666] text-xs font-mono mt-0.5">{currentSession}</p>
                </div>
                <button
                  onClick={() => setCurrentSession(null)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#888888] hover:text-[#ff3333] hover:bg-[#ff3333]/10 border border-[#333333] hover:border-[#ff3333] rounded transition-colors"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            )}

            {/* ── Filter panel ── */}
            {showFilters && (
              <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg flex flex-col sm:flex-row gap-4">
                {/* Level tabs */}
                <div className="flex gap-1 bg-[#111] border border-[#1a1a1a] rounded-lg p-1">
                  {FILTER_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all ${
                        levelFilter === lvl
                          ? 'bg-[#00ff00] text-black'
                          : 'text-[#555] hover:text-[#888]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search logs…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-[#111] border border-[#1a1a1a] rounded-lg px-4 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#00ff00]/50"
                />

                <span className="text-[#333] text-xs font-mono self-center whitespace-nowrap">
                  {visible.length} / {logs.length} entries
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── Terminal stream ── */}
        <section className="flex-1 overflow-hidden px-8 py-6">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg h-full flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,255,0,0.05)]">

              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#050505]">
                <TerminalIcon size={14} className="text-[#00ff00]" />
                <span className="text-[#00ff00] text-xs font-mono tracking-widest uppercase">
                  Agent Command Center
                </span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500/80 animate-pulse' : 'bg-[#333]'}`} />
                </div>
              </div>

              {/* Log lines */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5"
              >
                {visible.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 py-0.5 px-2 rounded hover:bg-white/[0.02] group"
                  >
                    {/* Time */}
                    <span className="text-[#444] shrink-0 text-xs leading-5 pt-px">
                      {log.time}
                    </span>

                    {/* Level badge */}
                    <span
                      className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${LEVEL_BADGE[log.level]}`}
                    >
                      {log.level}
                    </span>

                    {/* Logger name */}
                    <span className="text-[#00ff00] shrink-0 text-xs leading-5 pt-px max-w-[120px] truncate">
                      {log.name}
                    </span>

                    {/* Message */}
                    <span className={`flex-1 break-all leading-5 ${LEVEL_COLOR[log.level]}`}>
                      {log.message}
                    </span>

                    {/* Copy single line */}
                    <button
                      onClick={() => navigator.clipboard.writeText(log.raw)}
                      className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-[#00ff00] transition-all shrink-0"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ))}

                {visible.length === 0 && (
                  <div className="text-[#333] text-sm text-center py-12">
                    {logs.length === 0
                      ? 'Waiting for agent activity…'
                      : 'No logs match your filters.'}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#1a1a1a] px-4 py-2 bg-[#050505] flex items-center justify-between text-xs text-[#444] font-mono">
                <span>{visible.length} entries shown</span>
                <span>
                  {connected
                    ? paused
                      ? `⏸ paused — ${bufferRef.current.length} buffered`
                      : '● streaming live'
                    : '○ disconnected'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}