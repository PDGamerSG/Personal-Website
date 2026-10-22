import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'

const START = new Date(2026, 4) // May 2026
const END = new Date(2026, 9) // Oct 2026

/** Client sites built and shipped as freelance work. */
const clientSites = [
  {
    name: 'Vastex Cleaning Services',
    about: 'Brick cleaning for builders in Melbourne',
    url: 'https://www.vastexservices.com/',
    image: '/projects/vastex.webp',
  },
  {
    name: 'Hashmetrik',
    about: 'PR and digital marketing agency in Hyderabad',
    url: 'https://www.hashmetrik.in/',
    image: '/projects/hashmetrik.webp',
  },
  {
    name: 'Zapper Edge',
    about: 'Compliance controls for enterprise AI, with a 3D hero',
    url: 'https://zapperedge.vercel.app/',
    image: '/projects/zapper-edge.webp',
  },
]

/** Inclusive month count between two dates, as "5 mos" / "1 yr 2 mos". */
function duration(from: Date, to: Date): string {
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth() + 1
  if (months < 12) return `${months} mo${months > 1 ? 's' : ''}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return `${years} yr${years > 1 ? 's' : ''}${rest ? ` ${rest} mo${rest > 1 ? 's' : ''}` : ''}`
}

const monthLabel = (d: Date) => d.toLocaleString('en-US', { month: 'short' })

export function Career() {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Career</h2>
        <p className="text-sm text-muted-foreground">Work experience and roles</p>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="https://www.biztrademart.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center gap-2 font-medium text-foreground"
        >
          Biz Trade Mart
          <ArrowUpRight className="h-4 w-4 opacity-65 transition-[translate,opacity] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
        <p className="text-xs text-muted-foreground">Bizindo Trade Mart Private Limited</p>
      </div>

      <div className="pt-6">
        <div className="flex gap-3">
          {/* Timeline dot: hollow now that the role has ended */}
          <div className="relative flex w-6 shrink-0 flex-col items-center pt-1.5">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full border border-secondary-foreground/70" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-medium text-foreground">React Developer Intern</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Completed
              </span>
            </div>
            <span className="text-muted-foreground">
              Internship · {monthLabel(START)} {START.getFullYear()} – {monthLabel(END)}{' '}
              {END.getFullYear()} · {duration(START, END)}
            </span>

            <div className="mt-1 text-muted-foreground leading-relaxed">
              <span className="block">
                Worked across the stack on Biz Trade Mart&apos;s platforms:
              </span>
              <ul className="mt-1 list-none space-y-0.5 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['–'] [&_li]:before:text-muted-foreground/80">
                <li>
                  Built the frontend of BTM CRM: role-based dashboards, ticketing and lead
                  workflows in React
                </li>
                <li>
                  Worked on the backend of Re:BTM, the B2B trade marketplace, with Django services
                  powering the store, auctions and real-time chat
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-1">
        <span className="font-medium text-foreground">Freelance</span>
        <p className="text-xs text-muted-foreground">Independent client work</p>
      </div>

      <div className="pt-6">
        <div className="flex gap-3">
          <div className="relative flex w-6 shrink-0 flex-col items-center pt-1.5">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full border border-secondary-foreground/70" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Web Developer</span>
            <span className="text-muted-foreground">
              Freelance · {clientSites.length} client sites
            </span>
            <span className="mt-1 block text-muted-foreground leading-relaxed">
              Built and shipped websites for these clients:
            </span>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {clientSites.map((site) => (
                <li key={site.name}>
                  <Link
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl outline-offset-4 sm:flex-col sm:gap-2.5"
                  >
                    <span className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted shadow-[0_8px_24px_-14px_rgb(0_0_0/0.45)] sm:w-full">
                      <Image
                        src={site.image}
                        alt={`Screenshot of the ${site.name} website`}
                        fill
                        sizes="(max-width: 640px) 112px, 200px"
                        className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 text-[13px] font-medium text-foreground">
                        {site.name}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-[translate,opacity] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                        {site.about}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
