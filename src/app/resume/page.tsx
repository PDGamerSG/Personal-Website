import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, ExternalLink } from 'lucide-react'
import { absoluteUrl, siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Pallab Das (@PDGamerSG) — full-stack and AI/ML developer, Software Engineering student at VIT Vellore. Read it here or download the PDF.',
  keywords: ['Pallab Das resume', 'Pallab Das CV', 'PDGamerSG resume'],
  alternates: { canonical: '/resume' },
  openGraph: {
    type: 'profile',
    url: absoluteUrl('/resume'),
    title: 'Resume — Pallab Das',
    description: 'Full-stack and AI/ML developer. Read the resume in the browser or download the PDF.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${absoluteUrl('/resume')}#webpage`,
  url: absoluteUrl('/resume'),
  name: 'Resume — Pallab Das',
  about: { '@id': `${siteConfig.url}/#person` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Resume', item: absoluteUrl('/resume') },
    ],
  },
}

const fileUrl = siteConfig.resumeFile

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Resume</h1>
        <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
          Full-Stack &amp; AI/ML Developer · Software Engineering student at VIT Vellore.
          Read it right here, or grab the PDF.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={fileUrl}
            download="Pallab-Das-Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <Link
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </Link>
        </div>
      </section>

      {/* Inline viewer — desktop/tablet, where browsers render PDFs reliably */}
      <div className="hidden overflow-hidden rounded-lg border border-border/60 bg-muted/20 sm:block">
        <object
          data={`${fileUrl}#view=FitH`}
          type="application/pdf"
          aria-label="Resume of Pallab Das"
          className="h-[min(80vh,1000px)] w-full"
        >
          <div className="p-8 text-center text-sm text-muted-foreground">
            Your browser can&apos;t display PDFs inline.{' '}
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              Open the resume
            </Link>{' '}
            instead.
          </div>
        </object>
      </div>

      {/* Mobile — inline PDF rendering is unreliable, so offer the file directly */}
      <div className="rounded-lg border border-border/60 bg-muted/20 p-6 text-center sm:hidden">
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          PDFs don&apos;t preview well on small screens. Open it full-screen for the best read.
        </p>
        <Link
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/60"
        >
          <ExternalLink className="h-4 w-4" /> View resume
        </Link>
      </div>
    </div>
  )
}
