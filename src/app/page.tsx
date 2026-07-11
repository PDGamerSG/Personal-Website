import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { ArrowRight, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react'
import { nowData } from '@/lib/now'
import { StatStrip } from '@/components/stat-strip'
import { Career } from '@/components/career'

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

      {/* ── Stat strip ── */}
      <StatStrip />

      {/* ── Projects ── */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Projects</h2>
            <p className="text-sm text-muted-foreground">Things I&apos;ve built and broken</p>
          </div>
          <Link href="/projects" className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            see all <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="flex flex-col gap-10">
          {featuredProjects.map((project) => {
            const url = project.demo ?? project.github
            const beats = project.highlights ?? [project.description]
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
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Career ── */}
      <Career />

      {/* ── Currently Learning ── */}
      <section>
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Currently learning</h2>
          <p className="text-sm text-muted-foreground">What I&apos;m exploring right now</p>
        </div>
        <div className="relative flex flex-col gap-4">
          <span
            aria-hidden
            className="absolute bottom-2 left-[2.5px] top-2 w-[1.5px] bg-muted-foreground/30"
          />
          {nowData.learning.map((item) => (
            <div key={item} className="relative flex gap-4">
              <span className="z-10 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-foreground ring-4 ring-background" />
              <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Writing ── */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Writing</h2>
            <p className="text-sm text-muted-foreground">Notes from the workshop</p>
          </div>
          <Link href="/writing" className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            see all <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing published yet, coming soon.</p>
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
