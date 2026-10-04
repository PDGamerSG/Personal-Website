'use client'

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { useTheme } from 'next-themes'
import { Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SnakeEngine, type HudState } from '@/components/space-snake-engine'

const BEST_KEY = 'space-snake:best'

const KEYS: Record<string, number> = {
  ArrowRight: 0,
  ArrowDown: 1,
  ArrowLeft: 2,
  ArrowUp: 3,
  d: 0,
  s: 1,
  a: 2,
  w: 3,
}

const pad = (n: number) => String(n).padStart(2, '0')

function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia('(pointer: coarse)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/**
 * Dot-matrix night sky with an astronaut snake. It plays itself; a click
 * drops a star for it to chase, and an arrow key hands over the controls.
 */
export function SpaceSnake({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<SnakeEngine | null>(null)
  const swipeRef = useRef<{ x: number; y: number; id: number } | null>(null)

  const [hud, setHud] = useState<HudState>({ mode: 'auto', score: 0, best: 0 })
  const [ready, setReady] = useState(false)
  const { resolvedTheme } = useTheme()
  const coarse = useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia('(pointer: coarse)').matches,
    () => false,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let best = 0
    try {
      best = Number(localStorage.getItem(BEST_KEY)) || 0
    } catch {}

    const engine = new SnakeEngine(canvas, {
      onHud: (state) => {
        setHud(state)
        if (state.best > best) {
          best = state.best
          try {
            localStorage.setItem(BEST_KEY, String(best))
          } catch {}
        }
      },
      onFirstFrame: () => setReady(true),
    })
    engineRef.current = engine
    engine.setBest(best)

    const measure = () => {
      const r = wrap.getBoundingClientRect()
      engine.resize(r.width, r.height, window.devicePixelRatio || 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)

    // Only animate while the banner is on screen and the tab is visible.
    let visible = false
    const sync = () => (visible && !document.hidden ? engine.start() : engine.stop())
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(wrap)
    document.addEventListener('visibilitychange', sync)

    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setTheme(resolvedTheme === 'light' ? 'light' : 'dark')
  }, [resolvedTheme])

  const local = (e: PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const dir = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
    if (dir !== undefined) {
      e.preventDefault()
      engineRef.current?.steer(dir)
    } else if (e.key === 'Escape') {
      engineRef.current?.exitPlay()
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    swipeRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }

  const onPointerUp = (e: PointerEvent) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || start.id !== e.pointerId) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (hud.mode === 'play' && Math.hypot(dx, dy) > 24) {
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : dy > 0 ? 1 : 3
      engineRef.current?.steer(dir)
      return
    }
    if (Math.hypot(dx, dy) < 10) {
      const p = local(e)
      engineRef.current?.dropFood(p.x, p.y)
    }
  }

  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) engineRef.current?.exitPlay()
  }

  const playing = hud.mode === 'play'
  const over = hud.mode === 'over'
  const status = playing ? 'you’re steering' : over ? 'game over' : 'autopilot'

  return (
    <div
      tabIndex={0}
      role="group"
      aria-roledescription="game"
      aria-label="Space snake. Click to drop a star for the snake to chase. Press an arrow key to steer it yourself, Escape to hand it back."
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={cn(
        'group/snake overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-sm dark:border-white/[0.08]',
        'outline-none transition-[border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        playing && 'border-primary/40 shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)] dark:border-primary/40',
        className,
      )}
    >
      {/* scoreboard */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 font-mono text-[11px] leading-none tracking-wide dark:border-white/[0.06]">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span aria-hidden className="relative flex size-2">
            {playing && (
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
            )}
            <span
              className={cn(
                'relative size-2 rounded-full transition-colors duration-300',
                playing ? 'bg-primary' : over ? 'bg-destructive' : 'bg-emerald-400/80',
              )}
            />
          </span>
          <span className="text-foreground/90">space-snake</span>
          <span className="text-muted-foreground/60">/</span>
          <span>{status}</span>
        </span>
        <span className="flex items-center gap-4 text-muted-foreground">
          <span>
            score{' '}
            <span
              key={hud.score}
              className="inline-block tabular-nums text-foreground animate-in zoom-in-125 fade-in duration-200"
            >
              {pad(hud.score)}
            </span>
          </span>
          <span>
            best <span className="tabular-nums text-foreground/80">{pad(hud.best)}</span>
          </span>
        </span>
      </div>

      {/* playfield */}
      <div
        ref={wrapRef}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const p = local(e)
          engineRef.current?.setPointer(p.x, p.y)
        }}
        onPointerLeave={() => engineRef.current?.clearPointer()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={cn(
          'relative isolate aspect-[16/10] w-full cursor-crosshair select-none overflow-hidden sm:aspect-[5/2]',
          'bg-[oklch(0.967_0.007_250)] dark:bg-[oklch(0.125_0.016_264)]',
          playing ? 'touch-none' : 'touch-pan-y',
        )}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-1000 ease-[var(--ease-out)]',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />
        {/* soft vignette so the edges fall off */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_2px_oklch(0.967_0.007_250)] dark:shadow-[inset_0_0_36px_4px_oklch(0.11_0.016_264)]"
        />
        {over && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 font-mono animate-in fade-in zoom-in-95 duration-300">
            <span className="text-2xl font-medium tabular-nums text-foreground">{pad(hud.score)}</span>
            <span className="text-[11px] tracking-wide text-muted-foreground">
              {hud.score > 0 && hud.score >= hud.best ? 'new best' : 'stars caught'}
            </span>
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-2.5 font-mono text-[11px] leading-none text-muted-foreground dark:border-white/[0.06]">
        {coarse ? (
          <span>{playing ? 'swipe to steer' : over ? 'tap play to go again' : 'tap to drop a star'}</span>
        ) : (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                {['←', '↑', '↓', '→'].map((k) => (
                  <kbd key={k} className="kbd">
                    {k}
                  </kbd>
                ))}
              </span>
              {playing ? 'steer' : 'take over'}
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd px-1.5">esc</kbd>
              autopilot
            </span>
            <span className="hidden sm:inline">click to drop a star</span>
          </span>
        )}
        {coarse && (
          <button
            type="button"
            onClick={() => (playing ? engineRef.current?.exitPlay() : engineRef.current?.play())}
            className="flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 text-foreground"
          >
            {playing ? <Square className="size-3" /> : <Play className="size-3" />}
            {playing ? 'stop' : 'play'}
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {over ? `Game over. Score ${hud.score}.` : playing ? 'You are steering.' : ''}
      </p>
    </div>
  )
}
