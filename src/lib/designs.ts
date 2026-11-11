/** pretty., the separate site where the UI and WebGL design studies live. */
export const designSite = {
  name: 'pretty.',
  url: 'https://design.pallabdas.me/',
}

export interface DesignStudy {
  /** Route name on the design site, e.g. #/design/hum */
  slug: string
  name: string
  /** Study number and theme, as the design site labels it */
  number: string
  theme: string
  /** The study's own headline */
  line: string
  /** Screenshot, path under /public */
  image: string
}

export const designStudyUrl = (slug: string) => `${designSite.url}#/design/${slug}`

/** Picked so light and dark studies alternate along the reel. */
export const designStudies: DesignStudy[] = [
  { slug: 'hum', name: 'HUM', number: '01', theme: 'Neon', line: 'Your words, in glass.', image: '/designs/hum.webp' },
  { slug: 'aloft', name: 'Aloft', number: '04', theme: 'Flight', line: 'Go where the wind goes.', image: '/designs/aloft.webp' },
  { slug: 'horizon', name: 'Horizon', number: '02', theme: 'Bent light', line: 'Some things are better past the edge.', image: '/designs/horizon.webp' },
  { slug: 'solute', name: 'Solute', number: '08', theme: 'Light & glass', line: 'Not quite useful. Quite wonderful.', image: '/designs/solute.webp' },
  { slug: 'offair', name: 'Off–Air', number: '07', theme: 'Frequency', line: 'Radio for the restless.', image: '/designs/offair.webp' },
  { slug: 'nereid', name: 'Nereid', number: '10', theme: 'Living light', line: 'Life, beyond the surface.', image: '/designs/nereid.webp' },
  { slug: 'herbarium', name: 'Herbarium', number: '13', theme: 'Botany', line: 'Born from a fold. Grown from an idea.', image: '/designs/herbarium.webp' },
  { slug: 'bias', name: 'BIAS', number: '12', theme: 'Textile', line: 'Soft power. A whole new feeling.', image: '/designs/bias.webp' },
  { slug: 'elsewhere', name: 'Elsewhere', number: '11', theme: 'Journey', line: 'Somewhere is a place. Elsewhere is a feeling.', image: '/designs/elsewhere.webp' },
  { slug: 'chrome', name: 'Chrome', number: '23', theme: 'Form', line: 'One knot. Endless reflections.', image: '/designs/chrome.webp' },
  { slug: 'odd-assembly', name: 'ODD Assembly', number: '14', theme: 'Character', line: 'A gathering for beautifully unusual minds.', image: '/designs/odd-assembly.webp' },
  { slug: 'liquid', name: 'Liquid', number: '20', theme: 'Material', line: 'An impossible material. A living surface.', image: '/designs/liquid.webp' },
]
