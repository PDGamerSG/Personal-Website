import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.dev'

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: 'Pallab Das' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Pallab Das'],
      url: `${siteUrl}/writing/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `${siteUrl}/writing/${post.slug}` },
  }
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.dev'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Pallab Das',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Pallab Das',
    },
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {/* Back link */}
        <Link
          href="/writing"
          className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Writing
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl leading-tight">
            {post.title}
          </h1>
          <p className="mb-5 text-lg text-muted-foreground leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            {post.type !== 'note' && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Separator className="mb-10" />

        {/* MDX Content */}
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:border-border">
          <MDXRemote source={post.content} />
        </div>

        <Separator className="mt-12 mb-8" />

        {/* Footer nav */}
        <div className="flex justify-between">
          <Link
            href="/writing"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Writing
          </Link>
        </div>
      </article>
    </>
  )
}
