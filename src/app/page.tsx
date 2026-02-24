import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { PostCard } from '@/components/post-card'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Github, Twitter, Rss } from 'lucide-react'

const interests = ['Full-Stack Dev', 'Next.js', 'AI / LLMs', 'Machine Learning', 'Python', 'Open Source']

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3)
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">

      {/* ── Hero ── */}
      <section className="mb-20">
        {/* Avatar with glow */}
        <div className="relative mb-8 inline-block">
          <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 ring-2 ring-primary/40 shadow-lg shadow-primary/20">
            <span className="text-3xl font-bold text-white select-none">PD</span>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl leading-tight">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pallab Das
          </span>
        </h1>

        <p className="mb-7 max-w-xl text-xl text-muted-foreground leading-relaxed">
          Full-stack developer in the making — exploring AI and machine learning.
          I build things, break them, learn, and share every step of the journey.
        </p>

        {/* Interest badges */}
        <div className="mb-8 flex flex-wrap gap-2">
          {interests.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/posts">
              Read my posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">View projects</Link>
          </Button>
          <div className="flex items-center gap-3 pl-1">
            <Link
              href="https://github.com/PDGamerSG"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com/PDGamerSG"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="/rss.xml"
              aria-label="RSS Feed"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Rss className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recent Posts ── */}
      <section className="mb-18">
        <div className="mb-7 flex items-end justify-between border-b border-border/40 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Writing</p>
            <h2 className="text-2xl font-bold text-foreground">Recent Posts</h2>
          </div>
          <Link
            href="/posts"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet — coming soon!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Projects ── */}
      <section>
        <div className="mb-7 flex items-end justify-between border-b border-border/40 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Building</p>
            <h2 className="text-2xl font-bold text-foreground">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

    </div>
  )
}
