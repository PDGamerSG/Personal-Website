'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/projects'

const STATUS: Record<Project['status'], { label: string; dot: string; pulse?: boolean }> = {
  completed: { label: 'shipped', dot: 'bg-emerald-500' },
  'in-progress': { label: 'in progress', dot: 'bg-amber-500', pulse: true },
  research: { label: 'research', dot: 'bg-violet-500' },
}

/* Every project gets a deterministic gradient "cover" derived from its title,
   so the hover preview works without real screenshots. */
function hueOf(title: string) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360
  return h
}

function coverOf(title: string) {
  const h = hueOf(title)
  return `linear-gradient(135deg, oklch(0.78 0.1 ${h}) 0%, oklch(0.52 0.17 ${(h + 60) % 360}) 100%)`
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const preview = previewRef.current
    if (!container || !preview) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left + 28
    const y = e.clientY - rect.top - 64
    preview.style.transform = `translate(${x}px, ${y}px)`
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHovered(null)}
    >
      {/* floating cover that trails the cursor; decorative, desktop-only */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform pointer-fine:motion-safe:block"
      >
        <div
          className={`flex h-28 w-44 items-end justify-end overflow-hidden rounded-xl p-3 shadow-2xl shadow-black/25 transition-all duration-300 ${
            hovered !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          } ${hovered !== null && hovered % 2 === 1 ? 'rotate-2' : '-rotate-2'}`}
          style={hovered !== null ? { background: coverOf(projects[hovered].title) } : undefined}
        >
          <span className="font-display text-4xl font-bold leading-none text-white/30">
            {hovered !== null ? String(hovered + 1).padStart(2, '0') : ''}
          </span>
        </div>
      </div>

      <ol className="divide-y divide-border/70">
        {projects.map((project, i) => {
          const url = project.demo ?? project.github
          const status = STATUS[project.status]
          const blurb = project.highlights?.[0] ?? project.description.split(/(?<=\.)\s+/)[0]
          return (
            <li
              key={project.title}
              className="group relative py-5 first:pt-0 last:pb-0"
              onMouseEnter={() => setHovered(i)}
            >
              <div className="flex items-baseline gap-4">
                <span className="w-7 shrink-0 font-mono text-xs tabular-nums text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {url ? (
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                          {/* stretched link: whole row clickable without nesting links */}
                          <span aria-hidden className="absolute inset-0" />
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            {project.title}
                            <ArrowUpRight className="mb-0.5 ml-1 inline h-3.5 w-3.5 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary" />
                          </span>
                        </Link>
                      ) : (
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          {project.title}
                        </span>
                      )}
                    </h3>
                    <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot} ${
                          status.pulse ? 'animate-pulse motion-reduce:animate-none' : ''
                        }`}
                      />
                      {status.label}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{blurb}</p>

                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground/60">
                    {project.tags.slice(0, 4).join(' · ')}
                    {project.github && (
                      <>
                        {' · '}
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 transition-colors hover:text-foreground"
                        >
                          code ↗
                        </Link>
                      </>
                    )}
                    {project.demo && (
                      <>
                        {' · '}
                        <Link
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 transition-colors hover:text-foreground"
                        >
                          live ↗
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
