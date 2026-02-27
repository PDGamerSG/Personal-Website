import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A collection of projects built by me Wanna explore click below',
}

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Building</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Things I'm crafting and receipes are available on github.
        </p>
      </header>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Featured
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Other Projects
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
