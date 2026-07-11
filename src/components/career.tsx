const CAREER_START = new Date(2026, 4) // May 2026

function tenure(): string {
  const now = new Date()
  const months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    now.getMonth() -
    CAREER_START.getMonth() +
    1
  if (months < 12) return `${months} mo${months > 1 ? 's' : ''}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return `${years} yr${years > 1 ? 's' : ''}${rest ? ` ${rest} mo${rest > 1 ? 's' : ''}` : ''}`
}

export function Career() {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Career</h2>
        <p className="text-sm text-muted-foreground">Work experience and roles</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground">Biz Trade Mart</p>
        <p className="text-xs text-muted-foreground">Bizindo Trade Mart Private Limited</p>
      </div>

      <div className="pt-6">
        <div className="flex gap-3">
          {/* Timeline dot */}
          <div className="relative flex w-6 shrink-0 flex-col items-center pt-1.5">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-foreground" />
          </div>

          <div className="flex flex-1 flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">React Developer Intern</span>
            <span className="text-muted-foreground">
              Internship · May 2026 – Present · {tenure()}
            </span>
            <div className="mt-1 text-muted-foreground leading-relaxed">
              <span className="block">
                Working across the stack on Biz Trade Mart&apos;s platforms:
              </span>
              <ul className="mt-1 list-none space-y-0.5 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['–'] [&_li]:before:text-muted-foreground/80">
                <li>
                  Building the frontend of BTM CRM — role-based dashboards, ticketing and lead
                  workflows in React
                </li>
                <li>
                  Worked on the backend of Re:BTM, the B2B trade marketplace — Django services
                  powering the store, auctions and real-time chat
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
