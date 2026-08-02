import { getAllPosts } from '@/lib/posts'
import { siteConfig } from '@/lib/seo'
import type { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latestPost = posts[0] ? new Date(posts[0].date) : new Date()

  /**
   * The avatar is rendered through `next/image`, so the only URLs in the markup
   * are `/_next/image?url=…&w=…` variants. Listing the original here is what
   * gives Google Images a stable, canonical URL for the photo to index.
   */
  const portrait = `${siteUrl}/pfp.jpg`

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1,   images: [portrait] },
    { url: `${siteUrl}/writing`,  lastModified: latestPost, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${siteUrl}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, images: [portrait] },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...postPages]
}
