import Link from 'next/link'
import { Flame, Keyboard, Github, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MonkeyTypeProfile {
  streak?: number
  personalBests?: {
    time?: Record<string, { wpm: number }[]>
  }
}

interface ContributionsResponse {
  contributions: { date: string; count: number }[]
}

async function getMonkeyType(): Promise<{ streak: number; bestWpm: number } | null> {
  try {
    const res = await fetch('https://api.monkeytype.com/users/PDGamerSG/profile', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const profile = (await res.json()).data as MonkeyTypeProfile
    const allTimeBests = Object.values(profile.personalBests?.time ?? {}).flat()
    const bestWpm = allTimeBests.length
      ? Math.round(Math.max(...allTimeBests.map((e) => e.wpm)))
      : 0
    return { streak: profile.streak ?? 0, bestWpm }
  } catch {
    return null
  }
}

async function getContributions(): Promise<number | null> {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/PDGamerSG?y=last', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as ContributionsResponse
    return data.contributions.reduce((acc, d) => acc + d.count, 0)
  } catch {
    return null
  }
}

export async function StatStrip() {
  const [mt, contributions] = await Promise.all([getMonkeyType(), getContributions()])
  if (!mt && contributions === null) return null

  const pillClass =
    'gap-1.5 border-border/60 px-3.5 py-1.5 text-[13px] font-normal tracking-tight text-muted-foreground [&>svg]:size-3.5'

  return (
    <section className="flex flex-wrap items-center gap-2">
      {mt && mt.streak > 0 && (
        <Badge asChild variant="outline" className={pillClass}>
          <Link href="/about">
            <Flame className="text-orange-500" />
            <span>
              <span className="font-semibold tabular-nums text-foreground">{mt.streak}</span>
              -day streak
            </span>
          </Link>
        </Badge>
      )}
      {mt && mt.bestWpm > 0 && (
        <Badge asChild variant="outline" className={pillClass}>
          <Link href="/about">
            <Keyboard className="text-primary" />
            <span>
              <span className="font-semibold tabular-nums text-foreground">{mt.bestWpm}</span> wpm
              best
            </span>
          </Link>
        </Badge>
      )}
      {contributions !== null && (
        <Badge asChild variant="outline" className={pillClass}>
          <Link href="https://github.com/PDGamerSG" target="_blank" rel="noopener noreferrer">
            <Github />
            <span>
              <span className="font-semibold tabular-nums text-foreground">{contributions}</span>{' '}
              contributions
            </span>
          </Link>
        </Badge>
      )}
      <Link
        href="/about"
        className="group ml-auto flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        more
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  )
}
