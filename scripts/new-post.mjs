#!/usr/bin/env node
/**
 * new-post.mjs
 * Usage: npm run new-post "Your Post Title"
 *
 * Creates a new MDX file in content/posts/ with today's date and boilerplate frontmatter.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const title = args.join(' ').trim()

if (!title) {
  console.error('\n❌  Please provide a title.')
  console.error('   Usage: npm run new-post "Your Post Title"\n')
  process.exit(1)
}

// Build slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

const today = new Date().toISOString().split('T')[0]
const filePath = path.join(root, 'content', 'posts', `${slug}.mdx`)

if (fs.existsSync(filePath)) {
  console.error(`\n❌  Post already exists: content/posts/${slug}.mdx\n`)
  process.exit(1)
}

const template = `---
title: "${title}"
date: "${today}"
description: "Add a short one-line description here (shown in listings and SEO)"
tags: ["Tag1", "Tag2"]
type: "post"
featured: false
---

Write your introduction here. This first paragraph appears as the lead-in.

## Section Heading

Your content here. Use **bold**, *italic*, or \`inline code\`.

## Code Example

\`\`\`typescript
// your code here
const greeting = "Hello, world!"
console.log(greeting)
\`\`\`

## Conclusion

Wrap up your post here.
`

fs.writeFileSync(filePath, template, 'utf8')

console.log(`
✅  Post created!

📄  File  : content/posts/${slug}.mdx
📝  Edit  : Open the file and fill in your content.
🚀  Done  : Save the file — it will appear on /writing automatically.

  type: "post"  → full article with its own page
  type: "note"  → short note, shows inline in the list
`)
