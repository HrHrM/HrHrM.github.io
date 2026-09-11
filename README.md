# hrhrm.github.io

Portafolio personal de **Johnny Bohorquez**, desarrollador de software.
En vivo en **<https://hrhrm.github.io>** · [English](https://hrhrm.github.io/en/)

Sitio estático de dos rutas —una por idioma— con el contenido prerenderizado a
HTML. Sin servidor, sin base de datos, sin CMS.

[![Deploy](https://github.com/HrHrM/HrHrM.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/HrHrM/HrHrM.github.io/actions/workflows/deploy.yml)

---

## Cómo está hecho

|            |                                                                |
| ---------- | -------------------------------------------------------------- |
| Build      | Vite 8 + React 19 + TypeScript                                 |
| Rutas      | React Router 7 en _framework mode_, `ssr: false` + `prerender` |
| Estilos    | Tailwind CSS v4 — tokens en `@theme`, sin `tailwind.config.js` |
| Animación  | CSS `@keyframes` y la View Transitions API                     |
| 3D         | `ogl` para las partículas del hero                             |
| Tipografía | Schibsted Grotesk + JetBrains Mono, autohospedadas             |
| Pruebas    | Playwright — 104 pruebas en Chromium y Firefox                 |
| Lint       | Oxlint · Prettier                                              |
| Hosting    | GitHub Pages, desplegado por Actions                           |

**Cero dependencias de animación.** Los efectos portados de React Bits venían
pidiendo GSAP o `motion`; están reescritos con `@keyframes`. Cada desviación
respecto del original lleva un comentario `CAMBIO` que explica la medición
detrás.

## Arrancarlo

Requiere **Node ≥ 20** (React Router 8 exigiría ≥ 22.22, y por eso está fijado
en la 7 — ver la nota de entorno del [CLAUDE.md](./CLAUDE.md)).

```bash
npm install
npm run dev          # servidor de desarrollo
npm run build        # build + prerender a dist/client
npm run typecheck    # react-router typegen && tsc
npm run lint         # oxlint
npm run format       # prettier
```

## Pruebas

```bash
npm test             # construye y ejecuta la suite en Chromium y Firefox
npm run test:fast    # reutiliza el build anterior
npm run test:ui      # el visor interactivo de Playwright
npm run test:links   # los enlaces de salida, aparte (necesitan red)
```

Corren contra el **build**, servido por `tests/server.mjs`, que imita a GitHub
Pages: redirige `/en` a `/en/` con un 301 y devuelve el `404.html` con estado
404 de verdad. Probar contra `react-router dev` no valdría — ese servidor
inyecta el CSS por JS y no aplica el prerender.

Qué cubren, y por qué esas y no otras: cada una responde a algo que se rompió
de verdad durante el desarrollo.

- **El prerender trae el contenido.** Se comprueba sobre el HTML crudo, sin
  ejecutar JavaScript. Es la que no se puede saltar: si falla, la página se ve
  idéntica en el navegador y solo lo nota Google.
- **Los enlaces del navbar llegan al primer clic.** Esto se rompió: un
  `<a href="#seccion">` hacía que `<ScrollRestoration />` cancelara el salto y
  te mandara al fondo de la página.
- **El tema no parpadea.** Se mide el fondo en el primer fotograma, antes de
  hidratar.
- **`prefers-reduced-motion`.** No que no haya animación, sino que **el texto
  se vea**: con `fill-mode: both`, poner a cero solo la duración deja el
  contenido invisible durante el retardo.
- **Cero scroll horizontal** a 390/768/1024/1440/1920, y cero errores de
  consola.
- **Sin WebGL, el sitio sigue siendo el sitio.** Esto se rompió: `ogl` no lanza
  al quedarse sin contexto, sigue con `gl` a `null`, y el `TypeError` posterior
  llegaba al ErrorBoundary — la página entera se convertía en «Un error
  inesperado». Lo encontró Firefox en CI, sin GPU; en local no se veía porque
  Chromium cae a WebGL por software.
- **axe** sobre las dos rutas en los dos temas.

## Estructura

```
src/
  root.tsx        <html>, script anti-flash del tema, ErrorBoundary
  routes.ts       rutas explícitas, ambos idiomas
  components/     ui/ (primitivos y efectos) · layout/
  sections/       Hero, Experience, About, Projects, Stack, Contact
  pages/          Home, NotFound          ← export default (lo exige el framework)
  content/        es/ · en/ · types.ts    ← fuente de verdad del contenido
  hooks/  lib/  styles/  assets/
tests/            la suite de Playwright y el servidor que imita a Pages
scratchpad/       og.html + og.mjs — generan las imágenes de Open Graph
design/           tokens, dirección visual y el .pen
```

**El contenido es la fuente de verdad.** Añadir un proyecto es empujar un
objeto a `src/content/es/projects.ts` y otro a `en/projects.ts`. Ningún
componente se toca.

Cada idioma se **escribe**, no se traduce: son dos ficheros paralelos, no un
original y su versión. Una sola página por idioma — el caso de estudio completo
se lee en la propia tarjeta, así que no hay ficha de proyecto detrás.

## Las imágenes de Open Graph

No se dibujan a mano. `scratchpad/og.html` usa los mismos tokens y las mismas
fuentes que el sitio, y `npm run og` lo rasteriza a 1200×630 con Playwright.
Si cambia la paleta o el titular, se regenera desde ahí.

## Despliegue

`.github/workflows/deploy.yml`, en cada push a `main`: typecheck → lint →
build → pruebas → publicar. Se despliega como _user page_, así que el sitio
cuelga de la raíz del dominio.

El build deja en `dist/client` dos ficheros que GitHub Pages necesita:
`404.html` (para que un refresco en una ruta desconocida no dé el 404 del host)
y `.nojekyll` (sin él, Jekyll descarta todo lo que empieza por `_`, incluido el
fallback del que sale el propio 404).

**Si algún día se publicara como _project page_** (`usuario.github.io/repo/`)
haría falta `base` en Vite y `basename` en el router: todas las rutas son
absolutas. Con dominio propio o _user page_, nada que tocar.

## Más contexto

El [CLAUDE.md](./CLAUDE.md) tiene el razonamiento completo: objetivo, decisiones
de diseño, convenciones y la lista de trampas que costaron tiempo. El
[LANZAMIENTO.md](./LANZAMIENTO.md) lleva lo que queda pendiente.

## Licencia

El **código** es de uso libre como referencia. El **contenido** —textos,
currículum, casos de estudio y las imágenes de Open Graph— no: es material
personal y profesional propio.
