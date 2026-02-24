import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Wrench, CheckCircle2, FlaskConical } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  completed: { label: 'Completed', icon: CheckCircle2, className: 'text-emerald-500' },
  'in-progress': { label: 'In Progress', icon: Wrench, className: 'text-amber-500' },
  research: { label: 'Research', icon: FlaskConical, className: 'text-violet-500' },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status]
  const StatusIcon = status.icon

  return (
    <article className="group flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Status badge */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${status.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-base font-semibold leading-snug text-card-foreground">
        {project.title}
      </h2>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-1 border-t border-border/40">
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        )}
        {project.demo && (
          <Link
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </Link>
        )}
      </div>
    </article>
  )
}
