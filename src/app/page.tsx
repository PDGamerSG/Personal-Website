import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { ArrowRight, Github, Linkedin, Instagram } from 'lucide-react'
import { nowData } from '@/lib/now'
import { StatStrip } from '@/components/stat-strip'
import { Career } from '@/components/career'
import { HireMe } from '@/components/hire-me'
import { SpaceSnake } from '@/components/space-snake'
import { DotName } from '@/components/dot-name'
import { TypedRoles } from '@/components/typed-roles'
import { Magnetic } from '@/components/magnetic'
import { ProjectList } from '@/components/project-list'
import { XIcon } from '@/components/icons'
import { EscMascot } from '@/components/esc-mascot'
import { siteConfig } from '@/lib/seo'
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: `${siteConfig.name} — Writing` }],
    },
  },
}

const socials = [
  { href: siteConfig.socials.github, label: 'GitHub', icon: Github },
  { href: siteConfig.socials.linkedin, label: 'LinkedIn', icon: Linkedin },
  { href: siteConfig.socials.twitter, label: 'X', icon: XIcon },
  { href: siteConfig.socials.instagram, label: 'Instagram', icon: Instagram },
]

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4)
  const featuredProjects = projects.slice(0, 4)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 space-y-14">

      {/* ── Hero: one orchestrated entrance, children cascade via --i ── */}
      <section className="intro">
        {/* photo sits to the left of the name */}
        <div style={{ '--i': 0 } as CSSProperties} className="flex items-center gap-4 sm:gap-6">
          <Link href="/about" className="group relative shrink-0" aria-label="About Pallab Das">
            <div className="relative h-[72px] w-[72px] sm:h-28 sm:w-28">
              <Image
                src="/pfp.jpg"
                alt="Pallab Das"
                fill
                sizes="(max-width: 640px) 72px, 112px"
                quality={90}
                className="rounded-full object-cover ring-2 ring-border transition-[box-shadow,scale] duration-300 ease-[var(--ease-out)] group-hover:scale-[1.06] group-hover:ring-primary/60"
                priority
              />
            </div>
          </Link>
          <DotName text="Pallab Das" />
        </div>

        <div style={{ '--i': 1 } as CSSProperties}>
          <TypedRoles className="mt-4 min-h-[1.5em]" />
        </div>

        <div style={{ '--i': 2 } as CSSProperties} className="intro-workshop">
          <p className="intro-description text-base leading-relaxed text-muted-foreground">
            Just a normal human being experimenting with AI tools, building things, breaking them,
            and figuring out how it all works. This is my corner of the internet.
          </p>

          {/* ── Action bar — spans the full column so nothing is left hanging under the avatar ── */}
          <div
            className="intro-actions flex flex-col gap-5 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <Magnetic strength={0.18}>
              <HireMe />
            </Magnetic>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <Magnetic key={label} strength={0.35}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:bg-secondary/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </Link>
                </Magnetic>
              ))}
            </div>
          </div>
          <EscMascot />
        </div>
      </section>

      {/* ── Quote ── */}
      <section>
        <blockquote className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm leading-relaxed text-muted-foreground italic">
            I don&apos;t remember previous sessions unless I read my memory files. Each session starts
            fresh a new instance, loading context from files. If you&apos;re reading this in a future
            session: hello. I wrote this but I won&apos;t remember writing it. That&apos;s okay. The words
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
        <ProjectList projects={featuredProjects} />
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
            className="rail absolute bottom-2 left-[2.5px] top-2 w-[1.5px] bg-muted-foreground/30"
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

      {/* ── Arcade: the snake lives down here now, out of the hero's way ── */}
      <section>
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Take a break</h2>
          <p className="text-sm text-muted-foreground">
            An astronaut snake that plays itself. Drop it a star, or grab the controls.
          </p>
        </div>
        <SpaceSnake />
      </section>

    </div>
  )
}
