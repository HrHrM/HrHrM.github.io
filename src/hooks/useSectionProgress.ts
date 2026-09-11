import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * Cuánto se lleva recorrido de la sección `id`, de 0 a 1.
 *
 * 0 cuando su borde superior toca el borde inferior de la ventana; 1 cuando su
 * borde inferior toca el superior. Es decir, mide el paso de la sección por la
 * pantalla, no la posición absoluta en el documento: es lo que hace que el
 * valor sea comparable entre secciones de alturas muy distintas.
 *
 * **Solo escucha mientras la sección está en pantalla.** Un `scroll` global
 * activo durante toda la visita para mover un adorno no se sostiene, así que
 * un `IntersectionObserver` engancha y desengancha el listener.
 *
 * La lectura va agrupada en un `requestAnimationFrame`: `scroll` puede emitir
 * varias veces entre dos fotogramas y cada `getBoundingClientRect` fuerza un
 * cálculo de layout que nadie llega a ver.
 */
export function useSectionProgress(id: string): number {
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) return

    const measure = () => {
      frame.current = null
      const rect = element.getBoundingClientRect()
      const span = rect.height + window.innerHeight
      if (span <= 0) return
      const passed = window.innerHeight - rect.top
      setProgress(Math.min(Math.max(passed / span, 0), 1))
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(measure)
    }

    let listening = false
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === listening) return
      listening = entry.isIntersecting
      if (listening) {
        window.addEventListener('scroll', onScroll, { passive: true })
        measure()
      } else {
        window.removeEventListener('scroll', onScroll)
      }
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [id, pathname])

  return progress
}
