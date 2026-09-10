import { ArrowUpRight } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/ui/BrandIcon'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'
import type { Project } from '@/content/types'

/**
 * El caso de estudio completo, en la Home. No hay ficha detrás: el título es
 * texto, no un enlace, y la tarjeta no lleva ningún estado de hover que
 * insinúe que se puede entrar. Los únicos enlaces son los de salida —el
 * producto en vivo y el repositorio— y solo cuando `visibility` lo permite.
 *
 * Los tres bloques van apilados y no en columnas: son de dos a cuatro frases
 * cada uno, y en tres columnas estrechas se leen mal. Etiqueta en mono encima
 * del valor, que es la misma figura que usa el resto del sitio.
 *
 * `context` no lleva etiqueta propia: ya está en la columna de metadatos de la
 * izquierda, junto al número y el año.
 */
export function ProjectCard({
  project,
  index,
  bare = false,
}: {
  project: Project
  index: number
  /**
   * Sin el hairline inferior, para cuando la ficha ya va dentro de una caja
   * que tiene su propio borde. Si no, se dibujan dos líneas juntas.
   */
  bare?: boolean
}) {
  const { ui } = useLocale()
  const { links, visibility } = project

  const hasLive = visibility === 'public' && Boolean(links.live)
  const hasStore = visibility === 'public' && Boolean(links.store)
  const hasRepo = visibility === 'public' && Boolean(links.repo)

  const blocks = [
    { label: ui.project.problem, value: project.problem },
    { label: ui.project.solution, value: project.solution },
    { label: ui.project.role, value: project.role },
  ]

  return (
    <article
      className={cn(
        'grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14',
        !bare && 'border-b border-line',
      )}
    >
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
        <h3 className="font-display text-card leading-tight text-ink">
          {project.title}
        </h3>

        <p className="mt-3 max-w-prose text-lead">{project.tagline}</p>

        <dl className="mt-6 grid gap-5">
          {blocks.map(({ label, value }) => (
            <div key={label}>
              <dt className="font-mono text-meta tracking-wide text-muted uppercase">
                {label}
              </dt>
              <dd className="mt-1 max-w-prose">{value}</dd>
            </div>
          ))}
        </dl>

        {project.outcome ? (
          <p className="mt-6 max-w-prose border-l-2 border-accent pl-4 text-ink">
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
          {hasLive ? (
            <a
              href={links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-ink uppercase underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {ui.project.viewLive}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          ) : null}

          {hasStore ? (
            <a
              href={links.store}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-meta tracking-wide text-ink uppercase underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {ui.project.viewStore}
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

          {/* Los dos estados van como etiquetas iguales. En un proyecto bajo
              NDA se muestran ambas: "Bajo NDA" dice por qué no hay detalle
              interno, y "Código privado" por qué no hay repositorio. */}
          {visibility === 'nda' ? (
            <Badge tone="flag">{ui.project.underNda}</Badge>
          ) : null}

          {visibility === 'nda' || visibility === 'private' ? (
            <Badge tone="muted">{ui.project.codePrivate}</Badge>
          ) : null}
        </div>
      </div>
    </article>
  )
}
