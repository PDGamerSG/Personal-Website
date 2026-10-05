import Link from 'next/link'
import { HeaderNav } from '@/components/header-nav'

export function Header() {
  // phones get the keycap dock at the bottom of the screen instead
  return (
    <header className="sticky top-0 z-50 hidden w-full border-b border-border/40 bg-background/80 backdrop-blur-sm md:block">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span>Pallab Das :)</span>
        </Link>

        <HeaderNav />
      </div>
    </header>
  )
}

