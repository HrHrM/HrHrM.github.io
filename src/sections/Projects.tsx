import { ProjectCard } from './ProjectCard'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'

export function Projects() {
  const { ui, projects } = useLocale()
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => b.year - a.year)

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-section">
      <SectionHeading
        id="projects"
        index="01"
        title={ui.sections.projects.title}
        lead={ui.sections.projects.lead}
      />
      <Container>
        {featured.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </Container>
    </section>
  )
}
