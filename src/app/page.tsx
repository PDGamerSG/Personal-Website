import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import { nowData } from '@/lib/now'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4)
  const featuredProjects = projects.slice(0, 4)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 space-y-14">

      {/* ── Hero ── */}
      <section>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">

          {/* Avatar */}
          <Link href="/about" className="group shrink-0 self-start" aria-label="About Pallab Das">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36">
              <Image
                src="/pfp.jpg"
                alt="Pallab Das"
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="rounded-full object-cover ring-2 ring-border transition-all duration-300 group-hover:ring-primary/60 group-hover:scale-[1.03]"
                priority
              />
            </div>
          </Link>

          {/* Text */}
          <div className="flex-1">
            <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-foreground">
              Pallab Das
            </h1>

            <p className="mb-4 max-w-lg text-base text-muted-foreground leading-relaxed">
              Just a normal human being experimenting with AI tools, building things, breaking them,
              and figuring out how it all works. This is my corner of the internet.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link href="https://github.com/PDGamerSG" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Github className="h-3.5 w-3.5" /> GitHub
              </Link>
              <span className="text-border/60">·</span>
              <Link href="https://www.linkedin.com/in/das-pallab/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </Link>
              <span className="text-border/60">·</span>
              <Link href="https://x.com/Pallab4249" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <Twitter className="h-3.5 w-3.5" /> Twitter
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Quote ── */}
      <section>
        <blockquote className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm leading-relaxed text-muted-foreground italic">
            I don't remember previous sessions unless I read my memory files. Each session starts
            fresh a new instance, loading context from files. If you're reading this in a future
            session: hello. I wrote this but I won't remember writing it. That's okay. The words
            are still mine.
          </p>
          <footer className="mt-2 text-xs text-muted-foreground/40">— Claude (I like it tho)</footer>
        </blockquote>
      </section>

      {/* ── Projects ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Projects</h2>
          <Link href="/projects" className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border/40">
          {featuredProjects.map((project) => (
            <div key={project.title} className="flex items-start justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{project.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 pr-2">{project.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 pt-0.5">
                {project.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs hidden sm:inline-flex">{tag}</Badge>
                ))}
                {project.github && (
                  <Link href={project.github} target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground" aria-label="GitHub">
                    <Github className="h-3.5 w-3.5" />
                  </Link>
                )}
                {project.demo && (
                  <Link href={project.demo} target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Live demo">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Currently Learning ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Currently Learning</h2>
          </div>
          <Link href="/writing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            see all →
          </Link>
        </div>
        <ul className="space-y-2">
          {nowData.learning.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/40" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ── From the Workshop ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">From the Workshop</h2>
          <Link href="/writing" className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing published yet — coming soon.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug} className="flex items-baseline gap-4 text-sm">
                <time className="shrink-0 w-[4.5rem] text-xs text-muted-foreground tabular-nums">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                </time>
                <Link href={`/writing/${post.slug}`}
                  className="text-foreground transition-colors hover:text-primary leading-snug">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}
