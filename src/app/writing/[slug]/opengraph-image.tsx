import { ImageResponse } from 'next/og'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { siteConfig } from '@/lib/seo'

export const alt = 'Writing by Pallab Das'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.title ?? 'Writing'
  const description = post?.description ?? siteConfig.shortDescription
  const date = post
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(120,119,198,0.28), transparent 45%), radial-gradient(circle at 85% 85%, rgba(56,189,248,0.18), transparent 45%)',
          padding: '72px',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', gap: 20, fontSize: 24, color: '#a1a1aa' }}>
          <div style={{ display: 'flex' }}>{siteConfig.url.replace('https://', '')}/writing</div>
          {date ? <div style={{ display: 'flex' }}>·</div> : null}
          {date ? <div style={{ display: 'flex' }}>{date}</div> : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? 60 : 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 28,
              color: '#a1a1aa',
              maxWidth: 950,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#d4d4d8' }}>
          {siteConfig.name} · {siteConfig.tagline}
        </div>
      </div>
    ),
    size,
  )
}
