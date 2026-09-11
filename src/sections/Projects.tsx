import { ProjectCard } from './ProjectCard'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { useLocale } from '@/hooks/useLocale'

/**
 * Las cinco fichas van en caja con foco, todas iguales. Antes las separaba un
 * hairline inferior y ahora cada una es su propia caja: por eso reciben
 * `bare`, que le quita a la ficha su borde para no dibujar dos líneas juntas.
 *
 * Aquí estuvo una galería en acordeón para los dos trabajos de Galilei. Se
 * quitó: sin capturas propias iba con marcadores de posición, y el producto
 * que más peso tenía en ella está bajo NDA, así que ni con fotos reales podía
 * llenarse. El componente sigue en `components/ui/AccordionGallery.tsx` por si
 * vuelve; al no importarlo nadie, no entra en el build.
 */
export function Projects() {
  const { ui, projects } = useLocale()
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => b.year - a.year)

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="border-t border-line py-section"
    >
      <SectionHeading
        id="projects"
        index="03"
        title={ui.sections.projects.title}
        lead={ui.sections.projects.lead}
      />
      <Container>
        <div className="grid gap-6">
          {featured.map((project, index) => (
            <SpotlightCard key={project.slug} className="px-6 md:px-8">
              <ProjectCard project={project} index={index} bare />
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
