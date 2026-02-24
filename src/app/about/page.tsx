import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Github, Twitter, BookOpen, Code2, Brain } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about Pallab Das — a full-stack developer learning AI and machine learning, sharing the journey.',
}

const skills = {
  'Frontend': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
  'Backend': ['Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs'],
  'AI / ML': ['Machine Learning', 'NumPy', 'Pandas', 'Scikit-learn', 'Deep Learning'],
  'Tools & Infra': ['Git', 'GitHub', 'Docker', 'VS Code', 'Linux'],
}

const learning = [
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description:
      'Building end-to-end web applications with modern frameworks — Next.js on the frontend, Node.js/Python on the backend.',
  },
  {
    icon: Brain,
    title: 'Artificial Intelligence',
    description:
      'Exploring LLMs, prompt engineering, and building AI-powered applications with OpenAI and open-source models.',
  },
  {
    icon: BookOpen,
    title: 'Machine Learning',
    description:
      'Understanding ML algorithms from the ground up — implementing them from scratch and applying them to real datasets.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      {/* Header */}
      <section className="mb-12">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
          <span className="text-3xl font-bold text-primary">PD</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Pallab Das</h1>
        <p className="mb-1 text-base text-muted-foreground">
          <span className="font-mono text-sm">@PDGamerSG</span>
        </p>
        <p className="mb-6 max-w-lg text-base text-muted-foreground leading-relaxed">
          Hey! I&apos;m Pallab — a developer who&apos;s passionate about learning. I&apos;m currently
          deepening my skills in full-stack web development while exploring the world of AI and machine
          learning. I believe in learning in public: building things, writing about the process, and
          improving with every iteration.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/PDGamerSG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            PDGamerSG
          </Link>
          <Link
            href="https://twitter.com/PDGamerSG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
            @PDGamerSG
          </Link>
        </div>
      </section>

      <Separator className="mb-12" />

      {/* What I'm learning */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-foreground">What I&apos;m Building & Learning</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {learning.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border/50 bg-card p-5"
            >
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-2 text-sm font-semibold text-card-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* Skills */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Skills</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* Contact */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Get in Touch</h2>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          I&apos;m always open to connecting with fellow developers, collaborating on projects, or just
          chatting about tech. Feel free to reach out!
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://github.com/PDGamerSG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-border/50 bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-all hover:border-border hover:shadow-sm"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="https://twitter.com/PDGamerSG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-border/50 bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-all hover:border-border hover:shadow-sm"
          >
            <Twitter className="h-4 w-4" />
            Twitter / X
          </Link>
        </div>
      </section>
    </div>
  )
}
