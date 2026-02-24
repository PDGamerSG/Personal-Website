import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pallab Das — Full-Stack & AI/ML Developer',
    template: '%s | Pallab Das',
  },
  description:
    'Personal website of Pallab Das (@PDGamerSG) — sharing learnings in full-stack development, AI, and machine learning.',
  keywords: ['Pallab Das', 'PDGamerSG', 'full-stack developer', 'AI', 'machine learning', 'Next.js', 'Python'],
  authors: [{ name: 'Pallab Das', url: siteUrl }],
  creator: 'Pallab Das',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Pallab Das',
    title: 'Pallab Das — Full-Stack & AI/ML Developer',
    description:
      'Personal website of Pallab Das — sharing learnings in full-stack development, AI, and machine learning.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pallab Das — Full-Stack & AI/ML Developer',
    description: 'Sharing learnings in full-stack dev, AI, and machine learning.',
    creator: '@PDGamerSG',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  alternates: {
    canonical: siteUrl,
    types: { 'application/rss+xml': `${siteUrl}/rss.xml` },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pallab Das',
  url: siteUrl,
  sameAs: [
    'https://github.com/PDGamerSG',
    'https://twitter.com/PDGamerSG',
  ],
  jobTitle: 'Full-Stack & AI/ML Developer',
  description:
    'Learning full-stack development, AI, and machine learning. Building projects and sharing what I learn.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
