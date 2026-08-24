import { useParams } from 'react-router'

import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useLocale } from '@/hooks/useLocale'

/**
 * TODO(alcance): la ficha completa entra en la siguiente tanda — capturas,
 * diagramas y `prerender` enumerando los slugs. De momento pinta el caso con
 * los campos que ya existen en `content/`, para que la ruta no esté muerta.
 */
export default function ProjectDetail() {
  const { slug } = useParams()
  const { ui, projects, home } = useLocale()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <main id="main" className="py-section">
        <Container>
          <h1 className="font-display text-section">{ui.notFound.title}</h1>
          <ButtonLink to={home} variant="ghost" className="mt-8">
            {ui.notFound.back}
          </ButtonLink>
        </Container>
      </main>
    )
  }

  const blocks = [
    { label: ui.project.context, value: project.context },
    { label: ui.project.problem, value: project.problem },
    { label: ui.project.solution, value: project.solution },
    { label: ui.project.role, value: project.role },
    ...(project.outcome
      ? [{ label: ui.project.outcome, value: project.outcome }]
      : []),
  ]

  return (
    <main id="main" className="py-section">
      <Container>
        <p className="font-mono text-meta tracking-widest text-muted uppercase">
          {project.year}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-section leading-tight">
          {project.title}
        </h1>
        <p className="mt-4 max-w-prose text-lead">{project.tagline}</p>

        <dl className="mt-12 space-y-8">
          {blocks.map(({ label, value }) => (
            <div key={label} className="border-t border-line pt-4">
              <dt className="font-mono text-meta tracking-wide text-muted uppercase">
                {label}
              </dt>
              <dd className="mt-2 max-w-prose">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-10 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <ButtonLink to={home} variant="ghost" className="mt-12">
          {ui.notFound.back}
        </ButtonLink>
      </Container>
    </main>
  )
}
