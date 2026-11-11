export interface Hackathon {
  project: string
  /** One sentence on what the project does, shown on the badge */
  tagline: string
  event: string
  /** Short event name printed around the result stamp */
  short: string
  /** City for in-person events, or Online */
  where: string
  date: string
  /** Shown under the event name, e.g. the track the project was entered in */
  track?: string
  /** Final placing, when the project placed: 1 for a win, 2 for second */
  place?: 1 | 2
  team: string
  tags: string[]
  /** Screenshot of the live demo, path under /public */
  image: string
  imagePosition?: string
  /** The screenshot is dark, so a result stamp needs a backing to stay readable */
  imageDark?: boolean
  demo?: string
  github?: string
  /** Announcement post for the result */
  post?: string
}

export const hackathons: Hackathon[] = [
  {
    project: 'Helium',
    tagline:
      'Turns meetings and email into one team memory that knows what is true now, who said it, and what it replaced.',
    event: 'Neo4j Graph Builder: Build Sprint',
    short: 'Build Sprint',
    where: 'Bengaluru',
    date: 'Oct 2026',
    place: 1,
    team: 'Team Vulcan',
    tags: ['Neo4j', 'FastAPI', 'Next.js', 'MCP'],
    image: '/projects/helium.webp',
    demo: 'https://helium.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/helium',
    post: 'https://lnkd.in/p/gM9XJbCR',
  },
  {
    project: 'On Record',
    tagline:
      'Transcribes a meeting live, tells the voices apart, and answers spoken questions with the line that backs them up.',
    event: 'Hacktoberfest Hack Day',
    short: 'Hack Day',
    where: 'Bengaluru',
    date: 'Oct 2026',
    track: 'Best use of Gemma 4',
    place: 1,
    team: 'Team Vulcan',
    tags: ['Gemma 4', 'Whisper', 'FalkorDB', 'Next.js'],
    image: '/projects/on-record.webp',
    imagePosition: '70% 30%',
    demo: 'https://onrecord.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/On-Record',
  },
  {
    project: 'BLR Air Window',
    tagline:
      'An agent that reads live AQI, PM2.5, rain and heat forecasts and finds the cleanest hour or two to head outside.',
    event: 'Stranger Builds Bangalore',
    short: 'Stranger Builds',
    where: 'Bengaluru',
    date: 'Oct 2026',
    place: 2,
    team: 'Team Vulcan',
    tags: ['Fetch.ai', 'uAgents', 'Python', 'Open-Meteo'],
    image: '/projects/blr-air.webp',
    imageDark: true,
    demo: 'https://blrairwindow.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/delhi-air',
  },
  {
    project: 'Minutes',
    tagline:
      'A company brain on FalkorDB that links meetings and email to decisions, then flags the work a changed decision touches.',
    event: 'FalkorDB Graph Hacks',
    short: 'Graph Hacks',
    where: 'Online',
    date: 'Oct 2026',
    track: 'Track 3, Company Brain',
    team: 'Team Vulcan',
    tags: ['FalkorDB', 'FastAPI', 'Next.js', 'Redis'],
    image: '/projects/minutes.webp',
    demo: 'https://minutes.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/minutes-falkordb',
  },
]

/** How a placing reads on the stamp. */
export const PLACE_LABEL: Record<NonNullable<Hackathon['place']>, string> = {
  1: 'Winner',
  2: 'Runner-up',
}
