import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects built by Pallab Das: web apps, tools, and experiments.',
}

const STATUS: Record<Project['status'], { label: string; dot: string; pulse?: boolean }> = {
  completed: { label: 'shipped', dot: 'bg-emerald-400' },
  'in-progress': { label: 'in progress', dot: 'bg-amber-400', pulse: true },
  research: { label: 'research', dot: 'bg-violet-400' },
}

function StatusChip({ status }: { status: Project['status'] }) {
  const s = STATUS[status]
  return (
    <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
      <span
        className={`h-1.5 w-1.5 rounded-full ${s.dot} ${
          s.pulse ? 'animate-pulse motion-reduce:animate-none' : ''
        }`}
      />
      {s.label}
    </span>
  )
}

function FeaturedCard({ project, hero = false }: { project: Project; hero?: boolean }) {
  const url = project.demo ?? project.github
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${
        hero ? 'sm:col-span-2' : ''
      }`}
    >
      {/* cover: real screenshot of the live project */}
      <div className={`relative overflow-hidden border-b border-border/60 ${hero ? 'h-44 sm:h-52' : 'h-32'}`}>
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes={hero ? '(max-width: 640px) 100vw, 640px' : '(max-width: 640px) 100vw, 320px'}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: project.imagePosition ?? 'top' }}
          />
        ) : (
          <div
            className="flex h-full items-center justify-center bg-muted"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          >
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
              $ building in private, demo soon
            </span>
          </div>
        )}
        <StatusChip status={project.status} />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-medium text-foreground ${hero ? 'text-lg' : 'text-[15px]'}`}>
          {url ? (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {/* stretched link: whole card clickable without nesting links */}
              <span aria-hidden className="absolute inset-0 z-10" />
              {project.title}
              <ArrowUpRight className="mb-0.5 ml-1.5 inline h-4 w-4 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className={`mt-1.5 text-sm leading-relaxed text-muted-foreground ${hero ? '' : 'line-clamp-2'}`}>
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-3.5 font-mono text-[11px] text-muted-foreground/60">
          <span className="truncate">{project.tags.slice(0, hero ? 5 : 3).join(' · ')}</span>
          <span className="flex shrink-0 items-center gap-3">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 transition-colors hover:text-foreground"
              >
                code ↗
              </Link>
            )}
            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 transition-colors hover:text-foreground"
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

function CompactRow({ project }: { project: Project }) {
  const url = project.demo ?? project.github
  const s = STATUS[project.status]
  return (
    <li className="group relative py-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-medium text-foreground">
          {url ? (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <span aria-hidden className="absolute inset-0" />
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                {project.title}
                <ArrowUpRight className="mb-0.5 ml-1 inline h-3.5 w-3.5 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary" />
              </span>
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`h-1.5 w-1.5 rounded-full ${s.dot} ${
              s.pulse ? 'animate-pulse motion-reduce:animate-none' : ''
            }`}
          />
          {s.label}
        </span>
      </div>
      <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground/60">
        {project.tags.slice(0, 4).join(' · ')}
      </p>
    </li>
  )
}

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <header className="mb-10 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Things I&apos;m crafting, recipes are on GitHub
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((project, i) => (
          <FeaturedCard key={project.title} project={project} hero={i === 0} />
        ))}
      </div>

      <section className="mt-14">
        <div className="mb-2 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">More experiments</h2>
          <p className="text-sm text-muted-foreground">Smaller builds and learning projects</p>
        </div>
        <ul className="divide-y divide-border/70">
          {rest.map((project) => (
            <CompactRow key={project.title} project={project} />
          ))}
        </ul>
      </section>
    </div>
  )
}
