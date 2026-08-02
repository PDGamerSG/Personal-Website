export const siteConfig = {
  name: 'Pallab Das',
  handle: 'PDGamerSG',
  jobTitle: 'Full-Stack & AI/ML Developer',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.me').replace(/\/$/, ''),
  tagline: 'Full-Stack & AI/ML Developer',
  description:
    'Pallab Das (@PDGamerSG) — full-stack and AI/ML developer, Software Engineering student at VIT Vellore. Projects, writing, and notes on web development, machine learning, and Web3.',
  shortDescription:
    'Full-stack and AI/ML developer. Building things, breaking them, and writing about it.',
  locale: 'en_US',
  twitter: '@Pallab4249',
  /** Contact address behind the "Hire me" button. */
  email: 'pallab4586das@gmail.com',
  socials: {
    github: 'https://github.com/PDGamerSG',
    twitter: 'https://x.com/Pallab4249',
    linkedin: 'https://www.linkedin.com/in/das-pallab/',
    instagram: 'https://www.instagram.com/pallabdas_pd/',
  },
  /** Resume links always open this absolute URL in a new tab. */
  resume: 'https://pallabdas.me/Pallab-Das-Resume.pdf',
  /** Site-relative path of the same file (served from /public). */
  resumeFile: '/Pallab-Das-Resume.pdf',
  keywords: [
    'Pallab Das',
    'PDGamerSG',
    'Pallab Das developer',
    'Pallab Das portfolio',
    'full-stack developer',
    'AI developer',
    'machine learning',
    'Next.js developer',
    'React developer',
    'VIT Vellore',
    'software engineering student',
    'web3 developer',
  ],
} as const

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/') {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Standard `mailto:` link. Only fires if the visitor has a mail handler
 * registered with the OS or browser — on a machine with none, the click is a
 * no-op, which is why the "Hire me" CTA copies the address before offering it.
 */
export function mailtoUrl(subject?: string) {
  return `mailto:${siteConfig.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
}

/**
 * The URL Gmail registers as its own `mailto:` protocol handler. It opens the
 * inbox with the small *docked* compose popup prefilled — unlike `view=cm&fs=1`,
 * which takes over the tab with the standalone full-page composer.
 */
export function gmailComposeUrl(subject?: string) {
  return `https://mail.google.com/mail/?extsrc=mailto&url=${encodeURIComponent(mailtoUrl(subject))}`
}
