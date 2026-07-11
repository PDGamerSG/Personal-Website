'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1 w-fit">
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
        <p className="text-sm text-muted-foreground">Nothing here yet, check back soon.</p>
      ) : (
        <div className="divide-y divide-border/40">
          {filtered.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function PostRow({ post }: { post: PostMeta }) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const meta = [date, post.readingTime, post.type === 'note' ? 'note' : null, ...post.tags.slice(0, 3)]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link href={`/writing/${post.slug}`} className="group flex flex-col gap-1 py-4">
      <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
        {post.title}
      </span>
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.description}</p>
      <p className="mt-0.5 text-xs text-muted-foreground/60">{meta}</p>
    </Link>
  )
}
