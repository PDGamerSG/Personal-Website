import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: string
  content: string
  featured?: boolean
  type: 'post' | 'note'
}

export type PostMeta = Omit<Post, 'content'>

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const { text } = readingTime(content)

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: (data.tags as string[]) || [],
        readingTime: text,
        featured: (data.featured as boolean) || false,
        type: (data.type as 'post' | 'note') || 'post',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
    const mdPath = path.join(postsDirectory, `${slug}.md`)
    const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const { text } = readingTime(content)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: (data.tags as string[]) || [],
      readingTime: text,
      featured: (data.featured as boolean) || false,
      type: (data.type as 'post' | 'note') || 'post',
      content,
    }
  } catch {
    return null
  }
}
