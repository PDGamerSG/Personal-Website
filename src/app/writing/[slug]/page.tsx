import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { absoluteUrl, siteConfig } from '@/lib/seo'

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

  const url = absoluteUrl(`/writing/${post.slug}`)

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      tags: post.tags,
      authors: [siteConfig.name],
      siteName: siteConfig.name,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: siteConfig.twitter,
    },
    alternates: { canonical: url },
  }
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const url = absoluteUrl(`/writing/${post.slug}`)
  const wordCount = post.content.trim().split(/\s+/).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    keywords: post.tags.join(', '),
    wordCount,
    image: `${url}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': `${absoluteUrl('/writing')}#blog` },
    author: { '@id': `${siteConfig.url}/#person` },
    publisher: { '@id': `${siteConfig.url}/#person` },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Writing', item: absoluteUrl('/writing') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
