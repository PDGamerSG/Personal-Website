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
  socials: {
    github: 'https://github.com/PDGamerSG',
    twitter: 'https://x.com/Pallab4249',
    linkedin: 'https://www.linkedin.com/in/das-pallab/',
  },
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
