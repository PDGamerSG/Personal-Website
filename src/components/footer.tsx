import Link from 'next/link'
import { Github, Twitter, Rss } from 'lucide-react'

const socialLinks = [
  {
    href: 'https://github.com/PDGamerSG',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://twitter.com/PDGamerSG',
    label: 'Twitter / X',
    icon: Twitter,
  },
  {
    href: '/rss.xml',
    label: 'RSS Feed',
    icon: Rss,
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between md:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} Pallab Das. Built with Next.js & Tailwind CSS.
        </p>
        <nav className="flex items-center gap-3" aria-label="Social links">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
