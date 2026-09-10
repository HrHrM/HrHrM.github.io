/**
 * Los `id` de sección son estables en los dos idiomas a propósito: un ancla
 * distinta por idioma rompería cualquier enlace compartido al cambiar de lengua.
 */
/**
 * **El orden tiene que coincidir con el de `pages/Home.tsx`.** De aquí salen
 * los enlaces de la Navbar y el scroll spy: si las dos listas divergen, el
 * indicador de sección activa se enciende en el enlace equivocado.
 */
export const SECTION_IDS = [
  'about',
  'experience',
  'projects',
  'stack',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
