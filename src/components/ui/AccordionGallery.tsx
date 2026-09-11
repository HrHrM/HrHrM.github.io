import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'

import { cn } from '@/lib/cn'

import './AccordionGallery.css'

/**
 * AccordionGallery — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Paneles que se expanden al pasar el cursor o al enfocarlos.
 *
 * **Sin GSAP, que es la dependencia que pedía el original.** Todo lo que
 * anima —`flex-grow`, `transform`, `filter`, `opacity`— tiene transición
 * nativa en CSS. React solo decide qué panel está activo y lo publica en un
 * `data-active`; el resto es hoja de estilos. Ahorra ~23 KB gzip en un sitio
 * cuyo CSS entero pesa 8,5 KB, y de paso las transiciones las gestiona el
 * compositor en vez de una timeline en el hilo principal.
 *
 * Tres cambios más:
 *
 * 1. **Los paneles sin enlace son `<button>`, no `<div tabIndex={0}>`.** El
 *    original hace focusable un `div` sin rol: el lector de pantalla anuncia
 *    algo que no dice qué es ni qué hace. Expandir un panel *es* una acción,
 *    así que le corresponde un botón; y cuando hay enlace, un `<a>`, que ya es
 *    focusable por sí mismo.
 * 2. **Sin `role="list"` / `role="listitem"`.** Estaban puestos sobre enlaces
 *    y botones, lo que sustituye su rol propio por el de elemento de lista.
 * 3. **`prefers-reduced-motion` se lee del CSS, no de `matchMedia` en el
 *    render.** El original lo consulta en el cuerpo del componente, y con
 *    `ssr: false` eso se ejecuta en Node al construir (CLAUDE.md §2).
 */

export type GalleryItem = {
  image: string
  label?: string
  link?: string
  alt?: string
}

type AccordionGalleryProps = {
  items: readonly GalleryItem[]
  /** Panel abierto al cargar, para que la galería nunca se vea muerta. */
  defaultIndex?: number
  /** Fracción de la fila que ocupa el panel abierto (0.2 – 0.9). */
  expandRatio?: number
  orientation?: 'horizontal' | 'vertical'
  /** Alto de la fila en píxeles. */
  height?: number
  gap?: number
  /** Grados de giro de los paneles cerrados. */
  tilt?: number
  /** Fuerza de la deriva interna de la imagen. 0 la desactiva. */
  parallax?: number
  /** Desatura los paneles cerrados. */
  grayscale?: boolean
  showLabels?: boolean
  trigger?: 'hover' | 'click'
  className?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function AccordionGallery({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  orientation = 'horizontal',
  height = 460,
  gap = 10,
  tilt = 8,
  parallax = 0.5,
  grayscale = true,
  showLabels = true,
  trigger = 'hover',
  className,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const count = items.length
  const vertical = orientation === 'vertical'
  const [active, setActive] = useState(clamp(defaultIndex, 0, count - 1))

  // El ancho de la imagen se mide en vez de calcularse: el panel abierto es
  // más ancho que su hueco, y de ahí sale la deriva al resizear.
  useEffect(() => {
    const element = rootRef.current
    if (!element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const total = vertical ? rect.height : rect.width
      const usable = Math.max(total - gap * (count - 1), 120)
      const size = Math.max(140, usable * clamp(expandRatio, 0.2, 0.9) * 1.22)
      element.style.setProperty('--ag-media', `${size}px`)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [count, expandRatio, gap, vertical])

  const ratio = clamp(expandRatio, 0.2, 0.9)
  const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1

  const onKeyDown = (index: number) => (event: KeyboardEvent) => {
    const next = vertical ? 'ArrowDown' : 'ArrowRight'
    const previous = vertical ? 'ArrowUp' : 'ArrowLeft'
    if (event.key === next) {
      event.preventDefault()
      setActive((index + 1) % count)
    } else if (event.key === previous) {
      event.preventDefault()
      setActive((index - 1 + count) % count)
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        'accordion-gallery',
        vertical && 'accordion-gallery--vertical',
        grayscale && 'accordion-gallery--gray',
        className,
      )}
      style={
        {
          '--ag-gap': `${gap}px`,
          height: vertical ? Math.round(height * 1.6) : height,
        } as CSSProperties
      }
    >
      {items.map((item, index) => {
        const isActive = index === active
        const rotation = isActive ? 0 : index < active ? tilt : -tilt
        // La imagen se desplaza en sentido contrario al panel, que es lo que
        // da la sensación de profundidad al abrirse.
        const drift = clamp(active - index, -1.5, 1.5) * parallax * 0.06

        const style = {
          flexGrow: isActive ? grow : 1,
          transform: isActive
            ? undefined
            : vertical
              ? `rotateX(${-rotation}deg)`
              : `rotateY(${rotation}deg)`,
          '--ag-drift': isActive
            ? '0px'
            : `calc(var(--ag-media) * ${drift.toFixed(4)})`,
        } as CSSProperties

        const inner = (
          <>
            <span className="ag-panel__frame">
              <span className="ag-panel__media">
                <img
                  src={item.image}
                  alt={item.alt ?? ''}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
              <span aria-hidden="true" className="ag-panel__overlay" />
            </span>
            {showLabels && item.label ? (
              <span aria-hidden="true" className="ag-panel__label">
                <span className="ag-panel__bar" />
                <span className="ag-panel__text">{item.label}</span>
              </span>
            ) : null}
          </>
        )

        const shared = {
          className: 'ag-panel',
          style,
          'data-active': isActive,
          onMouseEnter: () => trigger === 'hover' && setActive(index),
          onFocus: () => setActive(index),
          onKeyDown: onKeyDown(index),
        }

        return item.link ? (
          <a
            key={item.image}
            {...shared}
            href={item.link}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.label}
            onClick={(event) => {
              // El primer toque abre el panel; el segundo sigue el enlace.
              if (!isActive) {
                event.preventDefault()
                setActive(index)
              }
            }}
          >
            {inner}
          </a>
        ) : (
          <button
            key={item.image}
            {...shared}
            type="button"
            aria-label={item.label}
            aria-pressed={isActive}
            onClick={() => setActive(index)}
          >
            {inner}
          </button>
        )
      })}
    </div>
  )
}
