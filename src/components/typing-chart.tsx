'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'

export interface TypingResult {
  wpm: number
  rawWpm?: number
  acc: number
  consistency?: number
  timestamp: number
  mode: string
  mode2: string
}

interface ChartPoint {
  index: number
  wpm: number
  rawWpm?: number
  acc: number
  consistency?: number
  date: string
  dateShort: string
  mode: string
  mode2: string
}

const MODE_COLORS: Record<string, string> = {
  '15': '#f59e0b',
  '30': '#10b981',
  '60': '#6366f1',
  '120': '#ec4899',
  all: '#6366f1',
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartPoint }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as ChartPoint

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-xl text-sm space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-foreground tabular-nums text-base">{d.wpm} WPM</p>
      {d.rawWpm != null && (
        <p className="text-muted-foreground">
          Raw: <span className="text-foreground font-medium">{Math.round(d.rawWpm)}</span>
        </p>
      )}
      <p className="text-muted-foreground">
        Accuracy: <span className="text-emerald-500 font-medium">{d.acc.toFixed(1)}%</span>
      </p>
      {d.consistency != null && (
        <p className="text-muted-foreground">
          Consistency: <span className="text-primary font-medium">{d.consistency.toFixed(1)}%</span>
        </p>
      )}
      <p className="text-muted-foreground">
        Mode: <span className="text-foreground font-medium">{d.mode} {d.mode2}s</span>
      </p>
      <p className="text-xs text-muted-foreground/70 pt-0.5 border-t border-border/40">{d.date}</p>
    </div>
  )
}

const FILTERS = ['All', '15s', '30s', '60s', '120s'] as const
type Filter = typeof FILTERS[number]

interface Props {
  results: TypingResult[]
  avgWpm?: number
}

export function TypingChart({ results, avgWpm }: Props) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(() => {
    const mode2 = filter === 'All' ? null : filter.replace('s', '')
    const base = mode2
      ? results.filter((r) => r.mode === 'time' && r.mode2 === mode2)
      : results
    return base
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-80) // show last 80 tests
      .map((r, i): ChartPoint => ({
        index: i,
        wpm: Math.round(r.wpm),
        rawWpm: r.rawWpm != null ? r.rawWpm : undefined,
        acc: r.acc,
        consistency: r.consistency,
        date: new Date(r.timestamp).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
        dateShort: new Date(r.timestamp).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        }),
        mode: r.mode,
        mode2: r.mode2,
      }))
  }, [results, filter])

  const avg = useMemo(() => {
    if (!filtered.length) return null
    return Math.round(filtered.reduce((s, r) => s + r.wpm, 0) / filtered.length)
  }, [filtered])

  const lineColor = filter === 'All' ? MODE_COLORS['all'] : MODE_COLORS[filter.replace('s', '')] ?? MODE_COLORS['all']

  if (!filtered.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No tests found for this filter.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
        {avg != null && (
          <span className="ml-auto text-xs text-muted-foreground self-center">
            avg <span className="font-semibold text-foreground">{avg} WPM</span>
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
            <XAxis
              dataKey="dateShort"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            {avg != null && (
              <ReferenceLine
                y={avg}
                stroke={lineColor}
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
            )}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: lineColor, strokeWidth: 1, strokeOpacity: 0.4 }} />
            <Line
              type="monotone"
              dataKey="wpm"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: lineColor, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-muted-foreground/60 text-right">
        Last {filtered.length} tests · hover for details
      </p>
    </div>
  )
}
