export interface Project {
  title: string
  description: string
  /** Short story beats shown on the homepage timeline; falls back to description */
  highlights?: string[]
  tags: string[]
  github?: string
  demo?: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'research'
}

export const projects: Project[] = [
{
    title: 'Centralized Exchange',
    description:
    'A centralized crypto exchange inspired by Backpack Exchange. Covers the full trading experience: live markets, order book, candlestick charts, and a fast trading UI. In active development.',
    highlights: [
      'A centralized crypto exchange inspired by Backpack Exchange, built with Next.js and TypeScript.',
      'Covers the full trading experience: live markets, order book, candlestick charts, and a fast trading UI.',
      'In active development and my current main focus.',
    ],
    tags: ['TypeScript', 'Next.js', 'Crypto', 'Trading', 'Full-Stack'],
    featured: true,
    status: 'in-progress',
},
{
    title: 'Exciladraw',
    description:
    'A collaborative whiteboard and drawing tool in the spirit of Excalidraw. Built as a Turborepo monorepo with multiple Next.js apps and a shared component library, fully typed in TypeScript.',
    highlights: [
      'A collaborative whiteboard and drawing tool in the spirit of Excalidraw.',
      'Structured as a Turborepo monorepo: multiple Next.js apps sharing one component library, fully typed in TypeScript.',
    ],
    tags: ['TypeScript', 'Next.js', 'Turborepo', 'Whiteboard', 'Canvas'],
    github: 'https://github.com/PDGamerSG/Exciladraw',
    demo: 'https://exciladraw.pallabdas.me/',
    featured: true,
    status: 'in-progress',
},
{
    title: 'Zapier',
    description:
    'An automation platform inspired by Zapier. Wire services together into automated workflows through a visual builder backed by a custom hooks system, all in TypeScript.',
    highlights: [
      'An automation platform inspired by Zapier for wiring services together into workflows.',
      'A visual builder on the frontend, backed by a custom hooks system, all in TypeScript.',
    ],
    tags: ['TypeScript', 'Automation', 'Full-Stack'],
    github: 'https://github.com/PDGamerSG/Zapier',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Git Pusher Application',
    description:
    'A utility that turns the repetitive commit-and-push routine into a couple of clicks. Stages, commits, and pushes to remote repositories from one clean interface.',
    highlights: [
      'A utility that turns the repetitive commit-and-push routine into a couple of clicks.',
      'Stages, commits, and pushes to remote repositories from one clean interface.',
    ],
    tags: ['Git', 'Automation', 'Developer Tools'],
    github: 'https://github.com/PDGamerSG/Git-Pusher-Application',
    featured: false,
    status: 'completed',
},
{
    title: 'Medium Blog Website',
    description:
    'A Medium-style blogging platform with a clean reading and writing experience: article publishing, rich text editing, and a responsive layout.',
    tags: ['Full-Stack', 'Blog', 'Web'],
    github: 'https://github.com/PDGamerSG/Medium-Blog-Website',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Streak App',
    description:
    'An Android habit tracker written in Kotlin. Build daily streaks across custom habits and watch consistency add up in a clean mobile UI.',
    tags: ['Kotlin', 'Android', 'Mobile', 'Habit Tracking'],
    github: 'https://github.com/PDGamerSG/Streak-App',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Alarm App',
    description:
    'A mobile alarm application with customizable alerts, snooze functionality, and a user-friendly interface for managing daily wake-up routines.',
    tags: ['Mobile', 'Android', 'Utility'],
    github: 'https://github.com/PDGamerSG/Alarm-App',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Paytm Clone',
    description:
    'A Paytm-style payments app exploring full-stack fintech: wallet transfers, transaction history, and the core payment flows, built in JavaScript.',
    tags: ['JavaScript', 'Full-Stack', 'Fintech', 'Clone'],
    github: 'https://github.com/PDGamerSG/Paytm-clone',
    featured: false,
    status: 'in-progress',
},
  {
    title: 'Ventilair India',
    description:
    'Production website for Ventilair India, a leading industrial fan and blower manufacturer. Next.js 16 App Router, React 19, Framer Motion, and Tailwind CSS v4. Fully SSR and SEO-optimised with Core Web Vitals tuning, JSON-LD, sitemap, and PWA support.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/PDGamerSG/Ventilair-Project',
    demo: 'https://lcdas.in/',
    featured: true,
    status: 'completed',
},
    {
        title: 'VTOP Extension',
      description:
        'Browser extension that supercharges the VIT university portal (VTOP): better timetable views, quick navigation, and quality-of-life improvements for students. Live on the Chrome Web Store.',
      tags: ['JavaScript', 'Browser Extension', 'Chrome', 'VIT', 'Productivity'],
      github: 'https://github.com/PDGamerSG/VIT-Extension',
      demo:"https://chromewebstore.google.com/detail/VTop+/lfimlnfelmhmiachieegmffalffiacfh",
      featured: true,
      status: 'research',
    },
    {
        title: 'Course Platform End to End',
        description:
        'A full-stack course platform with video lessons, progress tracking, quizzes, and payments. Built to learn what it takes to ship a production-grade web app from scratch.',
        tags: ['Next.js', 'TypeScript', 'Full-Stack', 'Node.js', 'PostgreSQL'],
        featured: true,
        github: 'https://github.com/PDGamerSG/Course-app',
        demo: 'https://course-app-swart-xi.vercel.app',
        status: 'in-progress',
    },
    {
        title: 'Personal Website',
        description:
        'The site you are on right now: a fully static, SEO-optimised portfolio and blog built with Next.js 16 and Tailwind CSS v4, with MDX posts, dark and light themes, RSS feed, and an auto-generated sitemap.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        github: 'https://github.com/PDGamerSG/Personal-Website',
        demo: 'https://pallabdas.dev',
        featured: true,
        status: 'in-progress',
    },
{
    title: 'Gulab Jamun Retail Platform',
    description:
    'Smart retail supply chain and customer intelligence platform built at the CSI-VIT ForkThis\'25 hackathon. React frontend and Python backend serving AI-driven demand forecasting and customer insights on a provided retail dataset.',
    tags: ['React', 'Python', 'AI', 'Hackathon', 'Supply Chain', 'Data Analytics'],
    github: 'https://github.com/PDGamerSG/Gulab-jamun-Project',
    demo: 'https://gulab-jamun-project.vercel.app/',
    featured: true,
    status: 'completed',
},
]
