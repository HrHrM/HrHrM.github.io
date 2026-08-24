import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'

/**
 * El texto vive en `content/{es,en}/ui.ts`, no aquí: añadir o cambiar un
 * párrafo no debería tocar un componente (CLAUDE.md §3, regla 2).
 *
 * El primer párrafo va en `text-lead` y los siguientes en cuerpo: con un
 * display de un solo peso, la entrada a la sección la marca el tamaño.
 */
export function About() {
  const { ui } = useLocale()

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-line py-section"
    >
      <SectionHeading id="about" index="02" title={ui.sections.about.title} />
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-4">
            {ui.about.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph.slice(0, 32)}
                className={cn(
                  i === 0 ? 'text-lead text-ink' : 'mt-6',
                  'max-w-prose',
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
