import { ArrowUpRight, Lock } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/ui/BrandIcon'
import { useLocale } from '@/hooks/useLocale'
import type { Project } from '@/content/types'

/**
 * La tarjeta deriva todo de `visibility` y nunca asume que hay links.
 * Sin `cover` se sostiene con tipografía: el número y el display bastan.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const { ui, project: projectPath } = useLocale()
  const { links, visibility } = project

  const hasLive = visibility === 'public' && Boolean(links.live)
  const hasRepo = visibility === 'public' && Boolean(links.repo)

  return (
    <article className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
      <div className="md:col-span-3">
        <span
          aria-hidden="true"
          className="font-mono text-meta text-muted tabular-nums"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="mt-2 font-mono text-meta tracking-wide text-muted uppercase">
          {project.context}
        </p>
        <p className="mt-1 font-mono text-meta text-muted tabular-nums">
          {project.year}
        </p>
      </div>

      <div className="md:col-span-9">
        <h3 className="font-display text-card leading-tight">
          <Link
            to={projectPath(project.slug)}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 max-w-prose text-lead">{project.tagline}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-meta tracking-wide text-muted uppercase">
              {ui.project.problem}
            </dt>
            <dd className="mt-1">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-meta tracking-wide text-muted uppercase">
              {ui.project.role}
            </dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
        </dl>

        {project.outcome ? (
          <p className="mt-6 border-l-2 border-accent pl-4 text-ink">
            <span className="font-mono text-meta tracking-wide text-muted uppercase">
              {ui.project.outcome}:{' '}
            </span>
            {project.outcome}
          </p>
        ) : null}

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to={projectPath(project.slug)}
            className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-ink uppercase underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {ui.project.readCase}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>

          {hasLive ? (
            <a
              href={links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-muted uppercase transition-colors hover:text-ink"
            >
              {ui.project.viewLive}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          ) : null}

          {hasRepo ? (
            <a
              href={links.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-muted uppercase transition-colors hover:text-ink"
            >
              <GithubIcon className="size-3.5" />
              {ui.project.viewRepo}
            </a>
          ) : null}

          {visibility === 'private' ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-muted uppercase">
              <Lock aria-hidden="true" className="size-3.5" />
              {ui.project.codePrivate}
            </span>
          ) : null}

          {visibility === 'nda' ? (
            <Badge tone="accent">{ui.project.underNda}</Badge>
          ) : null}
        </div>
      </div>
    </article>
  )
}
