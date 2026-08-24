import { useEffect, useState } from 'react'

/**
 * Con `ssr: false` los componentes se renderizan en Node al hacer build, donde
 * no existe `matchMedia`. Arranca en `false` y se corrige tras hidratar; nunca
 * se toca `window` fuera del efecto.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Atajo para el suelo de accesibilidad: nada se mueve si el sistema lo pide. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
