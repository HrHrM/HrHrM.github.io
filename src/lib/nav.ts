/**
 * Los `id` de sección son estables en los dos idiomas a propósito: un ancla
 * distinta por idioma rompería cualquier enlace compartido al cambiar de lengua.
 */
export const SECTION_IDS = [
  'experience',
  'about',
  'stack',
  'projects',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
