'use client'

import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { Check, Copy, Download, FileText, Mail, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mailtoUrl, siteConfig } from '@/lib/seo'

const hireSubject = `Hey ${siteConfig.name.split(' ')[0]} — let's work together`

/** idle → (click copies the address) → copied → settles on a mail hand-off. */
type Phase = 'idle' | 'copied' | 'ready'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

/**
 * A label that collapses to zero width when inactive, so the pill morphs
 * between captions instead of swapping them in place. The `0fr → 1fr` grid
 * track is what makes the width animatable at all — `width: auto` is not.
 */
function Caption({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden={!show}
      className={cn(
        'grid transition-all duration-500 motion-reduce:transition-none',
        EASE,
        show ? 'grid-cols-[1fr] opacity-100 blur-0' : 'grid-cols-[0fr] opacity-0 blur-[3px]',
      )}
    >
      <span className="min-w-0 overflow-hidden">
        {/* padding lives inside the clip so the icon gap collapses too */}
        <span
          className={cn(
            'block whitespace-nowrap pl-2 transition-transform duration-500 motion-reduce:transition-none',
            EASE,
            show ? 'translate-y-0' : 'translate-y-1.5',
          )}
        >
          {children}
        </span>
      </span>
    </span>
  )
}

/** Icons share one 14px cell and rotate/scale past each other on phase change. */
function PhaseIcon({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute inset-0 flex items-center justify-center transition-all duration-[420ms] motion-reduce:transition-none',
        EASE,
        show ? 'rotate-0 scale-100 opacity-100' : 'rotate-[-120deg] scale-50 opacity-0',
      )}
    >
      {children}
    </span>
  )
}

/**
 * Primary call-to-action cluster: a self-morphing "Hire me" control that copies
 * the address on click (no third-party compose redirect), then offers the mail
 * hand-off — plus a split view/download control for the resume PDF.
 */
export function HireMe({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [hovered, setHovered] = useState(false)

  // Let the confirmation breathe, then settle into the "Email me" affordance.
  useEffect(() => {
    if (phase !== 'copied') return
    const id = setTimeout(() => setPhase('ready'), 1700)
    return () => clearTimeout(id)
  }, [phase])

  /**
   * Touch fires pointerenter right before the tap and never fires a matching
   * leave, so tracking every pointer type would leave the pill stuck in its
   * hover caption on phones. Only mice and pens count as hover.
   */
  function setHover(next: boolean) {
    return (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      setHovered(next)
    }
  }

  async function handleClick() {
    if (phase === 'copied') return // mid-confirmation — let it finish

    if (phase === 'ready') {
      window.location.href = mailtoUrl(hireSubject)
      return
    }

    try {
      await navigator.clipboard.writeText(siteConfig.email)
      setPhase('copied')
    } catch {
      // Clipboard denied (insecure context / permission) — skip straight to mail.
      setPhase('ready')
    }
  }

  const idle = phase === 'idle'
  const copied = phase === 'copied'
  const ready = phase === 'ready'

  return (
    <div
      className={cn(
        // Two equal halves on phones so the pill's width morph never reflows
        // the row; intrinsic widths from sm up.
        'grid grid-cols-2 items-center gap-2.5 sm:flex sm:flex-wrap',
        className,
      )}
    >

      {/* Hire me → copy email → email me, all in one pill */}
      <div className="relative min-w-0">
        {/* success ripple, mounted only for the confirmation beat */}
        {copied && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-emerald-400/25 motion-reduce:hidden"
          />
        )}

        <button
          type="button"
          onClick={handleClick}
          onPointerEnter={setHover(true)}
          onPointerLeave={setHover(false)}
          onPointerCancel={setHover(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          title={ready ? `Email ${siteConfig.email}` : `Copy ${siteConfig.email}`}
          aria-label={
            ready
              ? `Email ${siteConfig.email}`
              : copied
                ? 'Email address copied'
                : `Copy email address ${siteConfig.email}`
          }
          className={cn(
            'group/pill relative flex w-full min-h-11 items-center justify-center overflow-hidden rounded-full px-4',
            'sm:inline-flex sm:w-auto sm:min-h-0 sm:justify-start sm:px-5 sm:py-2.5',
            'touch-manipulation select-none [-webkit-tap-highlight-color:transparent]',
            'text-[13px] font-semibold tracking-tight text-primary-foreground',
            'shadow-lg transition-all duration-500 motion-reduce:transition-none',
            EASE,
            'hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            copied
              ? 'bg-emerald-500 shadow-emerald-500/35'
              : 'bg-primary shadow-primary/25 hover:shadow-xl hover:shadow-primary/40',
          )}
        >
          {/* sheen sweep on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[150%] skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/pill:translate-x-[150%] motion-reduce:hidden"
          />

          <span className="relative h-3.5 w-3.5 shrink-0">
            <PhaseIcon show={idle && !hovered}>
              <Mail className="h-3.5 w-3.5" />
            </PhaseIcon>
            <PhaseIcon show={idle && hovered}>
              <Copy className="h-3.5 w-3.5" />
            </PhaseIcon>
            <PhaseIcon show={copied}>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </PhaseIcon>
            <PhaseIcon show={ready}>
              <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover/pill:-translate-y-px group-hover/pill:translate-x-px" />
            </PhaseIcon>
          </span>

          <span className="relative flex items-center">
            <Caption show={idle && !hovered}>Hire me</Caption>
            <Caption show={idle && hovered}>Copy email</Caption>
            <Caption show={copied}>Email copied</Caption>
            <Caption show={ready}>Email me</Caption>
          </span>
        </button>

        <span aria-live="polite" className="sr-only">
          {copied ? `Copied ${siteConfig.email} to clipboard` : ''}
        </span>
      </div>

      {/* Resume — segmented: open in a tab, or download straight off /public */}
      <div className="flex min-h-11 min-w-0 items-stretch overflow-hidden rounded-full border border-border/70 bg-secondary/40 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 sm:inline-flex sm:min-h-0">
        <Link
          href={siteConfig.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 touch-manipulation items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[13px] font-medium tracking-tight text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:flex-none sm:justify-start sm:gap-2 sm:py-2.5 sm:pl-4 sm:pr-3.5"
        >
          <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
          Resume
          {/* the chip is pure garnish — it goes first when the row gets tight */}
          <span className="hidden rounded-sm bg-muted-foreground/15 px-1 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground sm:inline">
            pdf
          </span>
        </Link>

        <span aria-hidden className="my-2 w-px shrink-0 bg-border/70" />

        <a
          href={siteConfig.resumeFile}
          download
          aria-label="Download resume (PDF)"
          className="group flex shrink-0 touch-manipulation items-center px-3.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-3"
        >
          <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      </div>

    </div>
  )
}
