import type { UIStrings } from '../types'

/** Español. Se escribe, no se traduce — y el inglés tampoco (CLAUDE.md §3). */
export const ui: UIStrings = {
  nav: {
    projects: 'Proyectos',
    about: 'Sobre mí',
    stack: 'Stack',
    experience: 'Experiencia',
    contact: 'Contacto',
    menu: 'Abrir menú',
    primary: 'Navegación principal',
    skipToContent: 'Saltar al contenido',
  },
  hero: {
    eyebrow: 'TODO: Rol · Ciudad',
    headline: 'TODO: la frase de posicionamiento, en una afirmación corta.',
    cta: 'Ver proyectos',
    scrollHint: 'Sigue bajando',
  },
  seo: {
    titleSuffix: 'TODO: Rol',
    description:
      'TODO: 150–160 caracteres. Qué construyo, para quién y con qué. Es el texto que se lee en Google, no un eslogan.',
  },
  sections: {
    projects: {
      title: 'Proyectos',
      lead: 'Cuatro casos. El problema que había, qué construí y qué cambió.',
    },
    about: { title: 'Sobre mí' },
    stack: {
      title: 'Stack',
      lead: 'Lo que uso a diario y defendería en una revisión de código.',
    },
    experience: { title: 'Experiencia' },
    contact: {
      title: 'Contacto',
      lead: 'Si algo de aquí te encaja, escríbeme. Respondo en el día.',
    },
  },
  project: {
    context: 'Contexto',
    problem: 'Problema',
    solution: 'Solución',
    role: 'Mi rol',
    outcome: 'Resultado',
    stack: 'Stack',
    codePrivate: 'Código privado',
    underNda: 'Bajo NDA',
    viewLive: 'Ver en vivo',
    viewRepo: 'Ver repositorio',
    readCase: 'Leer el caso',
    present: 'Actualidad',
  },
  contact: {
    email: 'Escríbeme',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Descargar CV',
  },
  footer: {
    builtWith: 'Hecho con React, Tailwind y prerender estático.',
    rights: 'Todos los derechos reservados.',
  },
  theme: {
    toLight: 'Cambiar a tema claro',
    toDark: 'Cambiar a tema oscuro',
  },
  locale: {
    label: 'Idioma',
    es: 'ES',
    en: 'EN',
  },
  notFound: {
    title: 'Esta página no existe',
    body: 'El enlace puede estar mal o la página se movió.',
    back: 'Volver al inicio',
  },
}
