import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

const shotClass =
  'object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover/cover:scale-[1.04]'

/**
 * Screenshot of the project, swapped for its dark-theme capture in dark mode,
 * or a dot-matrix monogram when there is no screenshot yet.
 */
function Cover({ project, href }: { project: Project; href?: string }) {
  const position = { objectPosition: project.imagePosition ?? 'top' }
  const inner = project.image ? (
    <>
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 200px"
        className={cn(shotClass, project.imageDark && 'dark:hidden')}
        style={position}
      />
      {project.imageDark && (
        <Image
          src={project.imageDark}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          className={cn(shotClass, 'hidden dark:block')}
          style={position}
        />
      )}
    </>
  ) : (
    <div
      className="flex h-full w-full items-center justify-center bg-muted/60"
      style={{
        backgroundImage:
          'radial-gradient(circle, color-mix(in oklch, var(--muted-foreground) 35%, transparent) 1px, transparent 1.5px)',
        backgroundSize: '10px 10px',
      }}
    >
      <span className="font-display text-3xl font-semibold text-muted-foreground/70">
        {project.title.charAt(0)}
      </span>
    </div>
  )

  const frame = cn(
    'group/cover relative block aspect-[16/10] w-full shrink-0 self-start overflow-hidden rounded-lg border border-border/70 bg-card',
    'shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)] sm:w-[200px]',
  )

  // the title link is the accessible one; the cover is a duplicate mouse target
  return href ? (
    <Link href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden className={frame}>
      {inner}
    </Link>
  ) : (
    <div aria-hidden className={frame}>
      {inner}
    </div>
  )
}

/**
 * Homepage project timeline: each project pairs its story beats with a real
 * screenshot, so the section shows the work instead of only describing it.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-12">
      {projects.map((project) => {
        const url = project.demo ?? project.github
        const beats = project.highlights ?? [project.description]
        return (
          <article key={project.title} className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-7">
            <Cover project={project} href={url} />

            <div className="min-w-0 flex-1">
              {url ? (
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-1.5 text-[15px] font-medium text-foreground"
                >
                  <span className="bg-linear-to-r from-primary to-primary bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-px transition-[background-size] duration-300 ease-[var(--ease-out)] group-hover:bg-[length:100%_1.5px]">
                    {project.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-65 transition-[translate,opacity] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ) : (
                <p className="text-[15px] font-medium text-foreground">{project.title}</p>
              )}

              <div className="relative mt-3.5 flex flex-col gap-3">
                <span
                  aria-hidden
                  className="rail absolute bottom-2 left-[2.5px] top-2 w-[1.5px] bg-muted-foreground/30"
                />
                {beats.map((beat) => (
                  <div key={beat} className="relative flex gap-4">
                    <span className="z-10 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-foreground ring-4 ring-background" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{beat}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
