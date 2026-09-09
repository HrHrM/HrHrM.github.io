import {
  BASE_PITCH,
  LINE_WIDTH,
  edgeAlpha,
  meshFor,
  projectMesh,
} from '@/lib/geodesic'
import { cn } from '@/lib/cn'

/**
 * La misma geodésica que `WireframeBall`, quieta y en SVG.
 *
 * Existe porque el canvas no puede estar en el HTML: con `ssr: false` el
 * prerender genera markup estático y el `<canvas>` no se pinta hasta que React
 * hidrata. En una conexión lenta eso deja la portada sin su figura durante
 * todo el rato que tarde el JS. Esto sí viaja en el HTML.
 *
 * No es una imitación: la malla, la proyección, el desvanecido por profundidad
 * y el grosor de línea salen de `lib/geodesic`, los mismos que usa el canvas.
 * Lo único que cambia es que aquí el `yaw` está congelado.
 *
 * Se dibuja con `vectorEffect="non-scaling-stroke"` para que el hairline
 * mantenga su grosor pase lo que pase con la escala del viewBox.
 */

/** Lienzo de referencia. El SVG se escala luego con `preserveAspectRatio`, así
    que las proporciones importan más que los números. */
const BOX = { width: 800, height: 800 }

/** El fotograma en el que se congela. El canvas arranca en `yaw = 0`, así que
    coincidir con él hace que el relevo no dé un salto de rotación. */
const FROZEN_YAW = 0

const mesh = meshFor(1)
const projected = projectMesh(
  mesh,
  BOX.width,
  BOX.height,
  FROZEN_YAW,
  BASE_PITCH,
)

/**
 * Las 120 aristas se agrupan en un puñado de `<path>` por nivel de opacidad en
 * vez de emitir 120 `<line>`.
 *
 * No es microoptimización gratuita: esto viaja en el HTML de las dos rutas
 * prerenderizadas, y como `<line>` sueltos el placeholder costaba unos 13 KB
 * en crudo él solo. Redondeando el alfa a pasos de 0.05 salen ~11 grupos, una
 * diferencia que no se ve, y el markup baja a una cuarta parte.
 */
const paths = (() => {
  const buckets = new Map<string, string[]>()
  for (const [a, b] of mesh.edges) {
    const from = projected[a]
    const to = projected[b]
    const alpha = (Math.round(edgeAlpha(from, to) / 0.05) * 0.05).toFixed(2)
    const round = (n: number) => Math.round(n * 10) / 10
    const segment = `M${round(from.x)} ${round(from.y)}L${round(to.x)} ${round(to.y)}`
    const bucket = buckets.get(alpha)
    if (bucket) bucket.push(segment)
    else buckets.set(alpha, [segment])
  }
  return [...buckets].map(([alpha, segments]) => ({
    alpha,
    d: segments.join(''),
  }))
})()

export function WireframeBallStatic({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn('block h-full w-full', className)}
    >
      <g
        fill="none"
        stroke="var(--muted)"
        strokeWidth={LINE_WIDTH}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        {paths.map(({ alpha, d }) => (
          <path key={alpha} d={d} strokeOpacity={alpha} />
        ))}
      </g>
    </svg>
  )
}
