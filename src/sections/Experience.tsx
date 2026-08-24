import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { formatMonthYear } from '@/lib/dates'

export function Experience() {
  const { ui, experience, education, locale } = useLocale()

  const range = (start: string, end: string | null) =>
    `${formatMonthYear(start, locale)} — ${end ? formatMonthYear(end, locale) : ui.project.present}`

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
              className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8"
            >
              <p className="font-mono text-meta text-muted tabular-nums md:col-span-3">
                {range(item.start, item.end)}
              </p>
              <div className="md:col-span-9">
                <h3 className="text-lead text-ink">
                  {item.company}
                  <span className="text-muted"> · {item.role}</span>
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

        {/* La formación va dentro de Experiencia y no en una sección propia:
            §5 del CLAUDE.md fija seis secciones, y una carrera no compite en
            importancia con tres puestos. */}
        <h3 className="mt-16 border-b border-line pb-3 font-mono text-meta tracking-widest text-muted uppercase">
          {ui.sections.experience.education}
        </h3>
        <ul>
          {education.map((item) => (
            <li
              key={`${item.institution}-${item.start}`}
              className="grid gap-3 border-b border-line py-8 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <p className="font-mono text-meta text-muted tabular-nums md:col-span-3">
                {range(item.start, item.end)}
              </p>
              <div className="md:col-span-9">
                <p className="text-lead text-ink">
                  {item.degree}
                  <span className="text-muted"> · {item.institution}</span>
                </p>
                {item.note ? (
                  <p className="mt-2 max-w-prose">{item.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
