import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

const socialLinks = [
  { href: 'https://github.com/PDGamerSG', label: 'GitHub', icon: Github },
  { href: 'https://twitter.com/Pallab4249', label: 'Twitter / X', icon: Twitter },
  { href: 'https://www.linkedin.com/in/das-pallab/', label: 'LinkedIn', icon: Linkedin },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/60">
            © {year} Pallab Das
          </p>
          <nav className="flex items-center gap-3" aria-label="Social links">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
