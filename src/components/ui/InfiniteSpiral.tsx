import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

import './InfiniteSpiral.css'

/**
 * InfiniteSpiral — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Port a TypeScript del original en JS. La matemática de la hélice es la suya,
 * sin tocar. Lo que cambia está marcado con «CAMBIO»:
 *
 * 1. **El bucle no se apagaba nunca.** El original reencola
 *    `requestAnimationFrame` en cada fotograma pase lo que pase: usa
 *    `visibleRef` solo para decidir la velocidad, así que fuera de pantalla
 *    seguía escribiendo `transform`, `opacity`, `filter` y `zIndex` sobre cada
 *    tarjeta a 60 fps durante toda la visita. Aquí se usa el mismo patrón de
 *    `sync()` que `WireframeBall`: el bucle arranca y para con el
 *    `IntersectionObserver` y con `visibilitychange`.
 * 2. **`prefers-reduced-motion` solo frenaba lo automático.** Se lee con el
 *    hook del proyecto y apaga la espiral entera —automático, arrastre y
 *    scroll—, dejándola en una composición quieta. Es lo mismo que hacen las
 *    otras dos animadas de la página.
 * 3. **`cardRefs` no se recortaba.** Al bajar el número de imágenes quedaban
 *    nodos desmontados en el array y el bucle seguía escribiéndoles estilos.
 * 4. Sin `role="list"`. Un contenedor 3D de imágenes decorativas no es una
 *    lista; quien lo coloca decide si el bloque entero va con `aria-hidden`.
 *
 * **Ojo al pasar `items`:** entra en las dependencias del efecto a través de
 * un `useMemo`. Un array literal en el JSX cambia de identidad en cada render
 * y remonta el bucle entero. Declárese en el ámbito del módulo.
 */

/**
 * Un panel de la espiral: o una imagen (`src`) o un trazo SVG (`path`).
 *
 * Los dos casos existen porque no son la misma cosa. Una foto se recorta a
 * `cover` y llena el panel; un logo es un glifo que tiene que ir centrado, con
 * aire alrededor y pintado con un token nuestro. Meterlos por el mismo camino
 * obligaría a maquillar un `<img>` para que se comportara como un icono.
 */
export type SpiralItem = {
  src?: string
  /** Trazo de un SVG de 24×24. Se pinta con `currentColor`. */
  path?: string
  alt?: string
  href?: string
  target?: string
  label?: string
  id?: string
}

type InfiniteSpiralProps = {
  items?: readonly (string | SpiralItem)[]
  /** Tarjetas por segundo, y sensibilidad del modo `scroll`. */
  speed?: number
  direction?: 'up' | 'down'
  animationMode?: 'auto' | 'drag' | 'scroll' | 'all'
  /** Radio en profundidad de la hélice, en píxeles. */
  radius?: number
  cardWidth?: number
  cardHeight?: number
  verticalSpacing?: number
  perspective?: number
  /** Cuántas tarjetas componen una vuelta completa. */
  cardsPerTurn?: number
  rotation?: number
  cardTilt?: number
  cardRadius?: number
  centerScale?: number
  /** Fracción del recorrido exterior que se usa para el desvanecido. */
  edgeFade?: number
  edgeBlur?: number
  pauseOnHover?: boolean
  imageFit?: 'cover' | 'contain'
  /** De 0 a 1. */
  grayscale?: number
  className?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const modulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor

const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1)
  return x * x * (3 - 2 * x)
}

export function InfiniteSpiral({
  items = [],
  speed = 0.55,
  direction = 'up',
  animationMode = 'auto',
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = 'cover',
  grayscale = 0,
  className,
}: InfiniteSpiralProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const autoSpeedRef = useRef(0)
  const hoveredRef = useRef(false)
  const draggingRef = useRef(false)
  const lastPointerYRef = useRef(0)
  const dragMovedRef = useRef(false)

  const reducedMotion = usePrefersReducedMotion()

  const normalizedItems = useMemo(
    () =>
      items.map<SpiralItem>((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `Imagen ${index + 1} de la espiral` }
          : { alt: `Imagen ${index + 1} de la espiral`, ...item },
      ),
    [items],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root || normalizedItems.length === 0) return

    // CAMBIO — los nodos sobrantes de un render anterior no pueden quedarse:
    // el bucle recorre el array entero y les escribiría estilos.
    cardRefs.current.length = normalizedItems.length

    let bounds = root.getBoundingClientRect()
    const scrollEnabled =
      !reducedMotion && (animationMode === 'scroll' || animationMode === 'all')
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55
    let lastScrollY = window.scrollY

    /** Coloca las tarjetas para el `progress` actual. Un fotograma. */
    const layout = () => {
      const count = normalizedItems.length
      const half = count / 2
      const width = Math.max(bounds.width, 1)
      const height = Math.max(bounds.height, 1)
      const fit = Math.min(
        1,
        width / (cardWidth * 2.8),
        height / (cardHeight * 2.35),
      )
      const responsiveRadius =
        Math.min(radius, Math.max(72, width * 0.36)) * fit
      const fadeStart = clamp(1 - edgeFade, 0, 0.98)
      const turnSize = Math.max(cardsPerTurn, 1)

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        let offset = index - progressRef.current
        offset = modulo(offset + half, count) - half

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1)
        const opacity = 1 - smoothstep(fadeStart, 1, edge)
        const focus =
          1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1)
        const scale = (1 + (centerScale - 1) * focus) * fit
        const angle = offset * (360 / turnSize) + rotation
        const angleRadians = (angle * Math.PI) / 180
        const x = Math.sin(angleRadians) * responsiveRadius
        const z = Math.cos(angleRadians) * responsiveRadius
        const depthScale = clamp(
          perspective / Math.max(perspective - z, 1),
          0.72,
          1.45,
        )
        const visualScale = scale * depthScale
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2
        const blur = edgeBlur * smoothstep(0.35, 1, edge)

        card.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0)` +
          ` rotateZ(${cardTilt}deg) scale(${visualScale})`
        card.style.opacity = opacity.toFixed(3)
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none'
        card.style.zIndex = String(Math.round(depth * 100000) + index)
        card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none'
      })
    }

    let frame = 0
    let running = false
    let previousTime = 0

    const tick = (time: number) => {
      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.05)
        : 0.016
      previousTime = time

      const autoEnabled = animationMode === 'auto' || animationMode === 'all'
      const motionPaused =
        draggingRef.current || (pauseOnHover && hoveredRef.current)
      const directionMultiplier = direction === 'down' ? -1 : 1
      const desiredAutoSpeed =
        autoEnabled && !motionPaused ? speed * directionMultiplier : 0

      const speedBlend = 1 - Math.exp(-delta * 7)
      autoSpeedRef.current +=
        (desiredAutoSpeed - autoSpeedRef.current) * speedBlend
      targetProgressRef.current += autoSpeedRef.current * delta

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11))
      progressRef.current +=
        (targetProgressRef.current - progressRef.current) * followBlend

      layout()
      frame = requestAnimationFrame(tick)
    }

    let onScreen = false

    // CAMBIO — el bucle vive solo mientras la espiral está en pantalla y la
    // pestaña visible. Es la diferencia entre una animación de sección y un
    // rAF corriendo durante toda la visita.
    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion
      if (shouldRun === running) return
      running = shouldRun
      if (shouldRun) {
        previousTime = 0
        frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    const handleScroll = () => {
      const nextScrollY = window.scrollY
      const scrollDelta = nextScrollY - lastScrollY
      lastScrollY = nextScrollY
      if (!scrollEnabled || !onScreen || scrollDelta === 0) return
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) /
          Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5,
      )
    }

    const sizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect()
      layout()
    })
    sizeObserver.observe(root)

    const screenObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { threshold: 0.02 },
    )
    screenObserver.observe(root)

    document.addEventListener('visibilitychange', sync)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Un fotograma siempre, también con `prefers-reduced-motion`: quieta, la
    // espiral sigue siendo una composición, y apagarla dejaría un hueco.
    layout()

    return () => {
      cancelAnimationFrame(frame)
      sizeObserver.disconnect()
      screenObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
    reducedMotion,
  ])

  const dragEnabled =
    !reducedMotion && (animationMode === 'drag' || animationMode === 'all')

  const rootStyle: CSSProperties = {
    perspective: `${perspective}px`,
    cursor: dragEnabled ? 'grab' : 'default',
    touchAction: dragEnabled ? 'pan-x' : 'auto',
    userSelect: dragEnabled ? 'none' : 'auto',
  }

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default'
  }

  return (
    <div
      ref={rootRef}
      className={cn('infinite-spiral', className)}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return
        draggingRef.current = true
        dragMovedRef.current = false
        lastPointerYRef.current = event.clientY
        targetProgressRef.current = progressRef.current
        event.currentTarget.setPointerCapture(event.pointerId)
        event.currentTarget.style.cursor = 'grabbing'
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return
        const pointerDelta = event.clientY - lastPointerYRef.current
        lastPointerYRef.current = event.clientY
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1)
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        // Soltar el arrastre encima de una tarjeta no debe abrir su enlace.
        if (!dragMovedRef.current) return
        event.preventDefault()
        event.stopPropagation()
        dragMovedRef.current = false
      }}
    >
      <div className="infinite-spiral__stage">
        {normalizedItems.map((item, index) => {
          const style: CSSProperties = {
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardRadius,
          }
          const setRef = (node: HTMLElement | null) => {
            cardRefs.current[index] = node
          }

          // Un glifo, no una foto: `contain` implícito, centrado y con aire,
          // y el color sale del token en vez de un filtro sobre píxeles.
          const media = item.path ? (
            <svg
              className="infinite-spiral__glyph"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d={item.path} fill="currentColor" />
            </svg>
          ) : (
            <img
              className="infinite-spiral__image"
              src={item.src}
              alt={item.alt ?? ''}
              // CAMBIO — el original pide las seis primeras en `eager`. React
              // 19 traduce eso a un `<link rel="preload">` en el HTML
              // prerenderizado, así que seis imágenes de un tercero se
              // descargaban antes de que el visitante bajara a la sección. La
              // espiral nunca está sobre el pliegue en este sitio.
              loading="lazy"
              fetchPriority="low"
              draggable={false}
              style={{
                width: cardWidth,
                height: cardHeight,
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: imageFit,
                filter: `grayscale(${clamp(grayscale, 0, 1)})`,
              }}
            />
          )

          return item.href ? (
            <a
              key={item.id ?? item.src ?? item.label ?? index}
              ref={setRef}
              className="infinite-spiral__item"
              style={style}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
              aria-label={item.label ?? item.alt}
            >
              {media}
            </a>
          ) : (
            <div
              key={item.id ?? item.src ?? item.label ?? index}
              ref={setRef}
              className="infinite-spiral__item"
              style={style}
            >
              {media}
            </div>
          )
        })}
      </div>
    </div>
  )
}
