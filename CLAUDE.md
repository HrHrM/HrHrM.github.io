# Portafolio — Contexto del proyecto

Documento de referencia para cualquier sesión de trabajo en este repo.
Si algo de aquí contradice lo que hay en el código, gana el código: actualiza este archivo.

---

## 1. Objetivo

Portafolio personal de desarrollador. Un reclutador o cliente entra, entiende en
30 segundos quién soy y qué he construido, y encuentra cómo contactarme.

Métrica de éxito: que los proyectos se entiendan sin leerme el CV.
Todo lo demás en la página está al servicio de eso.

**No es** un blog, ni un playground de animaciones, ni una demo de librerías.

---

## 2. Stack

| Capa       | Elección                                  | Nota                                                                  |
| ---------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Build      | Vite + React + TypeScript                 |                                                                       |
| Estilos    | Tailwind CSS v4                           | plugin `@tailwindcss/vite`                                            |
| Rutas      | React Router 7                            | `routes.ts`, rutas explícitas. **No** v8: exige Node ≥ 22.22.0        |
| Prerender  | React Router framework mode               | `@react-router/dev`, `ssr: false` + `prerender` → un `.html` por ruta |
| Animación  | CSS (`@keyframes`)                        | una sola, en el Hero. `motion` **no** está instalado                  |
| Iconos     | `lucide-react`                            |                                                                       |
| Formulario | `react-hook-form` + `zod`                 | envío vía Formspree / Web3Forms                                       |
| Lint       | Oxlint                                    | `.oxlintrc.json`, sin ESLint                                          |
| Formato    | Prettier (o `oxfmt`)                      |                                                                       |
| Utilidades | `clsx` + `tailwind-merge` → helper `cn()` |                                                                       |
| Deploy     | GitHub Pages / Vercel / Netlify           | el `buildEnd` deja `404.html` y `.nojekyll`                           |

### Gotchas que cuestan tiempo

- **Tailwind v4 no usa `tailwind.config.js` ni PostCSS.** Se añade `tailwindcss()`
  a los plugins de `vite.config.ts`, y en el CSS va `@import "tailwindcss";`.
  Nada de las tres directivas `@tailwind` de v3 — mucho tutorial sigue enseñando eso.
- **Los tokens de diseño viven en `@theme`**, dentro de `src/styles/index.css`.
  Ese bloque es la única fuente de verdad de color, tipografía y escala.
- **Tailwind v4 no trae modo oscuro por clase.** Hay que declararlo a mano:
  `@custom-variant dark (&:where(.dark, .dark *));`. Sin esa línea, `dark:` no
  responde a la clase que pone el script anti-flash y el tema oscuro no existe.
- **React Router en framework mode no usa `main.tsx` ni `index.html`.** Manda
  `root.tsx` (que renderiza el `<html>` entero) y `routes.ts`. `appDirectory: "src"`
  conserva el árbol de abajo en vez del `app/` por defecto.
- **`@react-router/node` tiene que estar en `dependencies`, no en `devDependencies`.**
  El build lee literalmente `pkg.dependencies` para decidir el runtime de servidor;
  con `-D` falla con «Could not determine server runtime» aunque el paquete esté
  instalado. Lo mismo con `isbot`.
- **El typegen necesita un solo `tsconfig.json`.** Requiere
  `rootDirs: [".", "./.react-router/types"]` y el `include` de
  `.react-router/types/**/*`; con project references (`tsconfig.app.json` +
  `tsconfig.node.json`) no se resuelve. Por eso hay un único tsconfig.
- **Con `ssr: false` el build renderiza en Node.** Tocar `window`, `document`,
  `localStorage` o `matchMedia` en el cuerpo de un componente rompe el build:
  siempre dentro de `useEffect`.
- **No hay rutas dinámicas.** `prerender` enumera dos rutas, `/` y `/en`, y del
  mismo listado salen `sitemap.xml` y `robots.txt` en el `buildEnd`. Si algún día
  vuelven las fichas de proyecto hay que enumerar cada slug a mano: con
  `ssr: false` las rutas dinámicas no se descubren solas. `action` y `headers`
  tampoco están disponibles.
- **`viteConfig.build.outDir` en `buildEnd` es `dist`, no `dist/client`.** Es el
  directorio raíz del build; lo servible está un nivel más abajo. Escribir ahí
  deja el fichero fuera de lo que publica el host, y sin error: `sitemap.xml` y
  `robots.txt` estuvieron meses en `dist/` sin que se notara. La ruta correcta es
  `path.join(viteConfig.build.outDir, 'client')`.
- **En GitHub Pages hacen falta dos ficheros más**, y los escribe el `buildEnd`:
  `404.html` (copia del `__spa-fallback.html`, para que un refresco en una ruta
  desconocida no dé un 404 del host) y `.nojekyll` (sin él, Jekyll descarta todo
  lo que empieza por `_`, incluido ese fallback). **Ojo si se publica como
  _project page_** (`usuario.github.io/mi-portafolio/`): todas las rutas
  absolutas se rompen y haría falta `base` en Vite y `basename` en el router.
  Con dominio propio o _user page_ no hay nada que hacer.
- **`lucide-react` v1 ya no trae iconos de marca.** GitHub y LinkedIn van como SVG
  inline en `components/ui/BrandIcon.tsx`.
- **El parpadeo de HTML sin estilo al recargar solo pasa en `npm run dev`.**
  El dev server de Vite inyecta el CSS por JS para poder hacer HMR, así que el
  HTML se pinta antes de que existan los estilos. En el build el CSS es un
  `<link>` bloqueante en el `<head>`, y el primer fotograma pintado ya sale
  con estilos — verificado capturando fotogramas con red a 300 kbps. No hay
  nada que arreglar: si se quiere comprobar cómo lo ve un visitante, hay que
  mirar `npm run build` servido, no el dev server.
- **Oxlint es linter, no formateador.** No sustituye a Prettier.

---

## 3. Arquitectura

SPA por capas con **el contenido como fuente de verdad**. Sin state manager:
`useState` local, y un Context solo para el tema. Si algo aquí parece pedir Redux,
es señal de que se complicó de más.

```
react-router.config.ts   ssr:false · prerender · appDirectory:"src" · buildDirectory:"dist"
src/
  root.tsx       el <html>, script anti-flash del tema, ErrorBoundary
  routes.ts      rutas explícitas; un mismo módulo sirve los dos idiomas vía `id`
  components/
    ui/          Button, Badge, Card, Container, SectionHeading, BrandIcon
    layout/      Navbar, Footer, ThemeToggle, LocaleSwitch, SkipLink
  sections/      Hero, Projects, ProjectCard, About, Stack, Experience, Contact
  pages/         Home, NotFound   ← `export default` obligatorio
  content/
    types.ts     tipos compartidos por ambos idiomas
    index.ts     resuelve locale → bundle; featuredProjects(), projectBySlug()
    es/          projects.ts, experience.ts, skills.ts, ui.ts
    en/          projects.ts, experience.ts, skills.ts, ui.ts
  hooks/         useTheme, useLocale, useScrollSpy, useMediaQuery
  lib/           cn.ts, seo.ts, constants.ts, paths.ts, nav.ts
  styles/        index.css  ← tokens @theme
  assets/
public/          cv.pdf, og-image.png, favicon
```

### Reglas que mantienen esto sano

1. **El flujo de datos siempre baja:** `content → page → section → ui`.
   Un primitivo de `ui/` nunca importa de `content/`.
2. **Nada de datos hardcodeados en JSX.** Añadir un proyecto = empujar un objeto
   al array de `content/projects.ts`, cero cambios en componentes.
3. **Las páginas casi no tienen markup propio**: ensamblan secciones y manejan SEO.
4. **Las secciones son autocontenidas** y de ancho completo; el `Container`
   controla el ancho interno.

### Modelo de datos

```ts
// content/types.ts
export type Visibility = 'public' | 'private' | 'nda'

export type Project = {
  slug: string
  title: string
  tagline: string
  context: string // sector y escala: "Retail · ~80k pedidos/mes"
  problem: string // qué dolía
  solution: string // qué construí
  role: string // mi contribución concreta, separada del equipo
  outcome?: string // qué cambió (números si los hay)
  stack: string[]
  cover?: string // opcional: sin capturas, la tarjeta se sostiene con tipografía
  links: { live?: string; repo?: string }
  visibility: Visibility
  featured: boolean
  year: number
}
```

`visibility` decide qué pinta la tarjeta: `public` muestra los links,
`private` muestra la etiqueta "Código privado", `nda` muestra "Bajo NDA".
El componente nunca asume que hay links.

### Rutas

```
/                      Home            (español, sin prefijo)
/en                    Home            (inglés)
/*                     NotFound
```

**Una sola página por idioma, y es una decisión.** Los casos de estudio se leen
completos en la Home: problema, solución y rol en la propia tarjeta. Se borró
`ProjectDetail` porque una ficha por proyecto añadía un salto de navegación para
enseñar un texto que cabe donde ya estaba mirando el lector. Consecuencia: la
tarjeta **no** es un enlace y no lleva hover que insinúe que se puede entrar; los
únicos enlaces son los de salida (producto en vivo, repositorio).

### Internacionalización

Español por defecto, inglés bajo `/en`. **Sin `react-i18next`** — son ~100 cadenas,
no justifica el peso ni la indirección.

- Un archivo por idioma en `content/{es,en}/`, tipos compartidos en `content/types.ts`.
- `useLocale()` lee el prefijo de la URL y devuelve el bundle correcto.
- Cada versión se **escribe**, no se traduce. Traducción literal siempre suena a traducción.
- `prerender` en `react-router.config.ts` genera ambos idiomas → Google los indexa
  por separado. Las dos rutas salen como HTML estático.
- Obligatorio `<link rel="alternate" hreflang="es|en|x-default">` en cada página,
  o el SEO multiidioma no sirve de nada.
- Selector de idioma visible en la Navbar, que conserva la ruta actual al cambiar.

**Al diseñar, usa los textos en español.** El inglés ocupa entre 15% y 25% menos;
si el layout aguanta con el texto largo, aguanta con el corto. Al revés no.

---

## 4. Diseño

### Tipografía

> **El display serif está descartado.** Lo que sigue describe el código de hoy,
> que aún no se ha migrado. La decisión vigente está en `design/tokens.md` §1 y
> la dirección visual que la aplica, en `design/direccion-visual.md`.

- **Display:** Schibsted Grotesk **800** — la jerarquía sale del peso y del
  tamaño, no del cambio de familia.
- **Texto:** Schibsted Grotesk 400 — neutro pero vivo, aguanta párrafos largos.
- **Mono:** JetBrains Mono — código, etiquetas, metadatos.

Display y texto son **la misma familia en dos pesos, a propósito**. Se mantienen
`--font-display` y `--font-sans` como tokens distintos para poder volver a
separarlos algún día sin tocar todos los componentes.

Las dos familias son variable fonts (400–900), así que **el peso sí es un recurso
de jerarquía**. El display vive en 800 y necesita tracking negativo o las
palabras se separan: `-2.4px` en el Hero, `-1` a `-1.2` en títulos de sección,
`-0.5` a `-0.6` en títulos de tarjeta, y **`0` en el texto corrido** — aplicarlo
al cuerpo lo hace ilegible.

<details>
<summary>Lo que valía con Instrument Serif (histórico)</summary>

Instrument Serif no era variable: peso 400 y su cursiva, y nada más, así que en
el display no había `font-weight` como recurso. Tenía además una altura de x
bastante menor que Schibsted Grotesk, y por eso `--text-card` tiene un suelo de
`1.5rem`: con `1.25rem` el título de la tarjeta quedaba por debajo de su propio
tagline en móvil. **Con una sola familia ese desajuste desaparece y el suelo hay
que revisarlo** (`tokens.md` §4).

</details>

Las fuentes se **autohospedan** con Fontsource (solo subsets latinos), no se enlazan
desde Google Fonts: quita una conexión a un tercero.

Máximo dos familias + la mono. Escala tipográfica definida **antes** de maquetar.

Los tokens vivos están en `src/styles/index.css`. Resumen de lo que hay:

```css
/* Los colores se declaran en :root y .dark, y se exponen con `@theme inline`
   (no `@theme`): así Tailwind referencia la variable en vez de copiar su valor,
   que es lo único que permite que .dark la sobreescriba. */
:root {
  --paper: #faf9f6;
  --surface: #f2f0eb;
  --line: #e0ddd6;
  --muted: #6e6a62;
  --ink: #17150f;
  --accent: #9e3b22;
}
.dark {
  --paper: #12110f;
  --surface: #1b1a17;
  --line: #2b2925;
  --muted: #9a958c;
  --ink: #f5f3ee;
  --accent: #e0755a;
}

--text-hero: clamp(2.75rem, 8vw, 6rem) --text-section: clamp(1.75rem, 4vw, 3rem)
  --text-card: clamp(1.5rem, 1.5vw + 0.5rem, 1.875rem)
  --text-lead: clamp(1.125rem, 1.2vw + 0.9rem, 1.375rem) --text-meta: 0.8125rem;
```

Escala resultante — 96 / 48 / 30 / 22 / 13 px en escritorio y 44 / 28 / 24 / 19 / 13
en móvil. Verificada en el navegador, no a ojo.

**Contraste:** los doce pares de texto pasan AA en ambos modos (el más justo es
`muted` sobre `surface` en claro, 4.73:1). `line` está en 1.29:1 **a propósito**:
es decorativo. Cualquier borde que signifique algo usa `muted` o `ink`, nunca `line`.

### Los tres adjetivos

**Preciso · sobrio · seguro de sí mismo.** De ahí sale todo lo demás:

- **Preciso** → una sola escala de espaciado, retícula de _hairlines_ visible,
  metadatos en mono con versalitas, **proyectos numerados**. Las secciones ya
  no: dos secuencias `01`–`05` con el mismo estilo se confundían entre sí
  (`design/direccion-visual.md` §3).
- **Sobrio** → seis colores y nada más. Cero gradientes, cero sombras decorativas.
  El acento aparece una vez por pantalla.
- **Seguro de sí mismo** → display grande, mucho aire, frases cortas, **un** CTA.

### Principios

- **Mobile-first**, siempre.
- **La apuesta visual es el sistema, no una fuente.** Al caer el display serif,
  un `<h1>` grande dejó de ser una apuesta: es un titular grande y ya. Ahora el
  carácter lo da el **rail de metadatos de 120 px** con su hairline vertical
  continuo, que recorre la página entera y pone cada dato en un sitio fijo y
  visible. Deja de ir en silencio. Ver `design/direccion-visual.md` §2.
- **Una sola animación**, y solo en el Hero: `fade + translateY(8px)`, en CSS.
  La animación repartida por toda la página es lo que hace que un portafolio se
  vea genérico. Ojo al anular `prefers-reduced-motion`: hay que poner a cero
  `animation-delay` **además** de `animation-duration`, o con `fill-mode: both`
  el elemento se queda invisible durante todo el retardo.
- **Suelo de calidad no negociable:** foco de teclado visible, contraste AA,
  `prefers-reduced-motion` respetado, navegable sin ratón.
- **Sin barras de porcentaje** en la sección de stack. Nadie sabe qué significa
  "React 87%".

---

## 5. Contenido de la página

1. **Hero** — quién soy, qué hago, **una** llamada a la acción.
2. **Experiencia** — timeline simple.
3. **Sobre mí** — corto, humano. Prohibido "apasionado por la tecnología".
4. **Stack** — agrupado: frontend / backend / tooling.
5. **Proyectos** — 3 o 5, no doce. Problema → solución → mi rol → resultado,
   los cuatro **en la tarjeta**: no hay ficha detrás.
6. **Contacto** — email + GitHub + LinkedIn + CV descargable.

**Experiencia va antes que Proyectos, y es una desviación consciente.** El orden
original ponía Proyectos en el puesto 2, coherente con el objetivo del §1: que
los proyectos se entiendan sin leer el CV. Se cambió porque tres de los cinco
proyectos están bajo NDA y no llevan enlace ni repo, mientras que Experiencia
nombra tres empresas reales con fechas verificables. Ante un lector escéptico,
lo comprobable entra antes que lo abstracto.

Si algún día los proyectos ganan enlaces, capturas o métricas propias, **este
orden hay que revisarlo**: la razón de la desviación desaparece con ella.

El orden vive en dos sitios que tienen que coincidir: el ensamblado de
`pages/Home.tsx` y el array `SECTION_IDS` de `lib/nav.ts`, que gobierna la
Navbar y el scroll spy. **Reordenar ya no obliga a renumerar nada**: las
secciones dejaron de ir numeradas, así que el `index` de `SectionHeading` no se
pinta. Lo que sí sigue yendo a mano es el índice de las fichas de proyecto
(`01`–`05`), y ahí un salto sí rompe lo que hace "precisa" a la retícula.

### Proyectos de empresa

La mayoría del trabajo es de clientes o empleadores. Se usa igual — vale más que
apps de tutorial — pero cambia el formato: **caso de estudio, no demo.**

Cuánto se puede decir, por nivel de permiso:

| Nivel                   | Qué se muestra                                              |
| ----------------------- | ----------------------------------------------------------- |
| Producto público        | Nombre, capturas, link en vivo                              |
| Con permiso del cliente | Nombre y descripción, sin código                            |
| Sin permiso explícito   | Sector y escala: "plataforma logística · ~40k usuarios/mes" |
| NDA estricto            | Solo el problema técnico, abstraído                         |

El riesgo no está en el nombre de la empresa si el producto es público y aparece
en LinkedIn. Está en el detalle interno: arquitectura no pública, números de negocio,
capturas de paneles internos, código.

**Cuando no hay link ni repo**, la tarjeta se sostiene con:
diagramas propios de arquitectura o flujo · mockups recreados con datos falsos y
sin branding · fragmentos de código propio (el patrón es tuyo aunque el repo no) ·
métricas de rendimiento, que no son confidenciales y son lo más convincente.

**Separar la contribución, pero en registro impersonal.** El campo `role` de cada
proyecto describe **ámbito de responsabilidad**, no narración: frases nominales
("Responsable único del frontend. Implementación de las interfaces sobre las APIs
disponibles…"), no primera persona coloquial ("mi parte es que…", "cae de mi
lado", "éramos dos en frontend").

La separación se sigue cumpliendo —se sabe exactamente qué es suyo— pero por
precisión del alcance, no por contar la dinámica del equipo. Los recuentos de
plantilla son ruido: lo que informa es si cargaba una capa entera o una parte.
Cuando hubo trabajo compartido se dice sin ambigüedad ("los contratos de datos
acordada con el equipo de backend"), y el "nosotros" a secas sigue prohibido
porque solo genera dudas.

**Excepción deliberada:** los `highlights` de `experience.ts` sí usan primera
persona con verbo en pasado ("Refactoricé…", "Integré…"). Es el registro estándar
de un CV y ahí funciona; el `role` de un caso de estudio es otra cosa.

Y la atribución negativa también va explícita cuando toca: si el diseño no es
suyo, se dice ("El diseño es de terceros"). Atribuirse un diseño ajeno es lo que
se descubre en la primera entrevista.

**Nunca:** subir código de la empresa a GitHub personal · capturas con datos reales
de clientes · métricas inventadas · llamar "personal" a un proyecto pagado.

---

## 6. Convenciones

- Componentes en `PascalCase.tsx`, uno por archivo, export nombrado.
  **Excepción:** los módulos de ruta de `pages/` usan `export default` — lo exige
  React Router en framework mode. `.oxlintrc.json` desactiva ahí
  `react/only-export-components`, y en `hooks/` también `react/set-state-in-effect`
  (leer el DOM en un efecto es el patrón correcto cuando el build renderiza en Node).
- Hooks y utilidades en `camelCase.ts`.
- Alias `@/` → `src/`, configurado en `vite.config.ts` y `tsconfig.json`.
- Sin `any`. Sin `// @ts-ignore` sin comentario que lo justifique.
- Clases de Tailwind siempre vía `cn()` cuando hay condicionales.
- Los colores salen de los tokens de `@theme`, nunca hex sueltos en el JSX.
- Commits en imperativo: `add project card`, `fix mobile nav overflow`.

---

## 7. Orden de trabajo

- [~] **Contenido** — estructura y tipos hechos; los textos siguen en `TODO`.
- [x] **Diseño** — tokens, paleta y escala definidos y verificados.
- [x] **Setup** — Vite, Tailwind v4, React Router con prerender. Falta el deploy.
- [x] **Maquetado** — una sola página por idioma, los dos idiomas escritos.
- [~] **Pulido** — accesibilidad, animación, sitemap, robots y OG image hechos.
  Falta pasar Lighthouse.
- [ ] **Lanzamiento** — dominio propio, OG image, analytics ligero.

### Cómo comprobar que el prerender sigue vivo

Es la comprobación que no se puede saltar: el HTML tiene que traer el contenido.

```bash
npm run build
grep -oE "<h1[^>]*>[^<]*" dist/client/index.html
```

Si sale el titular, funciona. Si sale un `<div>` vacío, el prerender está roto y
todo el motivo de usar framework mode se ha perdido.

---

## 8. Pendiente de definir

Esto bloquea el diseño. Rellenar antes de escribir componentes:

- [x] Tres adjetivos: **preciso · sobrio · seguro de sí mismo**.
- [x] Paleta — 6 tokens nombrados, contraste AA verificado.
- [x] ~~Instrument Serif encaja en la dirección. Se queda.~~ **Revertido el
      2026-09-06.** Se descarta el display serif: una sola familia
      (Schibsted Grotesk) en dos pesos. Ver `design/tokens.md` §1.
- [x] **Nombre, rol y frase de posicionamiento.** Johnny Bohorquez · Caracas.
      El `eyebrow` dice el **puesto**, no la carrera: «Desarrollador de
      software» y «Software Developer». Es lo mismo que dice el CV, y el titular
      es el único sitio donde un reclutador compara las dos cosas de un vistazo.
      La credencial no se pierde: **«Ingeniero en Informática» sale en el bloque
      de Formación**, con universidad y tesis, en los dos idiomas.
      El rol vive en `content/{es,en}/ui.ts` y **no** en `lib/constants.ts`
      porque sigue siendo texto traducible.

      Cuidado con «Ingeniero de software»: nombra una carrera que **no** es la suya. La carrera es Informática.

- [x] **Email público, GitHub y LinkedIn.** En `lib/constants.ts`.
- [ ] **`public/cv.pdf`.** El fichero no existe todavía; el enlace de Contacto
      apunta a un 404.
- [ ] **Limpiar el GitHub público.** `github.com/HrHrM` fija repos de práctica
      (`*_practice001`, `*_practice006`, `ReactN-Tesis`) y la bio dice «currently
      learning». Enlazado desde el portafolio, resta en vez de sumar.
- [ ] Los 3–4 proyectos: problema / qué construí / mi rol / resultado.
- [ ] Nivel de `visibility` de cada uno — preguntar al cliente o ex-jefe si hay duda.
      Suele ser que sí y tarda dos días; hacerlo ya para no rehacer tarjetas después.
- [ ] Referencias: 15–20 piezas, y no solo portafolios — portadas, señalética,
      packaging, revistas. Lo que se repita es la dirección.
- [ ] Dominio. Mientras no esté, `SITE.url` es `https://example.com` y **las
      canónicas y los hreflang apuntan a un sitio que no es el tuyo**. Hay que
      cambiarlo antes de que Google indexe nada.

### Qué va en `public/` y qué en `src/assets/`

No es lo mismo y confundirlo cuesta tiempo:

- **`public/`** — se sirve tal cual, en una URL fija y sin procesar. Va aquí todo
  lo que necesita una ruta predecible porque lo consume algo de fuera:
  `cv-es.pdf`, `cv-en.pdf`, `og-es.png`, `og-en.png`, `favicon.svg`.
  Sin hash en el nombre, así que al reemplazar un fichero hay que contar con la
  caché del navegador.
- **`src/assets/`** — se importa desde el código y lo procesa Vite: optimiza,
  comprime y añade hash al nombre. Va aquí cualquier imagen que se pinte dentro
  de un componente, como el `cover` de un proyecto.

Regla corta: si la URL aparece en un `href`, un `<meta>` o la escribe un tercero,
va en `public/`. Si la escribe un `import`, va en `src/assets/`.

**Las OG image se generan**, no se dibujan a mano: `scratchpad/og.html` usa los
mismos tokens y las mismas fuentes que el sitio, y se rasteriza a 1200×630 con
Playwright. Si cambia el titular o la paleta, se regenera desde ahí.
`og:image` **tiene que ser URL absoluta** — con ruta relativa, WhatsApp y
LinkedIn no la resuelven. Sale de `SITE.url`, así que se corrige sola con el
dominio.

### Nota de entorno

React Router está fijado en la 7 y no en la 8 porque la 8 exige **Node ≥ 22.22.0**
y la máquina de desarrollo tiene la 22.13.1. Todo lo que se usa aquí
(`appDirectory`, `ssr: false`, `prerender`, `route()` con `id`, `meta` con
`tagName`) existe igual en la 7. Si se actualiza Node, el salto a la 8 es
`npm install react-router@8 @react-router/dev@8 @react-router/node@8`.
