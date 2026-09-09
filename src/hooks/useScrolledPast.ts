import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * `true` cuando el elemento ya ha salido por arriba, por encima de la línea de
 * la Navbar. Se usa para que la barra solo aparezca a partir de la segunda
 * sección: sobre el Hero estorba, y lo que hay debajo sí necesita navegación.
 *
 * Dos detalles que no son evidentes:
 *
 * - **Sin el elemento, `true`.** La 404 no monta el Hero, y ahí el estado por
 *   defecto tiene que ser la barra completa: es la única forma de volver.
 * - **Arranca en `false`**, que es el estado correcto en la primera pintada
 *   porque la página siempre carga arriba del todo. Si se entra por un enlace
 *   con ancla, el observer corrige en el primer fotograma.
 *
 * `IntersectionObserver` solo se toca dentro del efecto: en el build,
 * que renderiza en Node, no existe (CLAUDE.md §2).
 *
 * **El offset por defecto es 96 y no 64, que es lo que mide la barra.** Tiene
 * que superar el `scroll-padding-top` de `index.css`, que son 80px: al saltar
 * por un ancla, el navegador deja el destino a esa distancia del borde, así
 * que la sección anterior todavía asoma 80px por arriba. Con 64 el CTA «Ver
 * experiencia» aterrizaba en 782 y el cambio no ocurría hasta 798 — se llegaba
 * a Experiencia con la navegación aún escondida. Medido, no estimado: 96 deja
 * 16px de holgura.
 */
export function useScrolledPast(id: string, offset = 96): boolean {
  const [past, setPast] = useState(false)

  // Cambiar de idioma es una navegación: React desmonta la página entera y
  // monta otra, con un `#hero` que es un nodo **distinto**. El observer se
  // quedaba mirando el nodo viejo, ya desconectado del documento, y un nodo
  // huérfano no vuelve a emitir nunca: la barra se congelaba en el estado que
  // tuviera al cambiar de lengua. Por eso el `pathname` es una dependencia —
  // es lo que obliga a volver a suscribirse al Hero nuevo.
  //
  // Va el `pathname` y no `location` entero para que las anclas (`#experience`)
  // no tiren el observer en cada salto: ahí el Hero sigue siendo el mismo nodo.
  const { pathname } = useLocation()

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) {
      setPast(true)
      return
    }

    // El margen negativo sube el borde superior de la raíz hasta donde acaba
    // la barra, así que el elemento deja de intersecar justo cuando termina de
    // pasar por debajo de ella, y no cuando se sale de la ventana.
    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      { rootMargin: `-${offset}px 0px 0px 0px` },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [id, offset, pathname])

  return past
}
