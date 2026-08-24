import { DEFAULT_LOCALE, type Locale } from './constants'

/**
 * El segmento de la ficha de proyecto cambia con el idioma:
 * /proyectos/:slug  ↔  /en/projects/:slug
 */
const PROJECT_SEGMENT: Record<Locale, string> = {
  es: 'proyectos',
  en: 'projects',
}

/** Lee el idioma del prefijo del pathname. Sin prefijo = español. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LOCALE
}

/** Ruta de la Home en un idioma. */
export function homePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : '/en'
}

/** Ruta de una ficha de proyecto en un idioma. */
export function projectPath(locale: Locale, slug: string): string {
  const segment = PROJECT_SEGMENT[locale]
  return locale === DEFAULT_LOCALE ? `/${segment}/${slug}` : `/en/${segment}/${slug}`
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
  const bare = current === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname

  const projectMatch = bare.match(
    new RegExp(`^/${PROJECT_SEGMENT[current]}/([^/]+)/?$`),
  )
  if (projectMatch) return projectPath(target, projectMatch[1])

  if (bare === '/') return homePath(target)

  // Cualquier otra ruta: se prefija tal cual y que la resuelva el router.
  return target === DEFAULT_LOCALE ? bare : `/en${bare}`
}

/** URL absoluta, para canónicas y hreflang. La raíz conserva su barra final. */
export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '')
  return path === '/' ? `${base}/` : `${base}${path}`
}
