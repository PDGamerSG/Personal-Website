'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

const noopSubscribe = () => () => {}

/**
 * Light/dark switching shared by the header toggle and the mobile dock.
 * `toggle` takes an optional viewport point for the circle reveal to grow
 * from; without one it wipes up from the bottom centre of the screen.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()
  // false on the server and during hydration, true after: avoids a mismatch
  // without a setState-in-effect re-render
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const isDark = resolvedTheme === 'dark'

  const toggle = (origin?: { x: number; y: number }) => {
    const next = isDark ? 'light' : 'dark'
    if (!document.startViewTransition) {
      setTheme(next)
      return
    }
    const root = document.documentElement
    // read by the ::view-transition rules in globals.css
    if (origin) root.style.setProperty('--reveal-at', `${origin.x}px ${origin.y}px`)
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    transition.finished.finally(() => root.style.removeProperty('--reveal-at'))
  }

  return { mounted, isDark, toggle }
}

export function ThemeToggle() {
  const { mounted, isDark, toggle } = useThemeSwitch()

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle theme">
        <span className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => toggle()}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
