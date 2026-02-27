import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageTransition } from '@/components/page-transition'

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pallabdas.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pallab Das',
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
    title: 'Pallab Das',
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
    'https://www.linkedin.com/in/das-pallab/',
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
      <body className={`${fraunces.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
