'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type More = 'none' | 'start' | 'end' | 'both'

/**
 * The row the hackathon badges hang from. It scrolls sideways; the buttons
 * step one badge at a time for anyone without a trackpad, and the ends that
 * still hide badges fade out.
 */
export function BadgeRail({ children, label }: { children: ReactNode; label: string }) {
  const railRef = useRef<HTMLUListElement>(null)
  const [more, setMore] = useState<More>('none')

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const update = () => {
      const start = rail.scrollLeft > 4
      const end = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4
      setMore(start && end ? 'both' : start ? 'start' : end ? 'end' : 'none')
    }
    update()
    rail.addEventListener('scroll', update, { passive: true })
    const resize = new ResizeObserver(update)
    resize.observe(rail)
    return () => {
      rail.removeEventListener('scroll', update)
      resize.disconnect()
    }
  }, [])

  const step = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const slot = rail.querySelector('li')
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
    const width = slot ? slot.getBoundingClientRect().width + gap : rail.clientWidth
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollBy({ left: dir * width, behavior: reduce ? 'auto' : 'smooth' })
  }

  const canBack = more === 'start' || more === 'both'
  const canForward = more === 'end' || more === 'both'

  return (
    <div>
      <ul ref={railRef} className="badge-rail" data-more={more} aria-label={label}>
        {children}
      </ul>
      {more !== 'none' && (
        <div className="-mt-2 hidden justify-end gap-1.5 sm:flex">
          {(
            [
              { dir: -1, can: canBack, label: 'Previous badge', Icon: ChevronLeft },
              { dir: 1, can: canForward, label: 'Next badge', Icon: ChevronRight },
            ] as const
          ).map(({ dir, can, label: name, Icon }) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              disabled={!can}
              aria-label={name}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-[color,background-color,scale] duration-200 hover:bg-secondary/60 hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
