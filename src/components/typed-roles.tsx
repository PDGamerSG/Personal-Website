'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'

const ROLES = [
  'full-stack developer',
  'ai/ml tinkerer',
  'web3 explorer',
  'daily monkeytype grinder',
  'software engineering student',
]

interface State {
  role: number
  /** what has been "typed" so far; letters that don't match the role show red */
  typed: string
  /** true while the finished line is resting and the caret blinks */
  idle: boolean
}

/** Neighbouring QWERTY keys, so the slips look like real fat-finger typos. */
const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
const NEAR: Record<string, string> = {}
ROWS.forEach((row, r) => {
  for (let c = 0; c < row.length; c++) {
    NEAR[row[c]] = [row[c - 1], row[c + 1], ROWS[r - 1]?.[c], ROWS[r - 1]?.[c + 1], ROWS[r + 1]?.[c], ROWS[r + 1]?.[c - 1]]
      .filter(Boolean)
      .join('')
  }
})

const pick = <T,>(xs: ArrayLike<T>) => xs[Math.floor(Math.random() * xs.length)]
const isLetter = (ch: string | undefined) => !!ch && ch in NEAR

const BACKSPACE = null
type Key = string | typeof BACKSPACE

/**
 * Plans the keystrokes for one line: mostly clean, with 0-2 slips of a random
 * kind (neighbouring key, swapped pair, doubled or skipped letter) at random
 * spots. Sometimes a letter or two more goes in before the slip is noticed,
 * then it all gets backspaced.
 */
function planKeys(word: string): Key[] {
  const roll = Math.random()
  const count = roll < 0.25 ? 0 : roll < 0.8 ? 1 : 2
  const spots = new Set<number>()
  for (let tries = 0; spots.size < count && tries < 20; tries++) {
    const i = 2 + Math.floor(Math.random() * (word.length - 3))
    if (isLetter(word[i]) && ![...spots].some((j) => Math.abs(j - i) < 4)) spots.add(i)
  }

  const keys: Key[] = []
  for (let i = 0; i < word.length; i++) {
    if (spots.has(i)) {
      const next = word[i + 1]
      const kinds = ['near', 'near', 'double']
      if (isLetter(next) && next !== word[i]) kinds.push('swap', 'skip')
      let slip: string[]
      switch (pick(kinds)) {
        case 'swap':
          slip = [next, word[i]]
          break
        case 'skip':
          slip = [next]
          break
        case 'double':
          slip = [word[i], word[i]]
          break
        default:
          slip = [pick(NEAR[word[i]])]
      }
      for (let j = i + slip.length, ahead = Math.floor(Math.random() * 3); ahead > 0 && isLetter(word[j]); ahead--) {
        slip.push(word[j++])
      }
      keys.push(...slip, ...slip.map(() => BACKSPACE))
    }
    keys.push(word[i])
  }
  return keys
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

const REDUCE = '(prefers-reduced-motion: reduce)'
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/**
 * A rotating tagline typed out like a MonkeyType test: the whole line shows
 * up dim, letters light up as they're "typed", and a different handful of
 * typos each time flashes red and gets backspaced. A nod to the 259-day
 * typing streak.
 */
export function TypedRoles({ className }: { className?: string }) {
  const [typing, setS] = useState<State>({ role: 0, typed: '', idle: true })
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )
  // reduced motion: the first line, fully typed, no loop
  const s: State = reduce ? { role: 0, typed: ROLES[0], idle: true } : typing

  useEffect(() => {
    if (reduce) return
    let cancelled = false

    const run = async () => {
      let role = 0
      await wait(900)
      while (!cancelled) {
        const word = ROLES[role]
        let typed = ''
        let fixing = false
        for (const key of planKeys(word)) {
          if (cancelled) return
          if (key === BACKSPACE) {
            // a beat to notice the slip, then quick, even backspaces
            await wait(fixing ? 45 + Math.random() * 40 : 180 + Math.random() * 260)
            fixing = true
            typed = typed.slice(0, -1)
            setS({ role, typed, idle: false })
            continue
          }
          if (fixing) await wait(60 + Math.random() * 120)
          fixing = false
          typed += key
          setS({ role, typed, idle: false })
          // humans are faster mid-word and hesitate at spaces
          await wait(key === ' ' ? 120 + Math.random() * 90 : 38 + Math.random() * 62)
        }
        if (cancelled) return
        setS({ role, typed: word, idle: true })
        await wait(2200)
        role = (role + 1) % ROLES.length
        setS({ role, typed: '', idle: true })
        await wait(450)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [reduce])

  const word = ROLES[s.role]
  const rest = word.slice(s.typed.length)

  return (
    <p className={cn('font-mono text-[15px] tracking-tight sm:text-base', className)}>
      <span className="sr-only">{ROLES.join(', ')}</span>
      <span aria-hidden key={s.role} className="inline-block animate-in fade-in duration-300">
        {[...s.typed].map((ch, i) => (
          <span key={i} className={ch === word[i] ? 'text-foreground' : 'text-destructive'}>
            {ch}
          </span>
        ))}
        <span
          className={cn(
            'relative -mx-px inline-block h-[1.15em] w-[2px] translate-y-[0.2em] rounded-full bg-primary',
            s.idle && 'caret-idle',
          )}
        />
        <span className="text-muted-foreground/45">{rest}</span>
      </span>
    </p>
  )
}
