'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Lightbulb } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

type Filter = 'all' | 'post' | 'note'

export function WritingList({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.type === filter)

  const counts = {
    all: posts.length,
    post: posts.filter((p) => p.type === 'post').length,
    note: posts.filter((p) => p.type === 'note').length,
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all',  label: 'All'   },
    { id: 'post', label: 'Posts' },
    { id: 'note', label: 'Notes' },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1 w-fit">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
            <span className={`text-xs tabular-nums ${filter === id ? 'text-primary' : 'text-muted-foreground/60'}`}>
              {counts[id]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Nothing here yet — check back soon!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((post) =>
            post.type === 'note' ? (
              <NoteCard key={post.slug} post={post} />
            ) : (
              <PostCard key={post.slug} post={post} />
            )
          )}
        </div>
      )}
    </div>
  )
}

function PostCard({ post }: { post: PostMeta }) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group block rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1.5 text-base font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />{date}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />{post.readingTime}
        </span>
        {post.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
        ))}
      </div>
    </Link>
  )
}

function NoteCard({ post }: { post: PostMeta }) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-border/40 bg-card/50 px-5 py-4 transition-all hover:border-primary/30 hover:bg-card"
    >
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <div className="flex-1 min-w-0">
        <h2 className="mb-1 text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />{date}
          </span>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
