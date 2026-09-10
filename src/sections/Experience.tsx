import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { useNearestRow } from '@/hooks/useNearestRow'
import { formatMonthYear } from '@/lib/dates'

import './Experience.css'

/**
 * El efecto de proximidad va **por empresa**, no por línea: la unidad que el
 * lector recorre aquí es el puesto entero, y encender los highlights uno a uno
 * convertiría un timeline en un menú. Cada `<li>` es una fila del efecto.
 *
 * El puntero se escucha en la **sección**, no en la lista: la lista la limita
 * el `Container`, así que atándolo ahí el efecto se apagaba al pasar por los
 * márgenes laterales aunque siguieras a la altura de la misma entrada.
 *
 * Formación entra en el mismo efecto y con el **mismo hook**, continuando la
 * numeración de índices detrás de los puestos. Son dos listas en el marcado
 * pero una sola secuencia de filas para el puntero, así que nunca puede haber
 * dos encendidas a la vez: la regla sigue siendo «la fila cuya banda vertical
 * contiene el cursor».
 */
export function Experience() {
  const { ui, experience, education, locale } = useLocale()
  const { containerRef, itemRef } = useNearestRow<HTMLElement>()

  const range = (start: string, end: string | null) =>
    `${formatMonthYear(start, locale)} — ${end ? formatMonthYear(end, locale) : ui.project.present}`

  return (
    <section
      ref={containerRef}
      id="experience"
      aria-labelledby="experience-title"
      className="py-section"
    >
      <SectionHeading
        id="experience"
        index="02"
        title={ui.sections.experience.title}
      />
      <Container>
        <ol>
          {experience.map((item, index) => (
            <li
              key={`${item.company}-${item.start}`}
              ref={itemRef(index)}
              className="xp-item grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8"
            >
              <p className="xp-date font-mono text-meta tabular-nums md:col-span-3">
                <span aria-hidden="true" className="xp-marker" />
                {range(item.start, item.end)}
              </p>
              <div className="md:col-span-9">
                <h3 className="xp-heading text-lead">
                  <span className="xp-company">{item.company}</span>
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
                {/* Chip cuadrado, sin radio: en esta página no hay una sola
                    esquina redondeada. El tamaño y el tracking son los mismos
                    que ya usan las etiquetas del zócalo del Hero, para no
                    abrir una escala de mono nueva. */}
                <ul className="mt-6 flex flex-wrap items-center gap-2">
                  {item.stack.map((tech) => (
                    <li
                      key={tech}
                      className="bg-surface px-2.5 py-1 font-mono text-[0.625rem] tracking-widest text-accent uppercase"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
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
          {education.map((item, index) => (
            <li
              key={`${item.institution}-${item.start}`}
              ref={itemRef(experience.length + index)}
              className="xp-item grid gap-3 border-b border-line py-8 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <p className="xp-date font-mono text-meta tabular-nums md:col-span-3">
                <span aria-hidden="true" className="xp-marker" />
                {range(item.start, item.end)}
              </p>
              <div className="md:col-span-9">
                <p className="xp-heading text-lead">
                  <span className="xp-company">{item.degree}</span>
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
