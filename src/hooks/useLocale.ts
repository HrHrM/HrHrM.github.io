import { useLocation } from 'react-router'

import { content } from '@/content'
import { localeFromPath, homePath, swapLocalePath } from '@/lib/paths'

/**
 * Único punto de entrada al contenido desde los componentes.
 * Lee el idioma del pathname y devuelve el bundle correcto ya resuelto,
 * más los helpers de ruta para no repetir la lógica de prefijos.
 */
export function useLocale() {
  const { pathname } = useLocation()
  const locale = localeFromPath(pathname)

  return {
    locale,
    ...content[locale],
    home: homePath(locale),
    swapTo: (target: Parameters<typeof swapLocalePath>[1]) =>
      swapLocalePath(pathname, target),
  }
}
