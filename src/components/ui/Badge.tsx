import { cn } from '@/lib/cn'

type Tone = 'accent' | 'muted' | 'flag'

/**
 * El chip de metadato del sitio: relleno de `surface`, esquina viva, mono a
 * 10px en versalitas. Es la figura que estrenó la fila de stack de Experiencia
 * y ahora usan también las fichas de Proyectos, para que la misma cosa —una
 * tecnología— no se dibuje de dos maneras según la sección.
 *
 * Antes era un chip de **borde** y sin relleno. Se cambió al de Experiencia
 * porque era el que se había elegido comparando variantes en el `.pen`.
 *
 * Los tres tonos dicen cosas distintas y por eso son tres:
 * - `accent`: la tecnología. Es el caso normal.
 * - `muted`: un dato neutro que no reclama atención («Código privado»).
 * - `flag`: la restricción («Bajo NDA»). Va en el terracota de `--flag`, que
 *   no compite con el acento porque no es el acento.
 */
const tones: Record<Tone, string> = {
  accent: 'text-accent',
  muted: 'text-muted',
  flag: 'text-flag',
}

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  tone?: Tone
}

export function Badge({
  tone = 'accent',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center bg-surface px-2.5 py-1 font-mono text-[0.625rem] tracking-widest uppercase',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
