import type { Metadata } from 'next'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { GitHubStats } from '@/components/github-stats'
import { MonkeyTypeStats } from '@/components/monkeytype-stats'
import { usesData } from '@/lib/uses'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Pallab Das — developer, AI tinkerer. Skills, setup, GitHub activity, and typing stats.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      {/* Header */}
      <section className="mb-12">
        <div className="mb-6 relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-border">
          <Image src="/pfp.jpg" alt="Pallab Das" fill sizes="80px" className="object-cover" priority />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Pallab Das</h1>
        <p className="mb-1 font-mono text-sm text-muted-foreground">@PDGamerSG</p>
        <div className="mb-6 max-w-lg space-y-3 text-base text-muted-foreground leading-relaxed">
          <p>
            Sup, I'm Pallab, a Software Engineering student at VIT, Vellore, who spends way too much time crafting
            things on the internet. I got into dev because I wanted to make stuff people actually use,
            and I've been trying since then
          </p>
          <p>
            Right now I'm into development, machine learning and also starting Web 3. Outside of code: I do daily typing practice on MonkeyType that's my hobby yaa i like it tho<br />
            btw enjoying this time with a cup of coffee ☕
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href="https://github.com/PDGamerSG" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Github className="h-4 w-4" /> PDGamerSG
          </Link>
          <span className="text-border/60">·</span>
          <Link href="https://www.linkedin.com/in/das-pallab/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Link>
          <span className="text-border/60">·</span>
          <Link href="https://x.com/Pallab4249" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Twitter className="h-4 w-4" /> @Pallab4249
          </Link>
        </div>
      </section>

      <Separator className="mb-12" />

      {/* GitHub Stats */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-foreground">GitHub Activity (Will improve with time)</h2>
        <GitHubStats />
      </section>

      <Separator className="mb-12" />

      {/* Typing Practice */}
      <MonkeyTypeStats />
      <Separator className="mb-12" />

      {/* Uses / Setup */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold text-foreground">Setup & Tools</h2>
        <p className="mb-8 text-sm text-muted-foreground">
          My daily toolkit hardware, editor, stack, and AI tools.
        </p>
        <div className="space-y-10">
          {usesData.map((category) => (
            <div key={category.title}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{category.icon}</span>
                {category.title}
              </h3>
              <ul className="space-y-4">
                {category.items.map((item) => (
                  <li key={item.name}
                    className="grid grid-cols-1 gap-0.5 border-b border-border/30 pb-4 last:border-0 last:pb-0 sm:grid-cols-[160px_1fr] sm:gap-4">
                    <div>
                      {item.url ? (
                        <Link href={item.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">
                          {item.name}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
