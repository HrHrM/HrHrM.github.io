import { cn } from '@/lib/cn'

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  /** `line` para metadatos neutros; `accent` para el estado que importa. */
  tone?: 'line' | 'accent'
}

/** Etiqueta de metadato. Mono, versalitas, borde de un pelo. */
export function Badge({
  tone = 'line',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 font-mono text-meta tracking-wide uppercase',
        tone === 'line' && 'border-line text-muted',
        tone === 'accent' && 'border-accent/40 text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
