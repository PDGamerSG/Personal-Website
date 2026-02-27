import { Keyboard, Flame, Zap, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface TypingResult {
  wpm: number
  timestamp: number
  mode: string
  mode2: string
}

interface PersonalBestEntry {
  wpm: number
  acc: number
  consistency: number
  timestamp: number
}

interface MonkeyTypeProfile {
  name: string
  personalBests?: {
    time?: Record<string, PersonalBestEntry[]>
  }
  typingStats?: {
    completedTests: number
    timeTyping: number
  }
  streak?: {
    length: number
    maxLength: number
  }
}

const MT_USERNAME = 'PDGamerSG'

async function fetchProfile(): Promise<MonkeyTypeProfile | null> {
  try {
    const res = await fetch(`https://api.monkeytype.com/users/${MT_USERNAME}/profile`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return (await res.json()).data as MonkeyTypeProfile
  } catch {
    return null
  }
}

async function fetchResults(): Promise<TypingResult[]> {
  const apiKey = process.env.MONKEYTYPE_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch('https://api.monkeytype.com/results?limit=1000', {
      headers: { Authorization: `ApeKey ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data) ? (json.data as TypingResult[]) : []
  } catch {
    return []
  }
}

function getBestWpm(entries?: PersonalBestEntry[]): number | null {
  if (!entries?.length) return null
  return Math.round(Math.max(...entries.map((e) => e.wpm)))
}

function TypingHeatmap({ results }: { results: TypingResult[] }) {
  // Build day map: YYYY-MM-DD -> { count, maxWpm }
  const dayMap = new Map<string, { count: number; maxWpm: number }>()
  for (const r of results) {
    const key = new Date(r.timestamp).toISOString().split('T')[0]
    const prev = dayMap.get(key) ?? { count: 0, maxWpm: 0 }
    dayMap.set(key, { count: prev.count + 1, maxWpm: Math.max(prev.maxWpm, Math.round(r.wpm)) })
  }

  // Always start from week of Sept 6 2025 (the user's start date)
  const startSun = new Date('2025-08-31') // Sunday before Sept 6, 2025
  startSun.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const endSat = new Date(today)
  endSat.setDate(today.getDate() + (6 - today.getDay()))

  type Cell = { key: string; date: Date; count: number; maxWpm: number } | null
  const weeks: Cell[][] = []
  const cursor = new Date(startSun)

  while (cursor <= endSat) {
    const week: Cell[] = []
    for (let d = 0; d < 7; d++) {
      const isFuture = cursor > today
      const key = cursor.toISOString().split('T')[0]
      week.push(
        isFuture
          ? null
          : { key, date: new Date(cursor), ...(dayMap.get(key) ?? { count: 0, maxWpm: 0 }) }
      )
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month labels: show label when first day of a new month appears
  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const first = week.find((c) => c !== null)
    if (first && first.date.getMonth() !== lastMonth) {
      lastMonth = first.date.getMonth()
      monthLabels.push({
        label: first.date.toLocaleString('en-US', { month: 'short' }),
        col: wi,
      })
    }
  })

  const CELL = 15
  const GAP  = 5
  const STEP = CELL + GAP
  const DAY_LABEL_W = 20
  const W = DAY_LABEL_W + weeks.length * STEP - GAP
  const H = 7 * STEP - GAP

  const COLORS = [
    'rgba(128,128,128,0.13)', // no activity
    '#bbf7d0',                // 1–2 tests
    '#4ade80',                // 3–5 tests
    '#16a34a',                // 6+ tests
  ]

  // Only show Mon, Wed, Fri labels (indices 1, 3, 5)
  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="flex justify-center">
      <svg
        width={W}
        height={H + 20 + 22}
        viewBox={`0 0 ${W} ${H + 20 + 22}`}
        aria-label="Typing activity heatmap"
        style={{ maxWidth: '100%', fontFamily: 'inherit', display: 'block' }}
      >
        {/* Month labels row */}
        {monthLabels.map(({ label, col }, i) => {
          // Skip if too close to previous label
          const prev = monthLabels[i - 1]
          if (prev && col - prev.col < 3) return null
          return (
            <text
              key={`${label}-${col}`}
              x={DAY_LABEL_W + col * STEP}
              y={11}
              fontSize={9}
              style={{ fill: 'hsl(var(--muted-foreground))' }}
            >
              {label}
            </text>
          )
        })}

        {/* Day-of-week labels */}
        {DAY_LABELS.map((label, di) =>
          label ? (
            <text
              key={label}
              x={0}
              y={20 + di * STEP + CELL - 1}
              fontSize={9}
              style={{ fill: 'hsl(var(--muted-foreground))' }}
            >
              {label}
            </text>
          ) : null
        )}

        {/* Grid */}
        <g transform={`translate(${DAY_LABEL_W}, 16)`}>
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              if (!cell) {
                return (
                  <rect
                    key={`f-${wi}-${di}`}
                    x={wi * STEP} y={di * STEP}
                    width={CELL} height={CELL} rx={2}
                    style={{ fill: 'rgba(128,128,128,0.06)' }}
                  />
                )
              }
              const level =
                cell.count === 0 ? 0
                : cell.count <= 2 ? 1
                : cell.count <= 5 ? 2
                : 3
              const dateStr = cell.date.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })
              const tooltip =
                cell.count === 0
                  ? `${dateStr} — no tests`
                  : `${dateStr} — best ${cell.maxWpm} WPM · ${cell.count} test${cell.count > 1 ? 's' : ''}`
              return (
                <rect
                  key={cell.key}
                  x={wi * STEP} y={di * STEP}
                  width={CELL} height={CELL} rx={2}
                  style={{ fill: COLORS[level] }}
                >
                  <title>{tooltip}</title>
                </rect>
              )
            })
          )}
        </g>
      </svg>
    </div>
  )
}

export async function MonkeyTypeStats() {
  const [profile, results] = await Promise.all([fetchProfile(), fetchResults()])
  const modes = ['15', '30', '60', '120'] as const

  if (!profile) {
    return (
      <section className="mb-14">
        <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Daily Habit</p>
            <h2 className="text-2xl font-bold text-foreground">Typing Practice</h2>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-border/50 bg-card/50 p-6 text-center">
          <Keyboard className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Could not load typing stats — profile may be private.</p>
        </div>
      </section>
    )
  }

  const wpmStats = modes
    .map((m) => ({ mode: `${m}s`, wpm: getBestWpm(profile.personalBests?.time?.[m]) }))
    .filter((s) => s.wpm !== null)

  const overallBest = wpmStats.length ? Math.max(...wpmStats.map((s) => s.wpm as number)) : null
  const streak = profile.streak?.length ?? 0
  const maxStreak = profile.streak?.maxLength ?? 0

  // Fixed date range from Sept 6, 2025
  const rangeLabel = 'Sep 2025 → today'

  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Daily Habit</p>
          <h2 className="text-2xl font-bold text-foreground">Typing Practice</h2>
        </div>
        <Link
          href={`https://monkeytype.com/profile/${MT_USERNAME}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Keyboard className="h-3.5 w-3.5" />
          {profile.name}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Link>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {/* Top stats banner */}
        <div className="flex flex-wrap gap-px border-b border-border/40">
          {overallBest !== null && (
            <div className="flex flex-1 min-w-[120px] flex-col items-center gap-0.5 bg-background/30 px-5 py-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Best WPM</span>
              </div>
              <span className="text-3xl font-bold text-foreground tabular-nums">{overallBest}</span>
            </div>
          )}
          {streak > 0 && (
            <div className="flex flex-1 min-w-[120px] flex-col items-center gap-0.5 bg-background/30 px-5 py-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Streak</span>
              </div>
              <span className="text-3xl font-bold text-foreground tabular-nums">{streak}</span>
              {maxStreak > streak && (
                <span className="text-[11px] text-muted-foreground">best {maxStreak}</span>
              )}
            </div>
          )}
          {wpmStats.map(({ mode, wpm }) => (
            <div key={mode} className="flex flex-1 min-w-[70px] flex-col items-center gap-0.5 bg-background/30 px-4 py-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{mode}</span>
              <span className="text-2xl font-bold text-foreground tabular-nums">{wpm}</span>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Consistency
            </p>
            <p className="text-[11px] text-muted-foreground/60">{rangeLabel}</p>
          </div>
          <TypingHeatmap results={results} />
          {results.length === 0 && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
              Add <code className="font-mono">MONKEYTYPE_API_KEY</code> to <code className="font-mono">.env.local</code> to fill in the heatmap
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
