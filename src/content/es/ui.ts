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
    eyebrow: 'Desarrollador de software · Caracas, Venezuela',
    tagline: 'Desarrollando aplicaciones web y móviles escalables.',
    taglineAccent: 'escalables.',
    cta: 'Ver experiencia',
    // «Empresas» se encuadra por alcance y no por geografía: la ubicación ya
    // la dice el eyebrow, y repetirla gastaría una de las tres celdas en un
    // dato que no habla de capacidad.
    facts: [
      { label: 'Experiencia', value: '+4 años en la industria' },
      { label: 'Empresas', value: '3 · Empresarial y multi-cliente' },
      { label: 'Núcleo', value: 'React · Angular · Flutter' },
    ],
  },
  seo: {
    titleSuffix: 'Desarrollador de software',
    description:
      'Desarrollador de software construyendo aplicaciones web y móviles escalables con React, Angular y Flutter. Casos de estudio sobre arquitectura y rendimiento.',
  },
  about: {
    paragraphs: [
      'Construyo interfaces web y móviles: React y Angular en el navegador, Flutter y React Native en dispositivos, respaldados por APIs REST y Firebase. Dado que la mayor parte de mi trabajo pertenece a clientes privados, este sitio documenta arquitectura y decisiones técnicas en lugar de capturas de pantalla de producción.',
      'Mi interés central es la mantenibilidad después del lanzamiento: rediseñar flujos activos sin romper los hábitos del usuario, desacoplar lógica de negocio compartida y estabilizar aplicaciones en hardware limitado. En las revisiones de código, priorizo nombres explícitos y límites claros entre módulos.',
      'Trabajo de forma iterativa y valoro el progreso sistemático. Mi medida de crecimiento es la disciplina arquitectónica constante por encima de los atajos a corto plazo.',
    ],
  },
  sections: {
    projects: {
      title: 'Proyectos',
      lead: 'Cinco casos de ingeniería: restricciones, arquitectura y resultados.',
    },
    about: { title: 'Sobre mí' },
    stack: {
      title: 'Stack',
      lead: 'Tecnologías principales usadas en producción y defendidas en revisiones de código.',
    },
    experience: { title: 'Experiencia', education: 'Formación' },
    contact: {
      title: 'Contacto',
      lead: 'Disponible para roles frontend a tiempo completo. Contáctame directamente a continuación.',
    },
  },
  project: {
    problem: 'Problema',
    solution: 'Solución',
    role: 'Mi rol',
    outcome: 'Resultado',
    codePrivate: 'Código privado',
    underNda: 'Bajo NDA',
    viewLive: 'Ver en vivo',
    viewRepo: 'Ver repositorio',
    viewStore: 'Ver en Play Store',
    present: 'Actualidad',
  },
  contact: {
    email: 'Escríbeme',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Descargar CV',
  },
  footer: {
    builtWith: 'Creado con React, Tailwind y pre-renderizado estático.',
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
    title: 'Esta página no existe.',
    body: 'Es posible que el enlace sea incorrecto o que la página se haya movido.',
    back: 'Volver al inicio',
  },
  error: {
    notFound: 'La página no existe.',
    unexpected: 'Un error inesperado. Vuelve a intentarlo.',
    backHome: 'Volver al inicio',
  },
}
