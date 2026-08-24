import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección visible, para marcar el enlace activo en la
 * Navbar. `IntersectionObserver` solo se toca dentro del efecto: en el build
 * no existe.
 */
export function useScrollSpy(ids: string[], offset = '-45% 0px -50% 0px') {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: offset },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids, offset])

  return active
}
