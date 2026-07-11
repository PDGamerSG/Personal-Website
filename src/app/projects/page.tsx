import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects built by Pallab Das: web apps, tools, and experiments.',
}

const STATUS_LABEL: Record<string, string> = {
  'in-progress': 'in progress',
  research: 'research',
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <header className="mb-10 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Things I&apos;m crafting, recipes are on GitHub
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {projects.map((project) => {
          const url = project.demo ?? project.github
          const beats = project.highlights ?? project.description.split(/(?<=\.)\s+/)
          return (
            <div key={project.title}>
              {url ? (
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-2 text-[15px] font-medium text-foreground"
                >
                  {project.title}
                  <ArrowUpRight className="h-4 w-4 opacity-65 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              ) : (
                <p className="text-[15px] font-medium text-foreground">{project.title}</p>
              )}

              <div className="relative mt-4 flex flex-col gap-4">
                <span
                  aria-hidden
                  className="absolute bottom-2 left-[2.5px] top-2 w-[1.5px] bg-muted-foreground/30"
                />
                {beats.map((beat) => (
                  <div key={beat} className="relative flex gap-4">
                    <span className="z-10 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-foreground ring-4 ring-background" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{beat}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[22px] text-xs text-muted-foreground/60">
                <span>{project.tags.slice(0, 4).join(' · ')}</span>
                {STATUS_LABEL[project.status] && <span>{STATUS_LABEL[project.status]}</span>}
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    code ↗
                  </Link>
                )}
                {project.demo && (
                  <Link
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    live ↗
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
