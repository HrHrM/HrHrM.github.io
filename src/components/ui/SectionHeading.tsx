import { cn } from '@/lib/cn'

import { Container } from './Container'

type SectionHeadingProps = {
  /** Se usa como ancla de la Navbar y como `id` de la sección. */
  id: string
  index: string
  title: string
  lead?: string
  className?: string
}

/**
 * Cabecera de sección: número en mono, título en display, línea de un pelo.
 * La numeración es parte de la dirección "preciso" — se ve el sistema.
 */
export function SectionHeading({
  id,
  index,
  title,
  lead,
  className,
}: SectionHeadingProps) {
  return (
    <Container className={cn('mb-12 md:mb-16', className)}>
      <div className="flex items-baseline gap-4 border-b border-line pb-4">
        <span
          aria-hidden="true"
          className="font-mono text-meta text-muted tabular-nums"
        >
          {index}
        </span>
        <h2 id={`${id}-title`} className="font-display text-section">
          {title}
        </h2>
      </div>
      {lead ? (
        <p className="mt-4 max-w-prose text-lead text-muted">{lead}</p>
      ) : null}
    </Container>
  )
}
