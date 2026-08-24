import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'

/** Agrupado y en listas. Sin barras de porcentaje (CLAUDE.md §4). */
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
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {skills.map((group) => (
            <div key={group.id}>
              <h3 className="border-b border-line pb-3 font-mono text-meta tracking-widest text-muted uppercase">
                {group.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
