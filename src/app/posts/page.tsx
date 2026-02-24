import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/post-card'

export const metadata: Metadata = {
  title: 'Posts',
  description:
    'Writings by Pallab Das on full-stack development, AI, machine learning, and the developer journey.',
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Writing</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">Posts</h1>
        <p className="text-lg text-muted-foreground">
          Learning in public — notes, tutorials, and reflections on full-stack dev, AI, and machine learning.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — stay tuned!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
