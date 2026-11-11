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
    project: 'Reporter-to-Release',
    tagline:
      'A bug desk that keeps the person who reported a bug involved until the fix works for them, with human review before every release.',
    event: 'Flip the Switch',
    short: 'Flip the Switch',
    where: 'Online',
    date: 'Nov 2026',
    team: 'Team Vulcan',
    tags: ['Next.js', 'Switch', 'AWS', 'TypeScript'],
    image: '/projects/reporter-to-release.webp',
    demo: 'https://reporter-to-release.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/Reporter-to-Release',
  },
  {
    project: 'SpecLens',
    tagline:
      'Checks a part photo against your spec, and remembers each correction a quality engineer makes so the next inspection cites it.',
    event: 'Hack With Bangalore 4.0',
    short: 'Hack With Bangalore',
    where: 'Bengaluru',
    date: 'Nov 2026',
    track: 'Agent memory with Hindsight',
    team: 'Team Vulcan',
    tags: ['Hindsight', 'FastAPI', 'React', 'Meta vision'],
    image: '/projects/speclens.webp',
    demo: 'https://speclens.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/speclens',
  },
  {
    project: 'Defect Forge',
    tagline:
      'Paints realistic defects onto photos of good parts, then measures the smallest flaw a vision inspector still catches.',
    event: 'Meta Global AI Developer Hackathon',
    short: 'Meta AI Hack',
    where: 'Online',
    date: 'Nov 2026',
    track: 'Indie track, Push the Frontier',
    team: 'Team Vulcan',
    tags: ['Muse Spark', 'Muse Image', 'SAM 3.1', 'Python'],
    image: '/projects/defect-forge.webp',
    imageDark: true,
    demo: 'https://defect-forge.vercel.app/',
    github: 'https://github.com/Hydra-Of-Malice/defect_forge',
  },
  {
    project: 'Kavach',
    tagline:
      'A seatbelt for AI agents: checks every tool call before it runs, so a poisoned web page cannot spend money or leak personal data.',
    event: "HackIndia AgentVerse '26",
    short: 'AgentVerse',
    where: 'Online',
    date: 'Nov 2026',
    track: 'Supported by OpenAI',
    team: 'Team Vulcan',
    tags: ['OpenAI Agents SDK', 'MCP', 'Python'],
    image: '/projects/kavach.webp',
    imageDark: true,
    demo: 'https://kavach.pallabdas.me/',
  },
  {
    project: 'DealerWatch',
    tagline:
      'Joins dealer-desk calls, trades and account links into a front-running case file that a compliance reviewer can defend.',
    event: 'HackIn Drive 2026',
    short: 'HackIn Drive',
    where: 'Online',
    date: 'Oct 2026',
    track: 'National final-year project competition',
    team: 'Team Vulcan',
    tags: ['FastAPI', 'SQLite', 'React', 'Vite'],
    image: '/projects/dealerwatch.webp',
    imageDark: true,
    demo: 'https://dealerwatch.vercel.app/',
    github: 'https://github.com/PDGamerSG/dealerwatch',
  },
  {
    project: 'Untangle',
    tagline:
      'Answers why the code is like this, tracing a value back to the commit, review or handover call that decided it.',
    event: 'hackFront India 2026',
    short: 'hackFront',
    where: 'Online',
    date: 'Oct 2026',
    track: 'Finale, Neo4j and Sarvam tracks',
    team: 'Team Vulcan',
    tags: ['Neo4j', 'Sarvam', 'Python'],
    image: '/projects/untangle.webp',
    imageDark: true,
    demo: 'https://untangle.pallabdas.me/',
    github: 'https://github.com/PDGamerSG/Untangle',
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
