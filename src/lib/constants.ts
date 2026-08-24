/**
 * Datos de identidad y enlaces. Fuente de verdad única: si un dato aparece
 * en dos sitios, uno de los dos está mal.
 *
 * TODO(identidad): confirmar con el dueño del portafolio antes de lanzar.
 */
export const SITE = {
  /** Sin barra final. Se usa para las URL canónicas y los hreflang. */
  url: 'https://example.com', // TODO(dominio): pendiente en CLAUDE.md §8
  name: 'TODO: Nombre',
  location: 'TODO: Ciudad, País',
  email: 'TODO@example.com',
} as const

export const LINKS = {
  github: 'https://github.com/TODO',
  linkedin: 'https://www.linkedin.com/in/TODO',
  cv: '/cv.pdf',
} as const

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'
