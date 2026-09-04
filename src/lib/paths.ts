import { DEFAULT_LOCALE, type Locale } from './constants'

/** Lee el idioma del prefijo del pathname. Sin prefijo = español. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/')
    ? 'en'
    : DEFAULT_LOCALE
}

/** Ruta de la Home en un idioma. Con una sola página por idioma, es la ruta. */
export function homePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : '/en'
}

/**
 * Traduce la ruta actual al otro idioma conservando dónde estás.
 * Es lo que necesita el selector de la Navbar: cambiar de idioma no debe
 * devolverte al inicio.
 */
export function swapLocalePath(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname)
  if (current === target) return pathname

  // Quita el prefijo de idioma para quedarnos con la ruta "desnuda".
  const bare =
    current === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname

  if (bare === '/') return homePath(target)

  // Cualquier otra ruta: se prefija tal cual y que la resuelva el router.
  return target === DEFAULT_LOCALE ? bare : `/en${bare}`
}

/** URL absoluta, para canónicas y hreflang. La raíz conserva su barra final. */
export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '')
  return path === '/' ? `${base}/` : `${base}${path}`
}
