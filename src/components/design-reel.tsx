import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { designStudies, designStudyUrl, type DesignStudy } from '@/lib/designs'

function Frame({ study, copy }: { study: DesignStudy; copy: boolean }) {
  return (
    <li className="reel-frame">
      <span aria-hidden className="reel-edge reel-edge-top">
        <span>
          Study {study.number} · {study.theme}
        </span>
        <span>▸ {study.number}A</span>
      </span>

      <Link
        href={designStudyUrl(study.slug)}
        target="_blank"
        rel="noopener noreferrer"
        className="reel-shot"
        // the second set only exists so the loop has no seam
        tabIndex={copy ? -1 : undefined}
      >
        <Image
          src={study.image}
          alt={copy ? '' : `${study.name}, a design study: ${study.line}`}
          fill
          sizes="(max-width: 640px) 208px, 256px"
          className="object-cover object-top"
        />
        <span className="reel-caption">
          <span className="flex items-center gap-1 text-[13px] font-medium leading-tight">
            {study.name}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </span>
          <span className="mt-0.5 block truncate text-[11px] leading-snug text-white/70">{study.line}</span>
        </span>
      </Link>

      <span aria-hidden className="reel-edge reel-edge-bottom">
        <span>{study.name}</span>
        <span>pretty.</span>
      </span>
    </li>
  )
}

/**
 * Screenshots of the design studies on a strip of film. On desktop it
 * drifts sideways and stops under the pointer; on phones you swipe it.
 */
export function DesignReel({ studies = designStudies }: { studies?: DesignStudy[] }) {
  return (
    <div className="reel" style={{ '--reel-duration': `${studies.length * 7}s` } as CSSProperties}>
      <div className="reel-track">
        <ul className="reel-set" aria-label="Design studies">
          {studies.map((study) => (
            <Frame key={study.slug} study={study} copy={false} />
          ))}
        </ul>
        <ul className="reel-set" aria-hidden>
          {studies.map((study) => (
            <Frame key={study.slug} study={study} copy />
          ))}
        </ul>
      </div>
    </div>
  )
}
