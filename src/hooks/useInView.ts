import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * ¿Está la sección `id` dentro del viewport?
 *
 * Hermano de `useScrolledPast`, y separado a propósito: aquel responde «ya
 * pasé de aquí» y este «estoy aquí». Mezclarlos en un hook con una bandera
 * habría dado dos comportamientos distintos escondidos tras un booleano.
 *
 * `pathname` entra en las dependencias por la misma razón que allí: cambiar de
 * idioma reemplaza el nodo de la sección, y sin reobservar el observador se
 * queda mirando un elemento que ya no está en el documento.
 *
 * `rootMargin` negativo arriba y abajo: la sección cuenta como «en pantalla»
 * cuando ocupa el centro, no en cuanto asoma un píxel. Si no, en el límite
 * entre dos secciones las dos estarían dentro a la vez.
 */
export function useInView(id: string, margin = '-35% 0px -35% 0px'): boolean {
  const [inView, setInView] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [id, margin, pathname])

  return inView
}
