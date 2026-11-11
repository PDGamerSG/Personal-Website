import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PLACE_LABEL, type Hackathon } from '@/lib/hackathons'
import { BadgeRail } from '@/components/badge-rail'

/** Resting angle of each badge on the rail, so the row hangs a little unevenly. */
const TILTS = ['-1.6deg', '1.2deg', '-0.8deg', '1.4deg']

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/** The ring text fits at this size up to this many characters, then shrinks to stay one lap. */
const RING_FONT = 10.5
const RING_CHARS = 31

/**
 * Rubber-stamp seal for a placing. The filter roughens the edges and knocks
 * small holes into the ink, the way a real stamp never prints evenly. A win
 * carries a star in the middle, second place a big "2nd". On a dark
 * screenshot the ink would sink in, so the seal gets a paper disc behind it.
 */
function ResultStamp({
  id,
  place,
  label,
  backed = false,
}: {
  id: string
  place: 1 | 2
  label: string
  backed?: boolean
}) {
  const ring = `${PLACE_LABEL[place].toUpperCase()} • ${label.toUpperCase()} • `
  const fontSize = Math.min(RING_FONT, (RING_FONT * RING_CHARS) / ring.length)
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`badge-stamp pointer-events-none absolute -bottom-8 -right-4 z-10 w-[96px] text-primary ${
        backed
          ? 'drop-shadow-[0_3px_6px_rgb(0_0_0/0.35)]'
          : 'mix-blend-multiply dark:mix-blend-normal'
      }`}
    >
      {backed && <circle cx="50" cy="50" r="48.5" className="fill-card" />}
      <defs>
        <path id={`${id}-ring`} d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
        <filter id={`${id}-ink`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" result="rough" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.7"
            result="speckle"
          />
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ink)`} fill="currentColor" stroke="currentColor">
        <circle cx="50" cy="50" r="47" fill="none" strokeWidth="3" />
        <circle cx="50" cy="50" r="42.5" fill="none" strokeWidth="1" />
        <text
          fontSize={fontSize.toFixed(2)}
          fontWeight="800"
          stroke="none"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <textPath href={`#${id}-ring`} textLength="218" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <circle cx="50" cy="50" r="24" fill="none" strokeWidth="1.5" />
        {place === 1 ? (
          /* five-point star */
          <path
            stroke="none"
            d="M50 33.5l4.3 9.6 10.4 1.1-7.8 7 2.2 10.3L50 56.2l-9.1 5.3 2.2-10.3-7.8-7 10.4-1.1z"
          />
        ) : (
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fontSize="19"
            fontWeight="800"
            stroke="none"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.04em' }}
          >
            {place}
            <tspan fontSize="9" dy="-7.5" dx="0.5">
              ND
            </tspan>
          </text>
        )}
      </g>
    </svg>
  )
}

function Badge({ hack, tilt }: { hack: Hackathon; tilt: string }) {
  const url = hack.demo ?? hack.github
  const id = `stamp-${slug(hack.project)}`
  const links = [
    { href: hack.demo, label: 'live' },
    { href: hack.github, label: 'code' },
    { href: hack.post, label: 'post' },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href))

  return (
    <li className="badge-slot">
      <span aria-hidden className="badge-hook" />
      <div className="badge-hang" style={{ '--tilt': tilt } as CSSProperties}>
        <span aria-hidden className="badge-strap" />
        <span aria-hidden className="badge-clip" />

        <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-card px-3.5 pb-4 pt-4 shadow-[0_14px_30px_-18px_rgb(0_0_0/0.45)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
          {/* punched slot the clip goes through */}
          <span aria-hidden className="mx-auto block h-1.5 w-9 rounded-full bg-background shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)] ring-1 ring-border" />

          <div className="mt-3 min-h-[3.4rem]">
            <p className="text-[13px] font-medium leading-snug text-foreground">{hack.event}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hack.where} · {hack.date}
            </p>
            {hack.place && (
              <p className="sr-only">{hack.place === 1 ? 'Won this hackathon.' : 'Placed second.'}</p>
            )}
          </div>

          <div className="relative mt-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/70 bg-muted">
              <Image
                src={hack.image}
                alt={`Screenshot of ${hack.project}`}
                fill
                sizes="(max-width: 640px) 78vw, 210px"
                className="object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                style={{ objectPosition: hack.imagePosition ?? 'top' }}
              />
            </div>
            {hack.place && (
              <ResultStamp
                id={id}
                place={hack.place}
                label={`${hack.short} • ${hack.date.slice(-4)}`}
                backed={hack.imageDark}
              />
            )}
          </div>

          <h3 className="mt-4 text-[15px] font-medium text-foreground">
            {url ? (
              <Link href={url} target="_blank" rel="noopener noreferrer" className="outline-none">
                {/* stretched link: the whole badge opens the demo */}
                <span aria-hidden className="absolute inset-0 z-0 rounded-2xl" />
                {hack.project}
                <ArrowUpRight className="mb-0.5 ml-1 inline h-3.5 w-3.5 text-muted-foreground/60 transition-[translate,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ) : (
              hack.project
            )}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{hack.tagline}</p>
          {hack.track && <p className="mt-2 text-xs text-muted-foreground/80">{hack.track}</p>}

          <div className="mt-auto flex items-center gap-3 pt-4 font-mono text-[11px] text-muted-foreground/70">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 transition-colors hover:text-foreground"
              >
                {l.label} ↗
              </Link>
            ))}
          </div>
        </article>
      </div>
    </li>
  )
}

/**
 * Hackathon projects as conference badges hanging from one rail. Placings
 * get an ink stamp that lands when the row scrolls into view.
 */
export function HackathonBadges({ hackathons }: { hackathons: Hackathon[] }) {
  return (
    <BadgeRail label="Hackathon projects">
      {hackathons.map((hack, i) => (
        <Badge key={hack.project} hack={hack} tilt={TILTS[i % TILTS.length]} />
      ))}
    </BadgeRail>
  )
}
