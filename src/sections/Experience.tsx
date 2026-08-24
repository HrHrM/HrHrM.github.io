import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'

export function Experience() {
  const { ui, experience } = useLocale()

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-t border-line py-section"
    >
      <SectionHeading
        id="experience"
        index="04"
        title={ui.sections.experience.title}
      />
      <Container>
        <ol>
          {experience.map((item) => (
            <li
              key={`${item.company}-${item.start}`}
              className="grid gap-3 border-b border-line py-8 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <p className="font-mono text-meta text-muted tabular-nums md:col-span-3">
                {item.start} — {item.end ?? ui.project.present}
              </p>
              <div className="md:col-span-9">
                <h3 className="text-lead text-ink">
                  {item.role}
                  <span className="text-muted"> · {item.company}</span>
                </h3>
                <p className="mt-2 max-w-prose">{item.summary}</p>
                {item.highlights?.length ? (
                  <ul className="mt-4 space-y-1.5">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <span aria-hidden="true" className="text-accent">
                          —
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
