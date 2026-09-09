import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import {
  FIELD_OPACITY,
  STATIC_VIEWBOX,
  sampleStaticField,
} from '@/lib/particleField'

/**
 * El mismo campo de partículas que `Particles`, quieto y en SVG.
 *
 * Mismo motivo que `WireframeBallStatic`: con `ssr: false` el `<canvas>` de
 * WebGL no existe hasta que React hidrata, y hasta entonces la portada se
 * quedaba sin su capa de textura.
 *
 * Aquí «igual» tiene un límite honesto: el campo animado sortea posiciones
 * nuevas en cada carga, así que no hay una distribución concreta que copiar.
 * Lo que sí coincide es todo lo demás —densidad, cámara, escala de tamaños,
 * color y opacidad por tema—, porque sale de `lib/particleField`, que también
 * alimenta al componente animado.
 *
 * El muestreo va con semilla fija: el SVG se genera en el build y otra vez al
 * hidratar, y con posiciones aleatorias los dos no coincidirían.
 */

const particles = sampleStaticField()

export function ParticlesStatic({ className }: { className?: string }) {
  const { theme } = useTheme()

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${STATIC_VIEWBOX.width} ${STATIC_VIEWBOX.height}`}
      // `slice` y no `meet`: el campo tiene que cubrir el Hero entero, y que
      // se recorten los puntos de los bordes da igual — dejar franjas vacías,
      // no.
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
    >
      <g fill="var(--muted)" fillOpacity={FIELD_OPACITY[theme]}>
        {particles.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
        ))}
      </g>
    </svg>
  )
}
