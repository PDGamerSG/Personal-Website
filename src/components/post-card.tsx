import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article>
      <Link
        href={`/posts/${post.slug}`}
        className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-card-foreground leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
          {post.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
