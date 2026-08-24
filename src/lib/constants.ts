/**
 * Datos de identidad y enlaces. Fuente de verdad única: si un dato aparece
 * en dos sitios, uno de los dos está mal.
 *
 * El rol NO vive aquí: cambia con el idioma y está en `content/{es,en}/ui.ts`
 * (`hero.eyebrow`), porque "Ingeniero" y "Engineer" no significan lo mismo.
 */
export const SITE = {
  /** Sin barra final. Se usa para las URL canónicas y los hreflang. */
  url: 'https://example.com', // TODO(dominio): pendiente en CLAUDE.md §8
  name: 'Johnny Bohorquez',
  location: 'Caracas, Venezuela',
  email: 'johnny.phosts@gmail.com',
} as const

export const LINKS = {
  github: 'https://github.com/HrHrM',
  linkedin: 'https://www.linkedin.com/in/johnnymlr/',
  cv: '/cv.pdf', // TODO(cv): el fichero todavía no existe en public/
} as const

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'
