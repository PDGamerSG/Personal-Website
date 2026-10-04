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
  /** characters typed correctly so far */
  typed: number
  /** the next letter was mistyped: it shows red until it's backspaced */
  typo: boolean
  /** true while the finished line is resting and the caret blinks */
  idle: boolean
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
 * up dim, letters light up as they're "typed", the odd typo flashes red and
 * gets backspaced. A nod to the 259-day typing streak.
 */
export function TypedRoles({ className }: { className?: string }) {
  const [typing, setS] = useState<State>({ role: 0, typed: 0, typo: false, idle: true })
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )
  // reduced motion: the first line, fully typed, no loop
  const s: State = reduce ? { role: 0, typed: ROLES[0].length, typo: false, idle: true } : typing

  useEffect(() => {
    if (reduce) return
    let cancelled = false

    const run = async () => {
      let role = 0
      await wait(900)
      while (!cancelled) {
        const word = ROLES[role]
        // one typo per line at most, somewhere past the first few letters
        const typoAt = Math.random() < 0.55 ? 3 + Math.floor(Math.random() * (word.length - 4)) : -1
        for (let i = 0; i < word.length && !cancelled; i++) {
          if (i === typoAt && word[i] !== ' ') {
            setS({ role, typed: i, typo: true, idle: false })
            await wait(260)
            setS({ role, typed: i, typo: false, idle: false })
            await wait(120)
          }
          setS({ role, typed: i + 1, typo: false, idle: false })
          // humans are faster mid-word and hesitate at spaces
          await wait(word[i] === ' ' ? 120 + Math.random() * 90 : 38 + Math.random() * 62)
        }
        if (cancelled) return
        setS({ role, typed: word.length, typo: false, idle: true })
        await wait(2200)
        role = (role + 1) % ROLES.length
        setS({ role, typed: 0, typo: false, idle: true })
        await wait(450)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [reduce])

  const word = ROLES[s.role]
  const done = word.slice(0, s.typed)
  const miss = s.typo ? word[s.typed] : ''
  const rest = word.slice(s.typed + miss.length)

  return (
    <p className={cn('font-mono text-[15px] tracking-tight sm:text-base', className)}>
      <span className="sr-only">{ROLES.join(', ')}</span>
      <span aria-hidden key={s.role} className="inline-block animate-in fade-in duration-300">
        <span className="text-foreground">{done}</span>
        {miss && <span className="text-destructive">{miss}</span>}
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
