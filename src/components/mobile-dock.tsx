'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { FileText, FolderGit2, House, Moon, NotebookPen, Smile, Sun, type LucideIcon } from 'lucide-react'
import { navLinks } from '@/components/header-nav'
import { useThemeSwitch } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/seo'

const icons: Record<string, LucideIcon> = {
  '/': House,
  '/writing': NotebookPen,
  '/projects': FolderGit2,
  '/about': Smile,
}

const pages = navLinks.filter((l) => !l.external)

/** /writing/some-post still lights the Writing tab. */
const matches = (href: string, path: string) =>
  href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`)

/** A short buzz on Android; iOS has no web vibration API and ignores it. */
const tap = () => {
  if ('vibrate' in navigator) navigator.vibrate(8)
}

/**
 * The highlight behind the current tab. It slithers between tabs like the
 * space snake: the end facing the new tab sets off first and the tail
 * catches up, so it stretches out and then contracts.
 */
function useSnake(index: number) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const from = prev.current
    prev.current = index
    if (index < 0) {
      el.style.opacity = '0'
      return
    }
    const slot = `(100% - 8px) / ${pages.length}`
    const move = from !== null && from >= 0 && from !== index && el.style.opacity !== '0'
    if (move) {
      const forward = index > from
      el.style.transitionProperty = 'left, right'
      el.style.transitionDelay = forward ? '70ms, 0ms' : '0ms, 70ms'
    } else {
      el.style.transitionProperty = 'none'
    }
    el.style.left = `calc(4px + ${index} * ${slot})`
    el.style.right = `calc(4px + ${pages.length - 1 - index} * ${slot})`
    el.style.opacity = '1'
  }, [index])

  return ref
}

/**
 * Phone navigation: one floating icon pill, with dividers separating the
 * page links, resume, and theme switch. Labels appear on hover or focus.
 * Styles live under "Mobile dock" in globals.css.
 */
export function MobileDock() {
  const pathname = usePathname()
  // Like the desktop squiggle, the highlight moves on tap rather than once the
  // next page has loaded. Stale once the route actually changes.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null)
  const current = pending && pending.from === pathname ? pending.href : pathname
  const active = pages.findIndex((p) => matches(p.href, current))
  const snakeRef = useSnake(active)
  const { mounted, isDark, toggle } = useThemeSwitch()
  const themeLabel = mounted ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'

  const onNavClick = (e: MouseEvent, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    setPending(href === pathname ? null : { href, from: pathname })
  }

  const onThemeClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    // the new theme spreads out from the icon that was tapped
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <nav aria-label="Primary" className="dock md:hidden">
      <div className="dock-row">
        <div className="dock-bar">
          <span ref={snakeRef} className="dock-snake" aria-hidden />
          {pages.map(({ href, label }, i) => {
            const Icon = icons[href]
            return (
              <Link
                key={href}
                href={href}
                className="dock-tab"
                data-active={i === active ? '' : undefined}
                aria-label={label}
                aria-current={matches(href, pathname) ? 'page' : undefined}
                onPointerDown={tap}
                onClick={(e) => onNavClick(e, href)}
              >
                <Icon aria-hidden />
                <span className="dock-tooltip" aria-hidden>{label}</span>
              </Link>
            )
          })}
        </div>

        <span className="dock-divider" aria-hidden />
        <a
          href={siteConfig.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-action dock-resume"
          onPointerDown={tap}
          aria-label="Resume (PDF, opens in a new tab)"
        >
          <FileText aria-hidden />
          <span className="dock-tooltip" aria-hidden>Resume</span>
        </a>
        <span className="dock-divider" aria-hidden />
        <button
          type="button"
          className="dock-action"
          onPointerDown={tap}
          onClick={onThemeClick}
          aria-label={themeLabel}
        >
          <span className="dock-swap" aria-hidden>
            <Sun data-shown={mounted && isDark ? '' : undefined} />
            <Moon data-shown={!mounted || !isDark ? '' : undefined} />
          </span>
          <span className="dock-tooltip" aria-hidden>{mounted && isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </nav>
  )
}
