export interface UsesItem {
  name: string
  description: string
  url?: string
}

export interface UsesCategory {
  title: string
  icon: string
  items: UsesItem[]
}

export const usesData: UsesCategory[] = [
  {
    title: 'Hardware',
    icon: '💻',
    items: [
      {
        name: 'Laptop',
        description: 'Acer Aspire 4215G || 32 GB RAM || 1 TB SSD',
      },
      {
        name: 'External Monitor',
        description: 'Just my tablet as a secondary screen for now',
      },
    ],
  },
  {
    title: 'Tech Stack',
    icon: '⚙️',
    items: [
      {
        name: 'Next.js',
        description: 'My go to React framework. App Router, SSG, SSR, and built-in SEO tooling all in one.',
      },
      {
        name: 'TypeScript',
        description: 'I use TS on every project. Catching type errors at compile time saves hours of debugging.',
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS. Once you learn to think in utility classes, going back to plain CSS feels slow.',
      },
      {
        name: 'Python',
        description: 'For all ML/AI work scikit-learn, NumPy, Pandas, Keras. The data science ecosystem is unbeatable.',
      },
      {
        name: 'kotlin',
        description: 'Tech Stack used for making apps for android explored it but was not fascinating for me',
      },
    ],
  },
  {
    title: 'AI & Productivity',
    icon: '🤖',
    items: [
      {
        name: 'Claude',
        description: 'My AI assistant for complex reasoning, debugging, and writing.',
      },
      {
        name: 'ChatGPT',
        description: 'Quick lookups, code generation, and exploring ideas fast.',
      },
      {
        name: 'Notion',
        description: 'For notes, planning, and capturing ideas. My second brain for everything that needs structure.',
      },
      {
        name: 'Excalidraw',
        description: 'Whiteboard tool for sketching system architecture and explaining complex ideas visually.',
      },
    ],
  }
]
