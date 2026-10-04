'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Dot {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  delay: number
}

/** Room around the heading, in CSS px, so dots pushed off the letters aren't clipped. */
const PAD = 32
const SPRING = 0.065
const DAMPING = 0.83

/**
 * The hero name, re-drawn as the same dot matrix the space snake lives in.
 * Dots sweep in once on load, shy away from the cursor, and scatter on click
 * before settling back into the letters. Dragging across the name (mouse or
 * finger) pushes the dots away like hovering does and also sweeps them along
 * in the drag direction.
 *
 * The real <h1> stays in the DOM underneath (transparent once the canvas is
 * up), so it still sizes the layout and is what screen readers and crawlers
 * see. If the canvas never draws, the plain heading is what remains.
 */
export function DotName({ text, className }: { text: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const heading = headingRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !heading || !canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots: Dot[] = []
    let dpr = 1
    let W = 0
    let H = 0
    let radius = 1
    let pointer: { x: number; y: number } | null = null
    // the pointer currently pressed on the name, if any
    let drag: { id: number; touch: boolean; sx: number; sy: number; lx: number; ly: number; moved: boolean } | null = null
    // recent drag motion; it pushes nearby dots along and fades out each frame
    const flow = { x: 0, y: 0 }
    let raf = 0
    let running = false
    let introAt = 0
    let last = 0
    let disposed = false
    const ink = { base: '', hot: '' }

    const readColors = () => {
      const root = getComputedStyle(document.documentElement)
      ink.base = root.getPropertyValue('--foreground').trim() || '#e5e7eb'
      ink.hot = root.getPropertyValue('--primary').trim() || '#818cf8'
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const calm = new Path2D()
      const hot = new Path2D()
      const now = performance.now()
      const threshold = 3 * dpr
      for (const d of dots) {
        if (now < introAt + d.delay) continue
        const p = Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) > threshold ? hot : calm
        p.moveTo(d.x + radius, d.y)
        p.arc(d.x, d.y, radius, 0, Math.PI * 2)
      }
      ctx.fillStyle = ink.base
      ctx.fill(calm)
      ctx.fillStyle = ink.hot
      ctx.fill(hot)
    }

    const step = (now: number) => {
      // normalise to 60fps so the spring feels the same on 120Hz screens
      const k = last ? Math.min(2, (now - last) / 16.67) : 1
      last = now
      const R = 72 * dpr
      let energy = 0
      let pending = false
      const decay = 0.78 ** k
      flow.x *= decay
      flow.y *= decay
      const flowing = Math.abs(flow.x) + Math.abs(flow.y) > 0.1 * dpr
      for (const d of dots) {
        if (now < introAt + d.delay) {
          pending = true
          continue
        }
        let ax = (d.hx - d.x) * SPRING
        let ay = (d.hy - d.y) * SPRING
        if (pointer) {
          const dx = d.x - pointer.x
          const dy = d.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < R && dist > 0.01) {
            const f = (1 - dist / R) ** 2 * 7 * dpr
            ax += (dx / dist) * f
            ay += (dy / dist) * f
            if (flowing) {
              const sweep = (1 - dist / R) * 0.2
              ax += flow.x * sweep
              ay += flow.y * sweep
            }
          }
        }
        d.vx = (d.vx + ax * k) * DAMPING
        d.vy = (d.vy + ay * k) * DAMPING
        d.x += d.vx * k
        d.y += d.vy * k
        energy += Math.abs(d.vx) + Math.abs(d.vy) + Math.abs(d.hx - d.x) + Math.abs(d.hy - d.y)
      }
      draw()
      if (pending || pointer || flowing || energy > dots.length * 0.05) {
        raf = requestAnimationFrame(step)
      } else {
        // settled: snap home and let the loop sleep until something wakes it
        for (const d of dots) {
          d.x = d.hx
          d.y = d.hy
          d.vx = d.vy = 0
        }
        draw()
        running = false
        last = 0
      }
    }

    const wake = () => {
      if (reduce || running || !dots.length) return
      running = true
      raf = requestAnimationFrame(step)
    }

    const build = (intro: boolean) => {
      const rect = heading.getBoundingClientRect()
      if (rect.width < 1) return
      dpr = Math.min(2, window.devicePixelRatio || 1)
      // right-hand padding shrinks near the viewport edge so the canvas never
      // makes the page scroll sideways on phones
      const padR = Math.max(0, Math.min(PAD, document.documentElement.clientWidth - rect.right - 1))
      const cssW = rect.width + PAD + padR
      const cssH = rect.height + PAD * 2
      W = Math.round(cssW * dpr)
      H = Math.round(cssH * dpr)
      canvas.width = W
      canvas.height = H
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`

      // Rasterise the heading with its own computed font, then sample a grid.
      const cs = getComputedStyle(heading)
      const fontSize = parseFloat(cs.fontSize)
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const o = off.getContext('2d', { willReadFrequently: true })
      if (!o) return
      o.font = `${cs.fontWeight} ${fontSize * dpr}px ${cs.fontFamily}`
      if ('letterSpacing' in o) {
        const ls = parseFloat(cs.letterSpacing)
        if (!Number.isNaN(ls)) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${ls * dpr}px`
      }
      o.textBaseline = 'alphabetic'
      const m = o.measureText(text)
      const ascent = m.actualBoundingBoxAscent
      const inkH = ascent + m.actualBoundingBoxDescent
      o.fillStyle = '#000'
      o.fillText(text, PAD * dpr, PAD * dpr + (rect.height * dpr - inkH) / 2 + ascent)
      const data = o.getImageData(0, 0, W, H).data

      // Phone sizes keep the grid fine enough to stay legible and shrink the
      // dots instead, so there's still daylight between them.
      const small = fontSize < 64
      const gap = (small ? Math.max(2.5, fontSize / 16) : Math.round(fontSize / 17)) * dpr
      radius = gap * (small ? 0.3 : 0.36)
      const next: Dot[] = []
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          if (data[((y | 0) * W + (x | 0)) * 4 + 3] < 128) continue
          const animate = intro && !reduce
          next.push({
            hx: x,
            hy: y,
            // the sweep starts from a loose cloud beneath the letters
            x: animate ? x + (Math.random() - 0.5) * 120 * dpr : x,
            y: animate ? y + (Math.random() * 0.8 + 0.2) * 70 * dpr : y,
            vx: 0,
            vy: 0,
            delay: animate ? (x / W) * 520 + Math.random() * 180 : 0,
          })
        }
      }
      dots = next
      introAt = performance.now()
      draw()
      setReady(true)
      wake()
    }

    const toLocal = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect()
      return { x: (clientX - r.left) * dpr, y: (clientY - r.top) * dpr, inside: clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom }
    }

    const onMove = (e: PointerEvent) => {
      if (drag && e.pointerId === drag.id) {
        const p = toLocal(e.clientX, e.clientY)
        flow.x += p.x - drag.lx
        flow.y += p.y - drag.ly
        drag.lx = p.x
        drag.ly = p.y
        if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 6 * dpr) drag.moved = true
        pointer = { x: p.x, y: p.y }
        wake()
        return
      }
      if (e.pointerType === 'touch') return
      const p = toLocal(e.clientX, e.clientY)
      if (p.inside) {
        pointer = { x: p.x, y: p.y }
        wake()
      } else if (pointer) {
        pointer = null
        wake()
      }
    }

    const onLeave = () => {
      pointer = null
      wake()
    }

    // A click (or tap) blows the letters apart from that point.
    const scatter = (p: { x: number; y: number }) => {
      for (const d of dots) {
        const dx = d.x - p.x
        const dy = d.y - p.y
        const dist = Math.max(8, Math.hypot(dx, dy))
        const f = (34 * dpr * (0.6 + Math.random() * 0.8)) / Math.sqrt(dist / dpr)
        d.vx += (dx / dist) * f + (Math.random() - 0.5) * 4 * dpr
        d.vy += (dy / dist) * f + (Math.random() - 0.5) * 4 * dpr
      }
      wake()
    }

    // Pressing starts a drag. Fingers have no hover, so a touch acts as the
    // cursor for as long as it's down. Letting go without moving is a click.
    const onDown = (e: PointerEvent) => {
      if (reduce || drag || (e.pointerType === 'mouse' && e.button !== 0)) return
      const p = toLocal(e.clientX, e.clientY)
      const touch = e.pointerType !== 'mouse'
      drag = { id: e.pointerId, touch, sx: p.x, sy: p.y, lx: p.x, ly: p.y, moved: false }
      flow.x = flow.y = 0
      if (touch) {
        pointer = { x: p.x, y: p.y }
        wake()
      }
    }

    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const { touch, moved } = drag
      drag = null
      if (touch) pointer = null
      if (!moved && e.type === 'pointerup') scatter(toLocal(e.clientX, e.clientY))
      wake()
    }

    readColors()
    document.fonts.ready.then(() => {
      if (!disposed) build(true)
    })

    const ro = new ResizeObserver(() => {
      if (dots.length) build(false)
    })
    ro.observe(heading)

    const mo = new MutationObserver(() => {
      readColors()
      draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [text])

  return (
    <div ref={wrapRef} className={cn('relative w-fit touch-pan-y select-none', className)}>
      <h1
        ref={headingRef}
        className={cn(
          'whitespace-nowrap text-[clamp(2rem,calc((100vw-7.5rem)/5.4),5.75rem)] sm:text-[clamp(2.25rem,12vw,5.75rem)] font-bold leading-[1.05] tracking-tight transition-colors duration-500',
          ready ? 'text-transparent' : 'text-foreground',
        )}
      >
        {text}
      </h1>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{ left: -PAD, top: -PAD }}
      />
    </div>
  )
}
