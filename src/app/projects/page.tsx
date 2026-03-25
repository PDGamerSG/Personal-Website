import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A collection of projects built by me Wanna explore click below',
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Building</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Things I'm crafting and receipes are available on github.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}
