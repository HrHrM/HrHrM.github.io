import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'

/**
 * TODO(contenido): dos párrafos, humanos y concretos.
 * Prohibido "apasionado por la tecnología" (CLAUDE.md §5).
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
            <p className="text-lead text-ink">
              TODO: primer párrafo. Cómo llegué a esto y qué tipo de problema me
              interesa resolver. Concreto, en primera persona, sin adjetivos de
              relleno.
            </p>
            <p className="mt-6">
              TODO: segundo párrafo. Cómo trabajo — qué me importa en una revisión
              de código, cómo me llevo con el diseño, qué hago cuando el requisito
              llega mal escrito. Y una línea que no sea de trabajo, para que quien
              lea se acuerde de que hay una persona detrás.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
