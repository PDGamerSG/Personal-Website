import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

const statusDot: Record<Project['status'], string> = {
  completed: 'bg-emerald-500',
  'in-progress': 'bg-amber-500',
  research: 'bg-violet-500',
}

const statusLabel: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  research: 'Research',
}

const MAX_TAGS = 3

export function ProjectCard({ project }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, MAX_TAGS)
  const extraTags = project.tags.length - MAX_TAGS

  return (
    <article className="group flex flex-col gap-2.5 rounded-lg border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      {/* Header row: title + links */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold leading-snug text-card-foreground">
          {project.title}
        </h2>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              title="Live demo"
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Description — 2 lines max */}
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {/* Footer: tags + status dot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{extraTags}
            </span>
          )}
        </div>
        <span
          className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground/70"
          title={statusLabel[project.status]}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[project.status]}`} />
          {statusLabel[project.status]}
        </span>
      </div>
    </article>
  )
}
