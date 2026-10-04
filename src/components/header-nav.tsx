'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState, type MouseEvent, type TransitionEvent } from 'react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/seo'

const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: siteConfig.resume, label: 'Resume', external: true },
]

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]" aria-hidden>
      <span className={cn('block h-[1.5px] w-5 rounded-full bg-foreground origin-center transition-all duration-300', open && 'translate-y-[6.5px] rotate-45')} />
      <span className={cn('block h-[1.5px] w-5 rounded-full bg-foreground transition-all duration-300', open && 'opacity-0 scale-x-0')} />
      <span className={cn('block h-[1.5px] w-5 rounded-full bg-foreground origin-center transition-all duration-300', open && '-translate-y-[6.5px] -rotate-45')} />
    </div>
  )
}

/** One period of the nav squiggle; tiled along the indicator as a mask so it takes the theme colour. */
const WAVE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpath d='M0 2Q2 0 4 2T8 2' fill='none' stroke='black' stroke-width='1.25'/%3E%3C/svg%3E\")"

/**
 * The wavy underline under the current page. It crawls from link to link
 * like a little worm: the edge in the direction of travel leaves first and
 * the other edge catches up, so it stretches and then contracts.
 */
function useSquiggle(active: string | null) {
  const navRef = useRef<HTMLElement>(null)
  const squiggleRef = useRef<HTMLSpanElement>(null)
  const labels = useRef(new Map<string, HTMLSpanElement>())
  const placed = useRef<{ left: number; right: number } | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    const el = squiggleRef.current
    if (!nav || !el) return

    const place = (animate: boolean) => {
      const label = active ? labels.current.get(active) : undefined
      // hidden (mobile) nav, or a page that isn't in the nav
      if (!label || !nav.offsetWidth) {
        el.style.opacity = '0'
        return
      }
      const left = label.offsetLeft
      const right = nav.offsetWidth - left - label.offsetWidth
      const prev = placed.current
      const move = animate && prev !== null && el.style.opacity !== '0' && (prev.left !== left || prev.right !== right)
      if (move) {
        const forward = left > prev.left
        el.style.transitionProperty = 'left, right'
        el.style.transitionDelay = forward ? '90ms, 0ms' : '0ms, 90ms'
        // the wave ripples until the trailing edge lands
        el.dataset.moving = forward ? 'left' : 'right'
      } else {
        el.style.transitionProperty = 'none'
        delete el.dataset.moving
      }
      el.style.left = `${left}px`
      el.style.right = `${right}px`
      el.style.top = `${label.offsetTop + label.offsetHeight + 1}px`
      el.style.opacity = '1'
      placed.current = { left, right }
    }

    place(true)
    // observing fires once straight away; only real size changes should snap
    let width = nav.offsetWidth
    const ro = new ResizeObserver(() => {
      if (nav.offsetWidth === width) return
      width = nav.offsetWidth
      place(false)
    })
    ro.observe(nav)
    return () => ro.disconnect()
  }, [active])

  const register = (href: string) => (node: HTMLSpanElement | null) => {
    if (node) labels.current.set(href, node)
    else labels.current.delete(href)
  }

  const stopCrawl = (e: TransitionEvent<HTMLSpanElement>) => {
    if (e.propertyName === e.currentTarget.dataset.moving) delete e.currentTarget.dataset.moving
  }

  return { navRef, squiggleRef, register, stopCrawl }
}

export function HeaderNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  // The squiggle heads for a link as soon as it's clicked, not once the next
  // page has finished loading. Stale once the route actually changes.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null)
  const current = pending && pending.from === pathname ? pending.href : pathname
  const { navRef, squiggleRef, register, stopCrawl } = useSquiggle(
    navLinks.some((l) => !l.external && l.href === current) ? current : null,
  )

  const onNavClick = (e: MouseEvent, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    setPending(href === pathname ? null : { href, from: pathname })
  }

  return (
    <>
      {/* Desktop nav */}
      <nav ref={navRef} className="relative hidden items-center gap-1 md:flex">
        {navLinks.map(({ href, label, external }) => {
          const active = current === href
          return (
            <Link
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: (e: MouseEvent) => onNavClick(e, href) })}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span ref={register(href)}>{label}</span>
            </Link>
          )
        })}
        <span
          ref={squiggleRef}
          aria-hidden
          onTransitionEnd={stopCrawl}
          className="squiggle pointer-events-none absolute h-1 bg-primary opacity-0 duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none!"
          style={{ maskImage: WAVE, WebkitMaskImage: WAVE }}
        />
      </nav>

      {/* Right-side controls */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* Mobile nav — slide down */}
      <div className={cn(
        'absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out md:hidden',
        mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <nav className="border-t border-border/40 bg-background/95 backdrop-blur-sm px-4 py-3">
          {navLinks.map(({ href, label, external }, i) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setMobileOpen(false)}
                style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
                className={cn(
                  'flex items-center justify-between border-b border-border/30 py-3.5 text-base font-medium transition-all duration-200 last:border-0',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
