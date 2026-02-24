export interface Project {
  title: string
  description: string
  longDescription?: string
  tags: string[]
  github?: string
  demo?: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'research'
}

export const projects: Project[] = [
  {
    title: 'ML Algorithm Visualizer',
    description:
      'An interactive web app to visualize classic machine learning algorithms — linear regression, k-means, decision trees — step by step.',
    tags: ['Python', 'Machine Learning', 'Scikit-learn', 'React', 'FastAPI'],
    github: 'https://github.com/PDGamerSG',
    featured: true,
    status: 'in-progress',
  },
  {
    title: 'Full-Stack Blog Platform',
    description:
      'A personal blog and portfolio platform built with Next.js, TypeScript, Tailwind CSS, and MDX. Features dark mode, SEO, RSS feed, and sitemap.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'SEO'],
    github: 'https://github.com/PDGamerSG',
    demo: 'https://pallabdas.dev',
    featured: true,
    status: 'completed',
  },
  {
    title: 'Neural Network from Scratch',
    description:
      'Implementing a feedforward neural network in pure NumPy — forward pass, backpropagation, gradient descent — to deeply understand the fundamentals.',
    tags: ['Python', 'NumPy', 'Deep Learning', 'Research'],
    github: 'https://github.com/PDGamerSG',
    featured: true,
    status: 'research',
  },
  {
    title: 'REST API Boilerplate',
    description:
      'A production-ready Node.js + Express API starter with JWT authentication, rate limiting, input validation, and Docker support.',
    tags: ['Node.js', 'Express', 'TypeScript', 'JWT', 'Docker'],
    github: 'https://github.com/PDGamerSG',
    featured: false,
    status: 'completed',
  },
  {
    title: 'AI Chat Interface',
    description:
      'A clean chat UI for interacting with LLM APIs. Supports streaming responses, conversation history, and custom system prompts.',
    tags: ['React', 'Next.js', 'OpenAI API', 'Streaming', 'TypeScript'],
    github: 'https://github.com/PDGamerSG',
    featured: false,
    status: 'in-progress',
  },
]
