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
  const hint =
    hud.mode === 'over'
      ? coarse
        ? 'tap play to go again'
        : 'press an arrow key to go again'
      : playing
        ? coarse
          ? 'swipe to steer'
          : 'esc hands it back to autopilot'
        : coarse
          ? 'tap to drop a star'
          : 'click to drop a star · arrow keys to take over'

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-roledescription="game"
      aria-label="Space snake. Click to drop a star for the snake to chase. Press an arrow key to steer it yourself, Escape to hand it back."
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const p = local(e)
        engineRef.current?.setPointer(p.x, p.y)
      }}
      onPointerLeave={() => engineRef.current?.clearPointer()}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={cn(
        'group/snake relative isolate aspect-[16/10] w-full cursor-crosshair select-none overflow-hidden rounded-2xl sm:aspect-[3/1]',
        'border border-border/70 bg-[oklch(0.967_0.007_250)] dark:border-white/[0.07] dark:bg-[oklch(0.125_0.016_264)]',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        playing ? 'touch-none' : 'touch-pan-y',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          'absolute inset-0 h-full w-full transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
          ready ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* soft vignette so the edges fall off into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_28px_2px_oklch(0.967_0.007_250)] dark:shadow-[inset_0_0_32px_2px_oklch(0.11_0.016_264)]"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3.5 pt-3 font-mono text-[11px] leading-none tracking-wide text-muted-foreground sm:px-4 sm:pt-3.5">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              'size-1.5 rounded-full transition-colors duration-300',
              playing ? 'bg-[#e8845f]' : hud.mode === 'over' ? 'bg-destructive' : 'bg-muted-foreground/60',
            )}
          />
          {playing ? (
            <span>
              score <span className="tabular-nums text-foreground">{pad(hud.score)}</span>
            </span>
          ) : hud.mode === 'over' ? (
            <span className="text-foreground">game over · {pad(hud.score)}</span>
          ) : (
            <span>autopilot</span>
          )}
        </span>
        {hud.best > 0 && (
          <span>
            best <span className="tabular-nums text-foreground/80">{pad(hud.best)}</span>
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-3.5 pb-3 sm:px-4 sm:pb-3.5">
        <span
          className={cn(
            'font-mono text-[11px] leading-none tracking-wide text-muted-foreground transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            playing || hud.mode === 'over' || coarse
              ? 'translate-y-0 opacity-100'
              : 'translate-y-1 opacity-0 group-hover/snake:translate-y-0 group-hover/snake:opacity-100 group-focus-visible/snake:translate-y-0 group-focus-visible/snake:opacity-100',
          )}
        >
          {hint}
        </span>
        {coarse && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => (playing ? engineRef.current?.exitPlay() : engineRef.current?.play())}
            className="pointer-events-auto flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 font-mono text-[11px] text-foreground backdrop-blur-sm"
          >
            {playing ? <Square className="size-3" /> : <Play className="size-3" />}
            {playing ? 'stop' : 'play'}
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {hud.mode === 'over' ? `Game over. Score ${hud.score}.` : playing ? 'You are steering.' : ''}
      </p>
    </div>
  )
}
