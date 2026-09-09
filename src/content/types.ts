/**
 * Tipos compartidos por los dos idiomas. Un solo sitio donde cambiar la forma
 * del contenido; `es/` y `en/` solo aportan el texto.
 */

export type Visibility = 'public' | 'private' | 'nda'

export type Project = {
  slug: string
  title: string
  /** Una línea. El titular del caso, debajo del título de la tarjeta. */
  tagline: string
  /** Sector y escala: "Retail · ~80k pedidos/mes". */
  context: string
  /** Qué dolía. */
  problem: string
  /** Qué construí. */
  solution: string
  /** Mi contribución concreta, separada de la del equipo. Primera persona. */
  role: string
  /** Qué cambió. Números solo si son reales y publicables. */
  outcome?: string
  stack: string[]
  /**
   * Opcional a propósito: mientras no haya capturas propias, la tarjeta se
   * sostiene con tipografía. Un `cover` falso es peor que no tener ninguno.
   */
  cover?: string
  links: { live?: string; repo?: string }
  visibility: Visibility
  featured: boolean
  year: number
}

export type ExperienceItem = {
  company: string
  role: string
  /** "2023" o "2023-04". Se formatea en la vista, no aquí. */
  start: string
  /** `null` = puesto actual. */
  end: string | null
  summary: string
  highlights?: string[]
}

export type EducationItem = {
  institution: string
  degree: string
  start: string
  end: string
  /** El proyecto de tesis, si aporta algo técnico. */
  note?: string
}

/**
 * Los grupos siguen la estructura del CV, que separa lo que son cosas distintas:
 * un lenguaje no es un framework, y un servicio gestionado no es una librería.
 * Mezclarlos —"Frontend: React, TypeScript, HTML"— es lo que delata un stack
 * escrito de memoria.
 */
export type SkillGroupId =
  'languages' | 'frameworks' | 'services' | 'tooling' | 'spoken'

export type SkillGroup = {
  id: SkillGroupId
  label: string
  /** Sin niveles ni porcentajes. Nadie sabe qué significa "React 87%". */
  items: string[]
}

/** Todo el texto de chrome. Si una cadena se ve en pantalla, sale de aquí. */
export type UIStrings = {
  nav: {
    projects: string
    about: string
    stack: string
    experience: string
    contact: string
    /** Etiqueta accesible del botón de menú en móvil. */
    menu: string
    /** Nombre accesible de la navegación principal. */
    primary: string
    /** Primer enlace tabulable de la página. */
    skipToContent: string
  }
  hero: {
    /** Rol y ubicación, en mono, encima del nombre. */
    eyebrow: string
    /**
     * La frase de posicionamiento, debajo del nombre.
     *
     * **No es el `<h1>`.** El titular es el nombre, y sale de `SITE.name` en
     * `constants.ts` porque un nombre propio no se traduce. Esto sí vive por
     * idioma: es la frase que dice qué hace, y es el texto que más trabaja de
     * la página después del nombre.
     */
    tagline: string
    /**
     * El trozo de `tagline` que va en color de acento: el único acento del
     * primer viewport. Tiene que aparecer **literalmente** dentro de
     * `tagline`, o no se resalta nada y la frase se pinta entera en `muted`.
     *
     * Se declara por idioma en vez de deducirse como "última palabra" porque
     * no cae en el mismo sitio: en español cierra la frase («escalables.») y
     * en inglés va en medio («scalable»).
     */
    taglineAccent: string
    cta: string
    /**
     * El zócalo de datos duros bajo el CTA: tres celdas separadas por
     * hairlines que aterrizan el titular con parámetros comprobables antes de
     * que el visitante llegue a la primera sección.
     */
    facts: { label: string; value: string }[]
  }
  seo: {
    /** Se concatena al nombre: "Nombre — {titleSuffix}". */
    titleSuffix: string
    /** 150–160 caracteres. Es lo que se lee en el resultado de búsqueda. */
    description: string
  }
  /**
   * Los párrafos de Sobre mí. Estaban incrustados en el JSX de About.tsx, que
   * rompe la regla 2 del CLAUDE.md §3: nada de datos hardcodeados en JSX.
   */
  about: { paragraphs: string[] }
  sections: {
    projects: { title: string; lead: string }
    about: { title: string }
    stack: { title: string; lead: string }
    experience: { title: string; education: string }
    contact: { title: string; lead: string }
  }
  project: {
    /**
     * Etiquetas de los tres bloques de la tarjeta. `context` no tiene
     * etiqueta: va en la columna de metadatos, sin rótulo.
     */
    problem: string
    solution: string
    role: string
    outcome: string
    /** Estados de `visibility`. */
    codePrivate: string
    underNda: string
    viewLive: string
    viewRepo: string
    /** Puesto actual, en el rango de fechas de Experiencia. */
    present: string
  }
  contact: {
    email: string
    github: string
    linkedin: string
    cv: string
  }
  footer: {
    builtWith: string
    rights: string
  }
  theme: {
    toLight: string
    toDark: string
  }
  locale: {
    /** Etiqueta accesible del selector de idioma. */
    label: string
    es: string
    en: string
  }
  notFound: {
    title: string
    body: string
    back: string
  }
  /**
   * El `ErrorBoundary` de `root.tsx`, que se pinta cuando la ruta revienta
   * antes de llegar a una página. Está separado de `notFound` porque cubre
   * dos casos distintos: un 404 del router y un error inesperado.
   */
  error: {
    notFound: string
    unexpected: string
    backHome: string
  }
}

/** Lo que consume una página entera. `useLocale()` devuelve esto. */
export type ContentBundle = {
  projects: Project[]
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  ui: UIStrings
}
