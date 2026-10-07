'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { MascotStage } from './esc-mascot-stage'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

/** A small client boundary: the hero and its links remain server-rendered. */
export function EscMascot() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const viewport = useRef<HTMLSpanElement>(null)
  const stage = useRef<MascotStage | null>(null)
  const openRef = useRef(false)
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )

  useEffect(() => {
    const element = viewport.current
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    // Both preferences keep the lightweight, interactive poster experience.
    if (!element || reducedMotion || connection?.saveData) return

    let cancelled = false
    let started = false
    let visible = false
    let idleCallback: number | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    let current: MascotStage | undefined

    const load = () => {
      if (started || cancelled || !visible) return
      started = true
      void import('./esc-mascot-stage').then(({ createMascotStage }) => {
        if (cancelled) return
        current = createMascotStage(element, {
          onReady: () => { if (!cancelled) setReady(true) },
          onError: () => { if (!cancelled) setReady(false) },
        })
        stage.current = current
        current.setOpen(openRef.current)
        current.setVisible(visible)
      }).catch(() => {
        // The posters and native button remain usable if the chunk cannot load.
        if (!cancelled) setReady(false)
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      current?.setVisible(visible)
      if (!visible || started) return
      if ('requestIdleCallback' in window) {
        if (idleCallback !== undefined) window.cancelIdleCallback(idleCallback)
        idleCallback = window.requestIdleCallback(load, { timeout: 1800 })
      } else {
        clearTimeout(timeout)
        timeout = setTimeout(load, 600)
      }
    })
    observer.observe(element)

    return () => {
      cancelled = true
      observer.disconnect()
      clearTimeout(timeout)
      if (idleCallback !== undefined) window.cancelIdleCallback(idleCallback)
      current?.dispose()
      stage.current = null
      setReady(false)
    }
  }, [reducedMotion])

  const toggle = () => {
    const next = !openRef.current
    openRef.current = next
    setOpen(next)
    stage.current?.setOpen(next)
  }

  return (
    <div className="esc-mascot" data-open={open}>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close ESC's workshop" : "Open ESC's tiny workshop"}
        aria-pressed={open}
        className="esc-mascot-button group"
      >
        <span className="esc-mascot-art" aria-hidden="true">
          <Image
            src={open ? '/mascot/esc-open.webp' : '/mascot/esc-closed.webp'}
            alt=""
            width={640}
            height={640}
            sizes="(max-width: 640px) 220px, 260px"
            unoptimized
            className={ready && !reducedMotion ? 'invisible' : ''}
          />
          <span
            ref={viewport}
            className="esc-mascot-canvas"
            style={{ visibility: ready && !reducedMotion ? 'visible' : 'hidden' }}
          />
        </span>
        <span className="esc-mascot-caption" aria-hidden="true">
          <span className="font-mono text-foreground/70">esc</span>
          <span className="text-muted-foreground/50">/</span>
          <span>{open ? 'little ideas inside' : 'a little maker'}</span>
          <span className="esc-mascot-hint text-primary">{open ? 'close ↗' : 'peek ↗'}</span>
        </span>
      </button>
      <span className="sr-only" role="status">
        {open ? 'A tiny monitor, coffee cup, and unfinished blue idea live under the keycap.' : ''}
      </span>
    </div>
  )
}
