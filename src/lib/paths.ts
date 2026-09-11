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

/**
 * URL absoluta, para canónicas, hreflang, sitemap y `og:image`.
 *
 * **Las rutas de página acaban en barra, y no es cosmético.** El sitio se
 * publica en GitHub Pages, donde `/en` es en realidad el fichero
 * `en/index.html`: pedir `/en` devuelve un **301** hacia `/en/`. Medido en
 * producción. Declarar como canónica una URL que redirige es un error que no
 * avisa —Google sigue el 301 y la indexa igual— pero lo recomendado es que la
 * canónica responda 200 directamente, y lo mismo vale para los `hreflang` y
 * para cada `<loc>` del sitemap.
 *
 * La barra se añade solo si la ruta no tiene extensión: `/og-es.png` es un
 * fichero y con barra final daría un 404.
 */
export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '')
  const isFile = /\.[a-z0-9]+$/i.test(path)
  const withSlash = isFile || path.endsWith('/') ? path : `${path}/`
  return `${base}${withSlash}`
}
