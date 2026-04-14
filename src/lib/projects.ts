export interface Project {
  title: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'research'
}

export const projects: Project[] = [
{
    title: 'Zapier',
    description:
    'A Zapier-inspired automation platform built with TypeScript. Features a frontend interface and custom hooks system for creating automated workflows between services.',
    tags: ['TypeScript', 'Automation', 'Full-Stack'],
    github: 'https://github.com/PDGamerSG/Zapier',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Git Pusher Application',
    description:
    'A utility application that simplifies and automates the Git push workflow. Streamlines committing and pushing changes to remote repositories with a clean interface.',
    tags: ['Git', 'Automation', 'Developer Tools'],
    github: 'https://github.com/PDGamerSG/Git-Pusher-Application',
    featured: false,
    status: 'completed',
},
{
    title: 'Medium Blog Website',
    description:
    'A Medium-inspired blogging platform with a clean reading and writing experience. Features article publishing, rich text editing, and a responsive layout.',
    tags: ['Full-Stack', 'Blog', 'Web'],
    github: 'https://github.com/PDGamerSG/Medium-Blog-Website',
    featured: false,
    status: 'in-progress',
},
{
    title: 'Streak App',
    description:
    'An Android habit tracking app built with Kotlin that helps users build and maintain daily streaks. Tracks consistency across custom habits with a clean mobile UI.',
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
    'A basic clone of the Paytm payment platform built with JavaScript. Recreates core payment flows to explore full-stack fintech concepts including wallet transfers and transaction history.',
    tags: ['JavaScript', 'Full-Stack', 'Fintech', 'Clone'],
    github: 'https://github.com/PDGamerSG/Paytm-clone',
    featured: false,
    status: 'in-progress',
},
  {
    title: 'Ventilair India',
    description:
    'Production website for Ventilair India, a leading industrial fan & blower manufacturer. Built with Next.js 16 App Router, React 19, Framer Motion animations, Tailwind CSS v4. Fully SSR, SEO-optimised with Core Web Vitals tuning, JSON-LD, sitemap, and PWA support.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/PDGamerSG/Ventilair-Project',
    demo: 'https://lcdas.in/',
    featured: true,
    status: 'completed',
},
    {
        title: 'VTOP Extension',
      description:
        'Browser extension that supercharges the VIT university portal (VTOP) with new features and a cleaner experience better timetable views, quick navigation, and quality-of-life improvements for VIT students.',
      tags: ['JavaScript', 'Browser Extension', 'Chrome', 'VIT', 'Productivity'],
      github: 'https://github.com/PDGamerSG/VIT-Extension',
      demo:"https://chromewebstore.google.com/detail/VTop+/lfimlnfelmhmiachieegmffalffiacfh",
      featured: true,
      status: 'research',
    },
    {
        title: 'Course Platform End to End',
        description:
        'A full-stack course platform built end-to-end video lessons, progress tracking, quizzes, and payments. Built to learn and ship a production-grade web app from scratch.',
        tags: ['Next.js', 'TypeScript', 'Full-Stack', 'Node.js', 'PostgreSQL'],
        featured: true,
        github: 'https://github.com/PDGamerSG/Course-app',
        status: 'in-progress',
    },
    {
        title: 'Personal Website',
        description:
        'This website a fully static, SEO optimised personal portfolio and blog built with Next.js 16, Tailwind CSS v4, MDX for blog posts, dark/light mode, RSS feed, and auto-generated sitemap.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        github: 'https://github.com/PDGamerSG/Personal-Website',
        featured: true,
        status: 'in-progress',
    },
{
    title: 'Gulab Jamun Retail Platform',
    description:
    'Smart Retail Supply Chain & Customer Intelligence Platform built for CSI-VIT ForkThis\'25 hackathon. Full-stack app with React frontend and Python backend providing AI-driven demand forecasting and customer insights.The dataset was given and ',
    tags: ['React', 'Python', 'AI', 'Hackathon', 'Supply Chain', 'Data Analytics'],
    github: 'https://github.com/PDGamerSG/Gulab-jamun-Project',
    demo: 'https://gulab-jamun-project.vercel.app/',
    featured: true,
    status: 'completed',
},
]
