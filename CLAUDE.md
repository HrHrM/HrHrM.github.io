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

| Capa | Elección | Nota |
|---|---|---|
| Build | Vite + React + TypeScript | |
| Estilos | Tailwind CSS v4 | plugin `@tailwindcss/vite` |
| Rutas | React Router 7 | `routes.ts`, rutas explícitas. **No** v8: exige Node ≥ 22.22.0 |
| Prerender | React Router framework mode | `@react-router/dev`, `ssr: false` + `prerender` → un `.html` por ruta |
| Animación | CSS (`@keyframes`) | una sola, en el Hero. `motion` **no** está instalado |
| Iconos | `lucide-react` | |
| Formulario | `react-hook-form` + `zod` | envío vía Formspree / Web3Forms |
| Lint | Oxlint | `.oxlintrc.json`, sin ESLint |
| Formato | Prettier (o `oxfmt`) | |
| Utilidades | `clsx` + `tailwind-merge` → helper `cn()` | |
| Deploy | Vercel / Netlify / Cloudflare Pages | |

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
- **Las rutas dinámicas hay que enumerarlas una a una** en `prerender`. Y `action`
  y `headers` no están disponibles. `react-router.config.ts` las deriva de
  `content/{es,en}/projects.ts`, y el `buildEnd` genera `sitemap.xml` y `robots.txt`
  del mismo listado para que no puedan desincronizarse.
- **`lucide-react` v1 ya no trae iconos de marca.** GitHub y LinkedIn van como SVG
  inline en `components/ui/BrandIcon.tsx`.
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
  pages/         Home, ProjectDetail, NotFound   ← `export default` obligatorio
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
export type Visibility = "public" | "private" | "nda";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  context: string;      // sector y escala: "Retail · ~80k pedidos/mes"
  problem: string;      // qué dolía
  solution: string;     // qué construí
  role: string;         // mi contribución concreta, separada del equipo
  outcome?: string;     // qué cambió (números si los hay)
  stack: string[];
  cover?: string;       // opcional: sin capturas, la tarjeta se sostiene con tipografía
  links: { live?: string; repo?: string };
  visibility: Visibility;
  featured: boolean;
  year: number;
};
```

`visibility` decide qué pinta la tarjeta: `public` muestra los links,
`private` muestra la etiqueta "Código privado", `nda` muestra "Bajo NDA".
El componente nunca asume que hay links.

### Rutas

```
/                      Home            (español, sin prefijo)
/proyectos/:slug       ProjectDetail
/en                    Home            (inglés)
/en/projects/:slug     ProjectDetail
/*                     NotFound
```

### Internacionalización

Español por defecto, inglés bajo `/en`. **Sin `react-i18next`** — son ~100 cadenas,
no justifica el peso ni la indirección.

- Un archivo por idioma en `content/{es,en}/`, tipos compartidos en `content/types.ts`.
- `useLocale()` lee el prefijo de la URL y devuelve el bundle correcto.
- Cada versión se **escribe**, no se traduce. Traducción literal siempre suena a traducción.
- `prerender` en `react-router.config.ts` genera ambos idiomas → Google los indexa
  por separado. `/` y `/en` ya salen como HTML estático; al añadir `ProjectDetail`
  hay que pasar `prerender` a función async que enumere los slugs de los dos
  bundles, porque con `ssr: false` las rutas dinámicas no se descubren solas.
- Obligatorio `<link rel="alternate" hreflang="es|en|x-default">` en cada página,
  o el SEO multiidioma no sirve de nada.
- Selector de idioma visible en la Navbar, que conserva la ruta actual al cambiar.

**Al diseñar, usa los textos en español.** El inglés ocupa entre 15% y 25% menos;
si el layout aguanta con el texto largo, aguanta con el corto. Al revés no.

---

## 4. Diseño

### Tipografía

- **Display:** Instrument Serif — elegancia editorial, mucho carácter en tamaños grandes.
- **Texto:** Schibsted Grotesk — neutro pero vivo, aguanta párrafos largos.
- **Mono:** JetBrains Mono — código, etiquetas, metadatos.

**Solo dos de las tres son variable fonts.** Schibsted Grotesk y JetBrains Mono sí
(400–900). **Instrument Serif no**: es estática y tiene un único peso, el 400, más
su cursiva. No existe `@fontsource-variable/instrument-serif`, solo
`@fontsource/instrument-serif`. Consecuencia práctica: **en el display no hay
`font-weight` como recurso de jerarquía** — sale del tamaño y, si hace falta, de
la cursiva.

Y un segundo efecto que sí muerde al maquetar: Instrument Serif tiene una **altura
de x bastante menor** que Schibsted Grotesk, así que a igual tamaño en px el serif
se lee más pequeño. Por eso `--text-card` tiene un suelo de `1.5rem`: con `1.25rem`
el título de la tarjeta quedaba visualmente por debajo de su propio tagline en móvil.

Las fuentes se **autohospedan** con Fontsource (solo subsets latinos), no se enlazan
desde Google Fonts: quita una conexión a un tercero.

Máximo dos familias + la mono. Escala tipográfica definida **antes** de maquetar.

Los tokens vivos están en `src/styles/index.css`. Resumen de lo que hay:

```css
/* Los colores se declaran en :root y .dark, y se exponen con `@theme inline`
   (no `@theme`): así Tailwind referencia la variable en vez de copiar su valor,
   que es lo único que permite que .dark la sobreescriba. */
:root { --paper:#faf9f6; --surface:#f2f0eb; --line:#e0ddd6;
        --muted:#6e6a62; --ink:#17150f;   --accent:#9e3b22; }
.dark { --paper:#12110f; --surface:#1b1a17; --line:#2b2925;
        --muted:#9a958c; --ink:#f5f3ee;   --accent:#e0755a; }

--text-hero:    clamp(2.75rem, 8vw, 6rem)
--text-section: clamp(1.75rem, 4vw, 3rem)
--text-card:    clamp(1.5rem, 1.5vw + 0.5rem, 1.875rem)
--text-lead:    clamp(1.125rem, 1.2vw + 0.9rem, 1.375rem)
--text-meta:    0.8125rem
```

Escala resultante — 96 / 48 / 30 / 22 / 13 px en escritorio y 44 / 28 / 24 / 19 / 13
en móvil. Verificada en el navegador, no a ojo.

**Contraste:** los doce pares de texto pasan AA en ambos modos (el más justo es
`muted` sobre `surface` en claro, 4.73:1). `line` está en 1.29:1 **a propósito**:
es decorativo. Cualquier borde que signifique algo usa `muted` o `ink`, nunca `line`.

### Los tres adjetivos

**Preciso · sobrio · seguro de sí mismo.** De ahí sale todo lo demás:

- **Preciso** → una sola escala de espaciado, retícula de *hairlines* visible,
  metadatos en mono con versalitas, secciones y proyectos numerados.
- **Sobrio** → seis colores y nada más. Cero gradientes, cero sombras decorativas.
  El acento aparece una vez por pantalla.
- **Seguro de sí mismo** → display grande, mucho aire, frases cortas, **un** CTA.

### Principios

- **Mobile-first**, siempre.
- **Una sola apuesta visual: el `<h1>` del Hero en Instrument Serif a 6rem.**
  La retícula de hairlines no es la apuesta — es el sistema, y va en silencio.
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

En este orden, porque así es como se escanea:

1. **Hero** — quién soy, qué hago, **una** llamada a la acción.
2. **Proyectos destacados** — 3 o 4, no doce. Problema → solución → stack → resultado.
3. **Sobre mí** — corto, humano. Prohibido "apasionado por la tecnología".
4. **Stack** — agrupado: frontend / backend / tooling.
5. **Experiencia** — timeline simple.
6. **Contacto** — email + GitHub + LinkedIn + CV descargable.

### Proyectos de empresa

La mayoría del trabajo es de clientes o empleadores. Se usa igual — vale más que
apps de tutorial — pero cambia el formato: **caso de estudio, no demo.**

Cuánto se puede decir, por nivel de permiso:

| Nivel | Qué se muestra |
|---|---|
| Producto público | Nombre, capturas, link en vivo |
| Con permiso del cliente | Nombre y descripción, sin código |
| Sin permiso explícito | Sector y escala: "plataforma logística · ~40k usuarios/mes" |
| NDA estricto | Solo el problema técnico, abstraído |

El riesgo no está en el nombre de la empresa si el producto es público y aparece
en LinkedIn. Está en el detalle interno: arquitectura no pública, números de negocio,
capturas de paneles internos, código.

**Cuando no hay link ni repo**, la tarjeta se sostiene con:
diagramas propios de arquitectura o flujo · mockups recreados con datos falsos y
sin branding · fragmentos de código propio (el patrón es tuyo aunque el repo no) ·
métricas de rendimiento, que no son confidenciales y son lo más convincente.

**Separar la contribución.** Contexto en tercera persona, aporte propio en primera:
"el equipo migró la plataforma a React" / "yo diseñé el sistema de componentes y
migré los 30 formularios del checkout". El "nosotros" solo genera dudas.

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
- [~] **Maquetado** — Home y `ProjectDetail` completas en español. Falta escribir el inglés.
- [~] **Pulido** — accesibilidad, animación, sitemap y robots hechos. Faltan imágenes,
      la OG image y pasar Lighthouse.
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
- [x] Instrument Serif encaja en la dirección. Se queda.
- [ ] **Nombre, rol y frase de posicionamiento.** Bloquea el Hero, el `<title>`,
      la `description` y el footer. Van en `lib/constants.ts` (`SITE.name`) y en
      `content/{es,en}/ui.ts` (`hero.eyebrow`, `hero.headline`, `seo.*`).
- [ ] **Email público, GitHub, LinkedIn y `public/cv.pdf`.** Bloquean Contacto.
- [ ] Los 3–4 proyectos: problema / qué construí / mi rol / resultado.
- [ ] Nivel de `visibility` de cada uno — preguntar al cliente o ex-jefe si hay duda.
      Suele ser que sí y tarda dos días; hacerlo ya para no rehacer tarjetas después.
- [ ] Referencias: 15–20 piezas, y no solo portafolios — portadas, señalética,
      packaging, revistas. Lo que se repita es la dirección.
- [ ] Dominio. Mientras no esté, `SITE.url` es `https://example.com` y **las
      canónicas y los hreflang apuntan a un sitio que no es el tuyo**. Hay que
      cambiarlo antes de que Google indexe nada.

### Nota de entorno

React Router está fijado en la 7 y no en la 8 porque la 8 exige **Node ≥ 22.22.0**
y la máquina de desarrollo tiene la 22.13.1. Todo lo que se usa aquí
(`appDirectory`, `ssr: false`, `prerender`, `route()` con `id`, `meta` con
`tagName`) existe igual en la 7. Si se actualiza Node, el salto a la 8 es
`npm install react-router@8 @react-router/dev@8 @react-router/node@8`.
