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
  /**
   * Un PDF por idioma: quien entra en /en no debería descargar el CV en
   * español. Los ficheros van en `public/` con estos nombres exactos.
   *
   * El nombre lleva el suyo a propósito: es el que acaba en la carpeta de
   * descargas de quien lo baja, y «cv-en.pdf» ahí no dice de quién es.
   * Comprobado con el texto de cada PDF, no por el sufijo: el que no lleva
   * `_ES` abre con «SOFTWARE DEVELOPER» y el otro con «DESARROLLADOR DE
   * SOFTWARE».
   *
   * Sin hash en el nombre, así que al reemplazarlos hay que contar con la
   * caché del navegador (CLAUDE.md §8).
   */
  cv: {
    es: '/Johnny_Bohorquez_CV_ES.pdf',
    en: '/Johnny_Bohorquez_CV.pdf',
  },
} as const

/**
 * Los tres items del Stack que enlazan, y los únicos con hover.
 *
 * No enlaza todo a propósito: nadie pulsa «React» para ir a react.dev, y
 * veintiún enlaces que no informan son ruido. Estos tres sí — son los que un
 * lector no reconoce y sobre los que querría saber qué son.
 *
 * Vive aquí y no en `content/{es,en}/skills.ts` porque una URL no se traduce;
 * duplicarla por idioma es pedir que un día apunten a sitios distintos.
 *
 * **La clave es el nombre del item tal cual aparece en `skills.ts`.** Son
 * nombres propios y hoy coinciden en los dos idiomas; si alguno se renombra en
 * un solo bundle, ese item se queda sin enlace en silencio.
 */
export const STACK_LINKS: Record<string, string> = {
  'spec-kit': 'https://github.com/github/spec-kit',
  Maestro: 'https://maestro.dev',
  Pencil: 'https://pen.dev',
}

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'
