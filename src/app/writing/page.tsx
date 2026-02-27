import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { nowData } from '@/lib/now'
import { WritingList } from './writing-list'
import { GraduationCap, BookOpen } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Posts, notes, and learnings by Pallab Das — deep-dives on full-stack dev, AI, machine learning, and daily discoveries.',
}

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-8">

      {/* ── Page header ── */}
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Writing</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">From the Workshop</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Posts, notes, and what I'm working on — a running log of building, learning, and thinking out loud.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/50">
          Last updated: <span className="text-muted-foreground/70">{nowData.lastUpdated}</span>
        </p>
      </header>
      <section>
        {/* Learning */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            Learning
          </h3>
          <ul className="space-y-3">
            {nowData.learning.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="mb-8" />

        {/* Reading */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Reading
          </h3>
          <ul className="space-y-3">
            {nowData.reading.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border/40" />

      {/* ── Posts ── */}
      <section>
        <div className="mb-6">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Posts & Notes</h2>
          <p className="text-xs text-muted-foreground/60">Long-form write-ups and quick notes.</p>
        </div>
        <WritingList posts={posts} />
      </section>

    </div>
  )
}
