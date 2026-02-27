import { Star, Users, Code2, GitFork } from 'lucide-react'
import Link from 'next/link'

interface GitHubUser {
  public_repos: number
  followers: number
  following: number
}

interface GitHubRepo {
  stargazers_count: number
  fork: boolean
}

interface ContributionDay {
  date: string
  count: number
}

interface ContributionsResponse {
  contributions: ContributionDay[]
}

function GithubHeatmap({ contributions }: { contributions: ContributionDay[] }) {
  const dayMap = new Map<string, number>()
  for (const d of contributions) dayMap.set(d.date, d.count)

  const anchor = new Date('2025-07-01')
  anchor.setHours(0, 0, 0, 0)
  const startSun = new Date(anchor)
  startSun.setDate(anchor.getDate() - anchor.getDay())

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const endSat = new Date(today)
  endSat.setDate(today.getDate() + (6 - today.getDay()))

  type Cell = { key: string; date: Date; count: number } | null
  const weeks: Cell[][] = []
  const cursor = new Date(startSun)

  while (cursor <= endSat) {
    const week: Cell[] = []
    for (let d = 0; d < 7; d++) {
      const isFuture = cursor > today
      const key = cursor.toISOString().split('T')[0]
      week.push(isFuture ? null : { key, date: new Date(cursor), count: dayMap.get(key) ?? 0 })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const first = week.find((c) => c !== null)
    if (first && first.date.getMonth() !== lastMonth) {
      lastMonth = first.date.getMonth()
      monthLabels.push({ label: first.date.toLocaleString('en-US', { month: 'short' }), col: wi })
    }
  })

  const CELL = 15
  const GAP  = 5
  const STEP = CELL + GAP
  const DAY_LABEL_W = 20
  const W = DAY_LABEL_W + weeks.length * STEP - GAP
  const H = 7 * STEP - GAP
  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  const COLORS = ['rgba(128,128,128,0.13)', '#bbf7d0', '#4ade80', '#16a34a', '#166534']
  function color(count: number) {
    if (count === 0) return COLORS[0]
    if (count <= 3)  return COLORS[1]
    if (count <= 6)  return COLORS[2]
    if (count <= 9)  return COLORS[3]
    return COLORS[4]
  }

  return (
    <div className="flex justify-center">
      <svg
        width={W} height={H + 20 + 22}
        viewBox={`0 0 ${W} ${H + 20 + 22}`}
        aria-label="GitHub contribution heatmap"
        style={{ maxWidth: '100%', fontFamily: 'inherit', display: 'block' }}
      >
        {monthLabels.map(({ label, col }, i) => {
          const prev = monthLabels[i - 1]
          if (prev && col - prev.col < 3) return null
          return (
            <text key={`${label}-${col}`} x={DAY_LABEL_W + col * STEP} y={11}
              fontSize={9} style={{ fill: 'hsl(var(--muted-foreground))' }}>
              {label}
            </text>
          )
        })}
        {DAY_LABELS.map((label, di) =>
          label ? (
            <text key={label} x={0} y={20 + di * STEP + CELL - 1}
              fontSize={9} style={{ fill: 'hsl(var(--muted-foreground))' }}>
              {label}
            </text>
          ) : null
        )}
        <g transform={`translate(${DAY_LABEL_W}, 16)`}>
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              if (!cell) return (
                <rect key={`f-${wi}-${di}`} x={wi * STEP} y={di * STEP}
                  width={CELL} height={CELL} rx={2} style={{ fill: 'rgba(128,128,128,0.06)' }} />
              )
              const dateStr = cell.date.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })
              const tooltip = cell.count === 0
                ? `${dateStr} -- no contributions`
                : `${dateStr} -- ${cell.count} contribution${cell.count > 1 ? 's' : ''}`
              return (
                <rect key={cell.key} x={wi * STEP} y={di * STEP}
                  width={CELL} height={CELL} rx={2} style={{ fill: color(cell.count) }}>
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

export async function GitHubStats() {
  try {
    const [userRes, reposRes, contribRes] = await Promise.all([
      fetch('https://api.github.com/users/PDGamerSG', {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch('https://api.github.com/users/PDGamerSG/repos?per_page=100', {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch('https://github-contributions-api.jogruber.de/v4/PDGamerSG?y=last', {
        next: { revalidate: 3600 },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) return null

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()
    const contribData: ContributionsResponse | null = contribRes.ok ? await contribRes.json() : null

    if (!Array.isArray(repos)) return null

    const ownRepos = repos.filter((r) => !r.fork)
    const totalStars = ownRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)

    const stats = [
      { label: 'Repos',     value: user.public_repos, icon: Code2   },
      { label: 'Stars',     value: totalStars,         icon: Star    },
      { label: 'Followers', value: user.followers,     icon: Users   },
      { label: 'Following', value: user.following,     icon: GitFork },
    ]

    const contributions = contribData?.contributions ?? []

    return (
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex flex-wrap gap-px border-b border-border/40">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label}
              className="flex flex-1 min-w-[80px] flex-col items-center gap-0.5 bg-background/30 px-4 py-4">
              <Icon className="mb-1 h-3.5 w-3.5 text-primary" />
              <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contributions</p>
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground/60">Jul 2025 -- today</p>
              <Link href="https://github.com/PDGamerSG" target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground transition-colors hover:text-foreground">
                GitHub →
              </Link>
            </div>
          </div>
          <GithubHeatmap contributions={contributions} />
        </div>
      </div>
    )
  } catch {
    return null
  }
}
