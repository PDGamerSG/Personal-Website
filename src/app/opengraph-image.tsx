import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/seo'

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori has no filesystem access, so the avatar is inlined as a data URI.
 * Reading it at render time (rather than importing) keeps the file the single
 * source of truth shared with the `/pfp.jpg` the pages and JSON-LD point at.
 */
async function avatarDataUri() {
  const bytes = await readFile(join(process.cwd(), 'public', 'pfp.jpg'))
  return `data:image/jpeg;base64,${bytes.toString('base64')}`
}

export default async function OpenGraphImage() {
  const avatar = await avatarDataUri()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(120,119,198,0.28), transparent 45%), radial-gradient(circle at 85% 85%, rgba(56,189,248,0.18), transparent 45%)',
          padding: '72px',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 2, color: '#a1a1aa' }}>
          {siteConfig.url.replace('https://', '')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <img
            src={avatar}
            width={260}
            height={260}
            alt={siteConfig.name}
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              objectFit: 'cover',
              border: '4px solid rgba(250,250,250,0.14)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
              {siteConfig.name}
            </div>
            <div style={{ display: 'flex', marginTop: 12, fontSize: 34, color: '#d4d4d8' }}>
              {siteConfig.tagline}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                fontSize: 24,
                color: '#a1a1aa',
                maxWidth: 560,
                lineHeight: 1.4,
              }}
            >
              {siteConfig.shortDescription}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#71717a' }}>
          <div style={{ display: 'flex' }}>github.com/{siteConfig.handle}</div>
          <div style={{ display: 'flex' }}>·</div>
          <div style={{ display: 'flex' }}>{siteConfig.twitter}</div>
        </div>
      </div>
    ),
    size,
  )
}
