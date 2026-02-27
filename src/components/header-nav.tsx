'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
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

export function HeaderNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 md:flex">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'text-foreground underline decoration-wavy decoration-primary underline-offset-4'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </Link>
          )
        })}
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
          {navLinks.map(({ href, label }, i) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
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
