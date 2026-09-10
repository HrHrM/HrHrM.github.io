import { useCallback, useEffect, useRef } from 'react'

import { usePrefersReducedMotion } from './useMediaQuery'

/**
 * Marca la fila que el cursor tiene a su altura y suaviza el encendido.
 *
 * Adaptado de `LineSidebar` — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Del original se conserva lo único que aporta de verdad: un solo bucle
 * `requestAnimationFrame` que interpola `--effect` (0..1) con suavizado
 * exponencial independiente del framerate. Todo lo visual se deriva de esa
 * variable en CSS, así que color, desplazamiento y escala se mueven juntos sin
 * transiciones que se desfasen. El bucle muere al asentarse.
 *
 * **Lo que se descartó, y por qué.** El original mapea la distancia del
 * puntero a cada elemento con un radio y una curva de caída, de modo que
 * varios se encienden a la vez en distinto grado. Eso funciona con etiquetas
 * de una línea en un menú; con bloques de ~250px daba dos entradas iluminadas
 * al mismo tiempo y se leía como un borrón en vez de como una selección.
 * Aquí la regla es binaria en el destino y suave en el recorrido: **está
 * activa la fila cuya banda vertical contiene el cursor**, y ninguna si el
 * cursor no está a la altura de ninguna. Sin `proximityRadius`, sin `falloff`.
 *
 * Dos cosas más que el original no resuelve:
 *
 * 1. **El contenedor manda, no la lista.** El original ata el puntero al `ul`.
 *    Si la lista es más estrecha que la sección —aquí lo es, la limita el
 *    `Container`—, mover el cursor a los márgenes dispara `pointerleave` y el
 *    efecto se apaga aunque sigas a la altura de la fila. Se ata a la sección
 *    y solo cuenta la coordenada vertical.
 * 2. **`prefers-reduced-motion`.** Con la preferencia puesta no se suscribe
 *    nada y `--effect` se queda en 0.
 */

type Options = {
  /** Constante de tiempo del suavizado, en milisegundos. */
  smoothing?: number
}

export function useNearestRow<T extends HTMLElement = HTMLElement>({
  smoothing = 140,
}: Options = {}) {
  const container = useRef<T>(null)
  const items = useRef<(HTMLElement | null)[]>([])
  const active = useRef(-1)
  const current = useRef<number[]>([])
  const frame = useRef<number | null>(null)
  const last = useRef(0)

  const reducedMotion = usePrefersReducedMotion()

  const start = useCallback(() => {
    if (frame.current !== null) return
    last.current = performance.now()

    frame.current = requestAnimationFrame(function step(now) {
      const delta = Math.min((now - last.current) / 1000, 0.05)
      last.current = now
      const blend = 1 - Math.exp(-delta / (Math.max(smoothing, 1) / 1000))

      let moving = false
      items.current.forEach((element, index) => {
        if (!element) return
        const target = index === active.current ? 1 : 0
        const value = current.current[index] ?? 0
        const next = value + (target - value) * blend
        const settled = Math.abs(target - next) < 0.0015
        const result = settled ? target : next
        current.current[index] = result
        element.style.setProperty('--effect', result.toFixed(4))
        if (!settled) moving = true
      })

      frame.current = moving ? requestAnimationFrame(step) : null
    })
  }, [smoothing])

  useEffect(() => {
    const element = container.current
    if (!element || reducedMotion) return

    const onPointerMove = (event: PointerEvent) => {
      // Solo la vertical: a la altura de una fila, da igual que el cursor esté
      // sobre el texto o en el margen. La fila es toda la banda.
      const next = items.current.findIndex((item) => {
        if (!item) return false
        const rect = item.getBoundingClientRect()
        return event.clientY >= rect.top && event.clientY <= rect.bottom
      })
      if (next === active.current) return
      active.current = next
      start()
    }

    const onPointerLeave = () => {
      if (active.current === -1) return
      active.current = -1
      start()
    }

    element.addEventListener('pointermove', onPointerMove, { passive: true })
    element.addEventListener('pointerleave', onPointerLeave)

    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', onPointerLeave)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [start, reducedMotion])

  /** `ref` para la fila de índice `index`. */
  const itemRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      items.current[index] = element
    },
    [],
  )

  return { containerRef: container, itemRef }
}
