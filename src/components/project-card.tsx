import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/projects'

const STATUS: Record<Project['status'], { label: string; dot: string; pulse?: boolean }> = {
  completed: { label: 'shipped', dot: 'bg-emerald-500' },
  'in-progress': { label: 'in progress', dot: 'bg-amber-500', pulse: true },
  research: { label: 'research', dot: 'bg-violet-500' },
}

export function ProjectCard({ project }: { project: Project }) {
  const url = project.demo ?? project.github
  const status = STATUS[project.status]

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-medium leading-snug text-foreground">
          {url ? (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {/* stretched link: makes the whole card clickable without nesting links */}
              <span aria-hidden className="absolute inset-0 rounded-xl" />
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        {url && (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        )}
      </div>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-auto pt-4">
        <p className="font-mono text-[11px] tracking-tight text-muted-foreground/70">
          {project.tags.slice(0, 3).join(' · ')}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${status.dot} ${
                status.pulse ? 'animate-pulse motion-reduce:animate-none' : ''
              }`}
            />
            {status.label}
          </span>
          <span className="flex items-center gap-3">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 transition-colors hover:text-foreground"
              >
                code ↗
              </Link>
            )}
            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 transition-colors hover:text-foreground"
              >
                live ↗
              </Link>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
