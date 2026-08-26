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
    eyebrow: 'Desarrollador de software · Caracas',
    headline: 'Desarrollo soluciones de software para web y móvil.',
    cta: 'Ver proyectos',
    scrollHint: 'Sigue bajando',
  },
  seo: {
    titleSuffix: 'Desarrollador de software',
    description:
      'Desarrollador de software en Caracas. Construyo aplicaciones web y móviles con React, Angular, Flutter y Node.js. Casos de estudio de trabajo real, no demos.',
  },
  about: {
    paragraphs: [
      'Trabajo en aplicaciones web y móviles: React y Angular en el navegador, Flutter y React Native en el teléfono, y las APIs REST y Firebase que las alimentan. Casi todo lo que he construido pertenece a clientes o empleadores, así que buena parte no se puede enseñar por dentro — de ahí que aquí haya casos de estudio y no capturas de pantalla.',
      'Lo que me interesa de verdad es lo que pasa cuando algo ya está en producción y hay que cambiarlo: reordenar un flujo que la gente usa todos los días sin romperle la costumbre, sacar a piezas reutilizables lo que estaba repetido en cinco sitios, conseguir que una aplicación se sostenga en un equipo que no da para más. En una revisión de código miro primero los nombres y los límites entre módulos.',
      'Fuera del trabajo soy bastante terco. Aprendo despacio y a base de repetir, y no me molesta tardar: lo que me incomoda es acabar un mes donde lo empecé.',
    ],
  },
  sections: {
    projects: {
      title: 'Proyectos',
      lead: 'Cinco casos. El problema que había, qué construí y qué cambió.',
    },
    about: { title: 'Sobre mí' },
    stack: {
      title: 'Stack',
      lead: 'Lo que uso a diario y defendería en una revisión de código.',
    },
    experience: { title: 'Experiencia', education: 'Formación' },
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
