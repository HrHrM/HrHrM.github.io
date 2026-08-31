import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'

/**
 * Misma retícula que Experiencia y las fichas: etiqueta en mono a la izquierda,
 * contenido a la derecha. Escala a cualquier número de grupos, al contrario que
 * una rejilla de tres columnas — con cinco grupos dejaba un 3+2 descompensado.
 *
 * Sin niveles ni barras de porcentaje (CLAUDE.md §4).
 */
export function Stack() {
  const { ui, skills } = useLocale()

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="border-t border-line py-section"
    >
      <SectionHeading
        id="stack"
        index="03"
        title={ui.sections.stack.title}
        lead={ui.sections.stack.lead}
      />
      <Container>
        <dl>
          {skills.map((group) => (
            <div
              key={group.id}
              className="grid gap-3 border-b border-line py-8 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <dt className="font-mono text-meta tracking-widest text-muted uppercase md:col-span-3">
                {group.label}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
