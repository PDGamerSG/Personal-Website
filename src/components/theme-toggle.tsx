'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

const noopSubscribe = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // false on the server and during hydration, true after: avoids a mismatch
  // without a setState-in-effect re-render
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle theme">
        <span className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    if (!document.startViewTransition) {
      setTheme(next)
      return
    }
    // Circle-reveal theme switch: the new theme wipes up from the bottom
    // of the screen (see ::view-transition rules in globals.css)
    document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
