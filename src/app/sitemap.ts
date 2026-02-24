import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/posts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // suppress unused variable warning
  void projects

  return [...staticPages, ...postPages]
}
