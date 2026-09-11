import { useEffect, useMemo, useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import {
  BASE_PITCH,
  LINE_WIDTH,
  edgeAlpha,
  meshFor,
  projectMesh,
} from '@/lib/geodesic'

/** Cuánto inclina el puntero la figura, en radianes. */
const TILT_X = 0.32
const TILT_Y = 0.2

/** Radianes por milisegundo: una vuelta cada ~45 s. Se percibe que gira, y no
    compite con el titular. */
const SPIN = 0.00014

type WireframeBallProps = {
  className?: string
  /** Nivel de subdivisión de la geodésica. Ver `meshFor`. */
  detail?: number
  /** Se llama tras pintar el primer fotograma, para retirar el placeholder. */
  onFirstFrame?: () => void
}

/**
 * Una geodésica en alambre girando despacio, dibujada en canvas 2D.
 *
 * **Por qué 2D y no un shader.** La versión raymarcheada saca el grosor de
 * línea de un umbral de distancia, y eso da un trazo blando que sobre `paper`
 * —que aquí es casi blanco— se lee como suciedad. Con geometría real la línea
 * es un hairline exacto, que es justo el lenguaje del resto de la página.
 * Coste: 42 vértices proyectados y 120 segmentos por fotograma, sin bucle
 * cuadrático y sin dependencias nuevas.
 *
 * Es decorativa. El `aria-hidden` lo pone quien la coloca, y no hay aquí
 * ninguna información que no esté ya en el texto.
 */
export function WireframeBall({
  className,
  detail = 1,
  onFirstFrame,
}: WireframeBallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const mesh = useMemo(() => meshFor(detail), [detail])

  // El callback se guarda en un ref y **no** entra en las dependencias del
  // efecto. Si entrara, pasarle una función inline desde el padre bastaría
  // para reconstruir el canvas en cada render. Así quien lo use no tiene que
  // acordarse de estabilizarlo.
  const notify = useRef(onFirstFrame)
  useEffect(() => {
    notify.current = onFirstFrame
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // El color sale del token, nunca de un hex suelto (CLAUDE.md §6). `theme`
    // está en las dependencias, así que al cambiar de modo el efecto se vuelve
    // a montar y lo relee. Se usa `muted` y no `accent` a propósito: el acento
    // ya está gastado en el titular y en el CTA, y aparece una vez por
    // pantalla (CLAUDE.md §4).
    const stroke = getComputedStyle(document.documentElement)
      .getPropertyValue('--muted')
      .trim()

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      // Por encima de 2 el coste se dobla y no se ve: se recorta.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      // Asignar `width` resetea la transformada, así que esto va después.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let notified = false
    let yaw = 0
    let tiltX = 0
    let tiltY = 0
    let targetX = 0
    let targetY = 0

    const draw = () => {
      // Debajo de `md` el contenedor está en `display:none` y el rect mide 0.
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)

      const projected = projectMesh(
        mesh,
        width,
        height,
        yaw + tiltX,
        BASE_PITCH + tiltY,
      )

      ctx.strokeStyle = stroke
      ctx.lineWidth = LINE_WIDTH
      ctx.lineCap = 'round'

      for (const [a, b] of mesh.edges) {
        const from = projected[a]
        const to = projected[b]
        // La opacidad va por `globalAlpha` en vez de componer un `rgba()`: así
        // el token puede ser hex, `rgb()` u `oklch()` sin que esto tenga que
        // parsear nada.
        ctx.globalAlpha = edgeAlpha(from, to)
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // El relevo con el SVG quieto: se avisa cuando ya hay algo pintado, no
      // al montar. Avisar antes dejaría un parpadeo en blanco entre que el
      // placeholder se va y el canvas tiene contenido. Una sola vez: esto
      // corre 60 veces por segundo.
      if (!notified) {
        notified = true
        notify.current?.()
      }
    }

    let frame = 0
    let running = false
    let last = 0

    const tick = (now: number) => {
      // Se avanza por delta y no por fotograma para que gire igual de rápido a
      // 60 y a 144 Hz. El tope evita el salto al volver de una pestaña oculta.
      const delta = last ? Math.min(now - last, 64) : 16
      last = now
      yaw += SPIN * delta
      tiltX += (targetX * TILT_X - tiltX) * 0.05
      tiltY += (targetY * TILT_Y - tiltY) * 0.05
      draw()
      frame = requestAnimationFrame(tick)
    }

    let onScreen = false

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion
      if (shouldRun === running) return
      running = shouldRun
      if (shouldRun) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = (event.clientY / window.innerHeight) * 2 - 1
    }

    const sizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    sizeObserver.observe(canvas)

    // Fuera de pantalla no se pinta. Es la diferencia entre una animación de
    // portada y un bucle que corre durante toda la visita.
    const screenObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    screenObserver.observe(canvas)

    document.addEventListener('visibilitychange', sync)
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    // Un fotograma siempre, también con `prefers-reduced-motion`: quieta, la
    // figura sigue siendo un dibujo, y apagarla del todo dejaría un hueco.
    resize()
    draw()

    return () => {
      cancelAnimationFrame(frame)
      sizeObserver.disconnect()
      screenObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [mesh, theme, reducedMotion])

  return (
    <canvas ref={canvasRef} className={cn('block h-full w-full', className)} />
  )
}
