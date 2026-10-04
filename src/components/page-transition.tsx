'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const fromHistory = useRef(false)

  // Back/forward should restore the old scroll position, so remember when a
  // navigation came from the history stack instead of a link.
  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Next scrolls the new page's first element into view, which with the
  // sticky header can leave it part-way down. Every link navigation starts
  // the new page at the very top instead (hash links keep their target).
  useLayoutEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false
      return
    }
    if (window.location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div key={pathname} className="page-transition flex-1">
      {children}
    </div>
  )
}
