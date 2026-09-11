import { useCallback, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/cn'

import './SpotlightCard.css'

/**
 * SpotlightCard — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Un foco que sigue al cursor dentro de la tarjeta.
 *
 * Dos cambios sobre el original:
 *
 * 1. **El color se fija una vez, no en cada `mousemove`.** El original hace
 *    tres `setProperty` por evento, y el tercero escribe siempre el mismo
 *    color; `mousemove` dispara decenas de veces por segundo. Aquí el color va
 *    en el `style` inicial y el puntero solo mueve las dos coordenadas.
 * 2. **La escritura se agrupa en un `requestAnimationFrame`.** El navegador
 *    puede emitir varios `mousemove` entre dos fotogramas, y escribir estilos
 *    en cada uno fuerza un recálculo que nadie llega a ver. Se guarda la
 *    última posición y se escribe una vez por fotograma.
 *
 * El color por defecto sale del acento y no de un `rgba` suelto
 * (CLAUDE.md §6). El `::before` es decorativo y no necesita `aria`.
 */

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  /** Color del foco. Por defecto, el acento a baja alfa. */
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className,
  spotlightColor,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  const position = useRef({ x: 0, y: 0 })

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    position.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const { x, y } = position.current
      element.style.setProperty('--mouse-x', `${x}px`)
      element.style.setProperty('--mouse-y', `${y}px`)
    })
  }, [])

  const style = spotlightColor
    ? ({ '--spotlight-color': spotlightColor } as CSSProperties)
    : undefined

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn('spotlight-card', className)}
      style={style}
    >
      {children}
    </div>
  )
}
