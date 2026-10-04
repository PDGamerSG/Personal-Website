'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Leans its child toward the cursor while the cursor is near, then springs
 * back. Mouse and pen only, and off entirely under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let vx = 0
    let vy = 0
    let raf = 0

    // a small damped spring so the release has momentum instead of snapping
    const tick = () => {
      vx = (vx + (tx - x) * 0.18) * 0.72
      vy = (vy + (ty - y) * 0.18) * 0.72
      x += vx
      y += vy
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.05) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * strength
      ty = (e.clientY - (r.top + r.height / 2)) * strength
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
