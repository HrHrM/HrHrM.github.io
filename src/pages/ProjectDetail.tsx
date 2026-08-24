import { ArrowLeft, ArrowUpRight, Lock } from 'lucide-react'
import { Link, useParams } from 'react-router'

import type { Route } from './+types/ProjectDetail'

import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/ui/BrandIcon'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { content } from '@/content'
import { useLocale } from '@/hooks/useLocale'
import { SITE } from '@/lib/constants'
import { localeFromPath, projectPath } from '@/lib/paths'
import { seoMeta } from '@/lib/seo'

/**
 * El slug es el mismo en los dos idiomas, así que los hreflang de la ficha se
 * construyen con `projectPath` y el selector de idioma no te saca del proyecto.
 */
export function meta({ location, params }: Route.MetaArgs) {
  const locale = localeFromPath(location.pathname)
  const slug = params.slug as string
  const bundle = content[locale]
  const project = bundle.projects.find((p) => p.slug === slug)

  if (!project) {
    return [{ title: `${bundle.ui.notFound.title} — ${SITE.name}` }]
  }

  return seoMeta({
    locale,
    title: `${project.title} — ${SITE.name}`,
    description: project.tagline,
    pathEs: projectPath('es', slug),
    pathEn: projectPath('en', slug),
  })
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const { ui, projects, home, project: pathTo } = useLocale()

  const index = projects.findIndex((p) => p.slug === slug)
  const project = index === -1 ? undefined : projects[index]

  if (!project) {
    return (
      <main id="main" className="py-section">
        <Container>
          <p className="font-mono text-meta tracking-widest text-muted uppercase">
            404
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-section">
            {ui.notFound.title}
          </h1>
          <p className="mt-4 max-w-prose text-lead">{ui.notFound.body}</p>
          <ButtonLink to={home} variant="ghost" className="mt-8">
            {ui.notFound.back}
          </ButtonLink>
        </Container>
      </main>
    )
  }

  // Los bloques del caso de estudio. `outcome` es opcional a propósito: mejor
  // ausente que rellenado con un número inventado.
  const blocks = [
    { label: ui.project.context, value: project.context, emphasise: false },
    { label: ui.project.problem, value: project.problem, emphasise: false },
    { label: ui.project.solution, value: project.solution, emphasise: false },
    { label: ui.project.role, value: project.role, emphasise: true },
    ...(project.outcome
      ? [{ label: ui.project.outcome, value: project.outcome, emphasise: true }]
      : []),
  ]

  const next = projects[(index + 1) % projects.length]
  const showLive = project.visibility === 'public' && project.links.live
  const showRepo = project.visibility === 'public' && project.links.repo

  return (
    <main id="main">
      <article className="py-section">
        <Container>
          <Link
            to={home}
            className="inline-flex items-center gap-2 font-mono text-meta tracking-wide text-muted uppercase transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {ui.notFound.back}
          </Link>

          <header className="mt-10 border-b border-line pb-10">
            <p className="flex flex-wrap items-center gap-x-3 font-mono text-meta tracking-wide text-muted uppercase">
              <span className="tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.context}</span>
            </p>

            <h1 className="mt-5 max-w-4xl font-display text-section leading-tight">
              {project.title}
            </h1>

            <p className="mt-4 max-w-prose text-lead">{project.tagline}</p>
          </header>

          {/* Etiqueta a la izquierda, contenido a la derecha: la retícula se ve,
              que es la parte "precisa" de la dirección. */}
          <dl className="mt-12">
            {blocks.map(({ label, value, emphasise }) => (
              <div
                key={label}
                className="grid gap-2 border-b border-line py-8 md:grid-cols-12 md:gap-8"
              >
                <dt className="font-mono text-meta tracking-widest text-muted uppercase md:col-span-3">
                  {label}
                </dt>
                <dd
                  className={
                    emphasise
                      ? 'max-w-prose text-lead text-ink md:col-span-9'
                      : 'max-w-prose md:col-span-9'
                  }
                >
                  {value}
                </dd>
              </div>
            ))}

            <div className="grid gap-2 border-b border-line py-8 md:grid-cols-12 md:gap-8">
              <dt className="font-mono text-meta tracking-widest text-muted uppercase md:col-span-3">
                {ui.project.stack}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {showLive ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-ink uppercase underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {ui.project.viewLive}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            ) : null}

            {showRepo ? (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-muted uppercase transition-colors hover:text-ink"
              >
                <GithubIcon className="size-3.5" />
                {ui.project.viewRepo}
              </a>
            ) : null}

            {project.visibility === 'private' ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-muted uppercase">
                <Lock aria-hidden="true" className="size-3.5" />
                {ui.project.codePrivate}
              </span>
            ) : null}

            {project.visibility === 'nda' ? (
              <Badge tone="accent">{ui.project.underNda}</Badge>
            ) : null}
          </div>
        </Container>
      </article>

      {projects.length > 1 ? (
        <nav
          aria-label={ui.sections.projects.title}
          className="border-t border-line py-12"
        >
          <Container>
            <Link to={pathTo(next.slug)} className="group block">
              <span className="font-mono text-meta tracking-widest text-muted uppercase">
                {ui.project.readCase}
              </span>
              <span className="mt-2 flex items-baseline gap-3 font-display text-card text-ink transition-colors group-hover:text-accent">
                {next.title}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </span>
            </Link>
          </Container>
        </nav>
      ) : null}
    </main>
  )
}
