# Personal Website

> 🌐 **Live:** <!-- add your URL here -->

My personal corner of the internet — a minimal, fast personal site where I write about what I'm building and learning, showcase projects, and share a bit about who I am.

---

## ✨ Features

- **MDX Blog** — write posts in `.md` or `.mdx`, push to deploy, shows up automatically
- **Dark / Light mode** — smooth animated theme toggle, defaults to dark
- **Fully static** — all pages pre-rendered at build time, fast everywhere
- **SEO ready** — Open Graph, Twitter cards, JSON-LD structured data, sitemap, robots.txt
- **Page transitions** — subtle fade + slide animation between routes
- **Responsive** — custom animated hamburger menu on mobile
- **GitHub Activity** — live contribution heatmap (no token required)
- **Typing Stats** — MonkeyType profile heatmap via API

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Content | MDX via [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) |
| Fonts | Fraunces · Plus Jakarta Sans · JetBrains Mono |
| Deployment | [Vercel](https://vercel.com) |
| Language | TypeScript |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── about/            # About + GitHub + Typing stats + Uses
│   ├── writing/          # Blog list + Learning/Reading + post [slug]
│   └── projects/         # Projects grid
├── components/
│   ├── header.tsx        # Sticky nav with animated mobile menu
│   ├── footer.tsx
│   ├── github-stats.tsx  # Live GitHub heatmap
│   └── monkeytype-stats.tsx
├── lib/
│   ├── posts.ts          # MDX post loader
│   ├── projects.ts       # Projects data
│   ├── now.ts            # Currently learning / reading / crafting
│   └── uses.ts           # Setup & tools
content/
└── posts/                # Your .md / .mdx blog posts go here
```

---

## ✍️ Adding a Blog Post

1. Create a new file in `content/posts/` — e.g. `my-post.md`
2. Add frontmatter at the top:

```md
---
title: "My Post Title"
description: "A short description shown in the listing."
date: "2026-03-01"
tags: ["nextjs", "web"]
type: "post"   # or "note" for short-form
---

Your content here...
```

3. Push to GitHub → Vercel auto-deploys → post appears on `/writing`

---

## 🚀 Running Locally

```bash
# 1. Clone
git clone https://github.com/PDGamerSG/Personal-Website.git
cd Personal-Website

# 2. Install
npm install

# 3. Set up env (optional — needed for MonkeyType stats)
cp .env.example .env.local
# Add MONKEYTYPE_API_KEY and NEXT_PUBLIC_SITE_URL

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full URL of your site e.g. `https://pallabdas.dev` |
| `MONKEYTYPE_API_KEY` | Optional | Enables typing heatmap on the About page |

---

## 📜 License

MIT — feel free to fork and make it your own. A credit back is appreciated but not required.
