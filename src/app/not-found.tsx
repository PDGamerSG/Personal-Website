import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SpaceSnake } from '@/components/space-snake'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <SpaceSnake />
      <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
        Nothing lives at this address. The snake is still out there though, so press an arrow key
        and see how many stars you can catch before heading back.
      </p>
      <Link
        href="/"
        className="group mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        back home
      </Link>
    </div>
  )
}
