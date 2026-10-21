export interface Hackathon {
  project: string
  /** One sentence on what the project does, shown on the badge */
  tagline: string
  event: string
  /** Short event name printed around the winner stamp */
  short: string
  /** City for in-person events, or Online */
  where: string
  date: string
  /** Shown under the event name, e.g. the track the project was entered in */
  track?: string
  won: boolean
  team: string
  tags: string[]
  /** Screenshot of the live demo, path under /public */
  image: string
  imagePosition?: string
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
    won: true,
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
    won: true,
    team: 'Team Vulcan',
    tags: ['Gemma 4', 'Whisper', 'FalkorDB', 'Next.js'],
    image: '/projects/on-record.webp',
    imagePosition: '70% 30%',
    demo: 'https://onrecord.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/On-Record',
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
    won: false,
    team: 'Team Vulcan',
    tags: ['FalkorDB', 'FastAPI', 'Next.js', 'Redis'],
    image: '/projects/minutes.webp',
    demo: 'https://minutes.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/minutes-falkordb',
  },
]
