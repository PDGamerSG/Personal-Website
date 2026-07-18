import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import { ProjectIndex } from '@/components/project-index'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects built by Pallab Das: web apps, tools, and experiments.',
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

      <ProjectIndex projects={projects} />
    </div>
  )
}
