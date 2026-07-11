import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { nowData } from '@/lib/now'
import { WritingList } from './writing-list'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Posts, notes, and learnings by Pallab Das: deep-dives on full-stack dev, AI, machine learning, and daily discoveries.',
}

function Timeline({ items }: { items: string[] }) {
  return (
    <div className="relative flex flex-col gap-4">
      <span
        aria-hidden
        className="absolute bottom-2 left-[2.5px] top-2 w-[1.5px] bg-muted-foreground/30"
      />
      {items.map((item) => (
        <div key={item} className="relative flex gap-4">
          <span className="z-10 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-foreground ring-4 ring-background" />
          <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
        </div>
      ))}
    </div>
  )
}

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 space-y-14">
      {/* ── Page header ── */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Writing</h1>
        <p className="text-sm text-muted-foreground">
          Notes from the workshop: a running log of building, learning, and thinking out loud
        </p>
        <p className="mt-1 text-xs text-muted-foreground/50">
          Last updated: <span className="text-muted-foreground/70">{nowData.lastUpdated}</span>
        </p>
      </header>

      {/* ── Learning ── */}
      <section>
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Currently learning
          </h2>
          <p className="text-sm text-muted-foreground">What I&apos;m exploring right now</p>
        </div>
        <Timeline items={nowData.learning} />
      </section>

      {/* ── Reading ── */}
      <section>
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Reading</h2>
          <p className="text-sm text-muted-foreground">What&apos;s open in the other tab</p>
        </div>
        <Timeline items={nowData.reading} />
      </section>

      {/* ── Posts ── */}
      <section>
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Posts and notes</h2>
          <p className="text-sm text-muted-foreground">Long-form write-ups and quick notes</p>
        </div>
        <WritingList posts={posts} />
      </section>
    </div>
  )
}
