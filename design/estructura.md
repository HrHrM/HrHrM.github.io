# Estructura del portafolio

Cómo está montada la página, en el orden en que la ve un visitante.
Leído del código el 2026-09-03, no de memoria, y actualizado el mismo día tras
el paso a **una sola página por idioma**: los casos de estudio se leen completos
en la Home y ya no hay ficha de proyecto.

---

## 1. Orden de las secciones

Ojo, que aquí hay una corrección: **«Sobre mí» no va segundo, va tercero.**
Experiencia se adelantó a propósito. El orden real es:

| #   | Sección                       | Ancla         | En la nav |
| --- | ----------------------------- | ------------- | --------- |
| —   | **Hero**                      | —             | no        |
| 01  | **Experiencia** (+ Formación) | `#experience` | sí        |
| 02  | **Sobre mí**                  | `#about`      | sí        |
| 03  | **Stack**                     | `#stack`      | sí        |
| 04  | **Proyectos**                 | `#projects`   | sí        |
| 05  | **Contacto**                  | `#contact`    | sí        |
| —   | **Footer**                    | —             | no        |

El Hero no está numerado ni aparece en la navegación: no es una sección, es la
portada. Por eso la numeración visible empieza en `01` con Experiencia.

**Por qué Experiencia antes que Proyectos.** Es una desviación consciente del
plan original. Tres de los cinco proyectos están bajo NDA: no llevan enlace, ni
repositorio, ni capturas. Experiencia, en cambio, nombra tres empresas reales
con fechas verificables. Ante un lector escéptico, lo comprobable entra antes
que lo abstracto. **Si algún día los proyectos ganan enlaces o métricas
propias, este orden hay que revisarlo**, porque la razón desaparece con ellos.

El orden vive en dos sitios que tienen que coincidir: el ensamblado de
`pages/Home.tsx` y el array `SECTION_IDS` de `lib/nav.ts`, que gobierna la
Navbar y el scroll spy. La numeración (`01`…`05`) va escrita a mano en cada
sección: **si se reordena, hay que renumerar a mano.**

---

## 2. Esqueleto de la Home

```
┌─ NAVBAR ───────────────────────────────────────────── fija arriba ─┐
│ Johnny Bohorquez        Experiencia · Sobre mí · Stack ·           │
│                         Proyectos · Contacto    [ES|EN] [☀] [☰]    │
└────────────────────────────────────────────────────────────────────┘

   HERO                                          ← única apuesta visual
   DESARROLLADOR DE SOFTWARE · CARACAS               (mono, versalitas)
   Ingeniería de arquitectura                     ← h1, serif, 96 px
   web y móvil escalable.
   [ VER EXPERIENCIA ]  ↓ SEGUIR BAJANDO           ← un solo CTA, a 01
   ────────────────────────────────────────────────────── hairline ───

   01  Experiencia                                ← h2, serif, 48 px
   ───────────────────────────────────────────────────────────────────
   Abr 2025 — Actualidad │ Galilei Smart Solutions · Frontend React
                         │ resumen del puesto
                         │ — highlight
                         │ — highlight
                         │ — highlight
   ─────────────────────────────────────────────────────────────────
   Nov 2023 — Nov 2024   │ Pegaso Consulting · Frontend Angular
   ─────────────────────────────────────────────────────────────────
   Mar 2022 — Jun 2023   │ APPS2GO · Frontend Flutter
   ─────────────────────────────────────────────────────────────────
   FORMACIÓN
   Sept 2016 — Feb 2022  │ Ing. en Informática · U. A. de Humboldt
                         │ nota de tesis

   02  Sobre mí
   ───────────────────────────────────────────────────────────────────
                         │ párrafo 1 (más grande, 22 px)
                         │ párrafo 2
                         │ párrafo 3

   03  Stack
   ───────────────────────────────────────────────────────────────────
   lead: lo que uso a diario y defendería en una revisión de código
   LENGUAJES             │ [TypeScript] [JavaScript] [Dart] [HTML] …
   FRAMEWORKS            │ [React] [React Native] [Angular] …
   SERVICIOS             │ [Firebase] [REST APIs]
   HERRAMIENTAS          │ [Git] [Claude Code] [Playwright] …
   IDIOMAS               │ [Español — nativo] [Inglés — B2]

   04  Proyectos
   ───────────────────────────────────────────────────────────────────
   lead: cinco casos de ingeniería: restricciones, arquitectura…
   01                    │ Suite administrativa multi-cliente   ← serif
   SUITE EMPRESARIAL…    │ tagline (22 px)              (no es enlace)
   2025                  │ PROBLEMA
                         │ texto
                         │ SOLUCIÓN
                         │ texto
                         │ MI ROL
                         │ texto
                         │ ▏RESULTADO: … (solo si existe)
                         │ [React] [React Native] [TypeScript]
                         │ [BAJO NDA] [CÓDIGO PRIVADO]
   ─────────────────────────────────────────────────────────────────
   02 … 03 … 04 … 05     │ (las cinco tarjetas, misma retícula)

   05  Contacto
   ───────────────────────────────────────────────────────────────────
   lead: disponible para roles frontend a tiempo completo…
   ┌──────────────────────┬──────────────────────┐
   │ ✉ ESCRÍBEME          │ ⌘ GITHUB             │
   │   johnny.phosts@…  ↗ │   github.com/HrHrM ↗ │
   ├──────────────────────┼──────────────────────┤
   │ in LINKEDIN          │ ↓ DESCARGAR CV       │
   │   linkedin.com/…   ↗ │   PDF              ↗ │
   └──────────────────────┴──────────────────────┘

┌─ FOOTER ───────────────────────────────────────────────────────────┐
│ © 2026 Johnny Bohorquez. Todos los…   Creado con React, Tailwind…  │
└────────────────────────────────────────────────────────────────────┘
```

**La retícula que se repite.** Casi todo el sitio es la misma figura: una
columna estrecha a la izquierda con el metadato en mono (3 de 12 columnas) y el
contenido a la derecha (9 de 12), separados por una línea de un pelo. La usan
Experiencia, Formación, Stack y las tarjetas de proyecto. En móvil las dos
columnas se apilan. Eso es lo que hace que la página se lea como un sistema y
no como una colección de bloques.

---

## 3. Sección por sección

### Hero

- **Qué contiene:** tres cosas y nada más. El `eyebrow` en mono con versalitas
  (puesto · ciudad), el `<h1>` en serif a tamaño grande, y una fila con **un
  solo botón** más un «seguir bajando» decorativo (marcado `aria-hidden`, no lo
  lee el lector de pantalla).
- **De dónde sale el texto:** `ui.hero` en `content/{es,en}/ui.ts`.
- **Por qué así:** es la única apuesta visual del sitio. Todo lo demás va en
  silencio para que el titular pese. También es el único sitio con animación:
  un `fade + translateY(8px)` en tres tiempos (0 ms, 90 ms, 180 ms) y se
  respeta `prefers-reduced-motion`.
- **Resuelto:** el botón apuntaba a `#projects` (sección 04) y se saltaba
  Experiencia, Sobre mí y Stack. Ahora apunta a `#experience`, coherente con el
  orden: primero lo comprobable.
- **A revisar ahora:** el CTA lleva a la sección que ya está justo debajo, así
  que hace casi lo mismo que el «seguir bajando» de al lado. Dos elementos para
  el mismo gesto. Si molesta, lo que sobra es el hint, no el botón.

### 01 · Experiencia

- **Qué contiene:** una lista ordenada de tres puestos. Cada uno: rango de
  fechas en mono con cifras alineadas a la izquierda, y a la derecha empresa ·
  cargo, un resumen de una línea y tres highlights con una raya en color de
  acento. Debajo, un bloque **Formación** con la misma retícula.
- **De dónde sale:** `content/{es,en}/experience.ts` (`experience` y
  `education`). Las fechas se guardan como `2025-04` y las formatea
  `lib/dates.ts` según el idioma, así que los dos idiomas no pueden
  desincronizarse.
- **Por qué así:** Formación va **dentro** de Experiencia y no en una sección
  propia. Son seis secciones y una carrera no compite en importancia con tres
  puestos. Se sigue leyendo la credencial, pero sin darle un número.

### 02 · Sobre mí

- **Qué contiene:** tres párrafos, nada más. El primero va un escalón más
  grande (22 px) y el resto en cuerpo normal. No tiene _lead_ bajo el título.
- **De dónde sale:** `ui.about.paragraphs` — un array, no JSX. Añadir un
  párrafo no toca ningún componente.
- **Por qué así:** el texto está indentado a las mismas 9 columnas donde va el
  contenido de las demás secciones, pero con la columna de la etiqueta vacía.
  Mantiene la retícula sin inventar una etiqueta que no hace falta. Y como el
  serif solo tiene un peso, la entrada a la sección la marca el tamaño del
  primer párrafo, no una negrita.

### 03 · Stack

- **Qué contiene:** cinco grupos (lenguajes, frameworks, servicios,
  herramientas, idiomas). Etiqueta del grupo en mono a la izquierda, etiquetas
  con borde a la derecha. El grupo de herramientas nombra el flujo real —Claude
  Code, spec-kit, Playwright, Maestro— en vez de JIRA y Slack, que no dicen
  nada de cómo se trabaja.
- **De dónde sale:** `content/{es,en}/skills.ts`. Solo las etiquetas de grupo
  son texto traducible; los nombres de tecnología son nombres propios.
- **Por qué así:** **sin barras de porcentaje y sin niveles.** Nadie sabe qué
  significa «React 87%». Y en lista vertical, no en rejilla de tres columnas:
  con cinco grupos, una rejilla dejaba un 3+2 descompensado.

### 04 · Proyectos

- **Qué contiene:** cinco tarjetas, y cada una es el caso completo. Número,
  sector y año en la columna izquierda; a la derecha el título en serif —**texto,
  no enlace**—, el tagline, **tres bloques apilados: Problema, Solución y Mi
  rol**, el resultado si existe (con una barra de acento a la izquierda), las
  tecnologías y las etiquetas de visibilidad.
- **De dónde sale:** `content/{es,en}/projects.ts`. La sección filtra por
  `featured` y ordena por año descendente.
- **Por qué así:** la tarjeta lo deriva todo de `visibility` y **nunca asume que
  hay enlaces**. `public` muestra los enlaces; `nda` muestra dos etiquetas —
  «Bajo NDA» explica por qué no hay detalle interno y «Código privado» por qué
  no hay repositorio. Sin capturas, la tarjeta se sostiene con tipografía: el
  número y el título en serif bastan.
- **Por qué apilados y no en tres columnas:** cada bloque son de dos a cuatro
  frases. En tres columnas estrechas dentro de las 9 disponibles se leerían
  mal. Apilados, con la etiqueta en mono encima del valor, mantienen la misma
  figura que el resto del sitio.
- **`context` no lleva etiqueta.** Ya está en la columna de metadatos junto al
  número y el año; rotularlo otra vez era repetirlo.
- **A revisar:** los cinco proyectos tienen `featured: true`, así que el filtro
  no filtra nada. El campo está de adorno hasta que haya un sexto proyecto.

### 05 · Contacto

- **Qué contiene:** cuatro celdas en rejilla de dos columnas: email, GitHub,
  LinkedIn y CV. Cada una con icono, etiqueta en mono, el valor visible y una
  flecha.
- **De dónde sale:** las etiquetas de `ui.contact`; las direcciones de
  `lib/constants.ts`. El CV cambia con el idioma (`/cv-es.pdf`, `/cv-en.pdf`).
- **Por qué así:** **sin formulario.** Cuatro enlaces convierten igual y no hay
  nada que pueda fallar en silencio.
- **Resuelto:** el enlace de LinkedIn provocaba 11 px de desbordamiento
  horizontal en móvil. Ahora el valor visible se recorta al dominio útil
  (`linkedin.com/in/johnnymlr`, sin protocolo, sin `www.` y sin barra final) y
  la celda lleva `min-w-0` + `wrap-break-word`, que es lo que de verdad impide
  el desborde: sin `min-w-0` un hijo flex nunca baja de su ancho de contenido.
  El `href` sigue llevando la URL completa.

### Footer

Dos líneas en mono: copyright con el año calculado en tiempo real, y «creado
con React, Tailwind y pre-renderizado estático».

---

## 4. La ficha de proyecto: ya no existe

Había una página por proyecto (`/proyectos/:slug` y `/en/projects/:slug`) con
los bloques Contexto · Problema · Solución · Mi rol · Resultado · Stack, y un
enlace cíclico al siguiente caso. **Se borró.**

El motivo: la ficha añadía un salto de navegación para enseñar un texto que
cabe donde el lector ya estaba mirando. Ahora la tarjeta de la Home lleva los
tres bloques que informan, y lo único que se perdió es el bloque `Contexto`
rotulado — que seguía estando, sin rótulo, en la columna de metadatos.

Lo que se fue con ella: `pages/ProjectDetail.tsx`, las dos rutas dinámicas,
`projectPath()` en `lib/paths.ts`, el helper `project()` de `useLocale()` y
tres etiquetas de contenido que ya no se pintan (`context`, `stack` y
`readCase`).

Los `slug` **siguen** en el modelo de datos: son la clave estable de cada
proyecto y lo que empareja las dos versiones de idioma.

## 5. Tipografía

Tres familias y ninguna más. Se autohospedan con Fontsource (solo subsets
latinos), no se enlazan desde Google Fonts: quita una conexión a un tercero.

| Rol         | Familia           | Pesos                  | Dónde se usa                                                                |
| ----------- | ----------------- | ---------------------- | --------------------------------------------------------------------------- |
| **Display** | Instrument Serif  | **solo 400** + cursiva | `<h1>` del Hero, títulos de sección, títulos de tarjeta, `<h1>` de la ficha |
| **Texto**   | Schibsted Grotesk | variable 400–900       | todo el texto corrido: resúmenes, highlights, párrafos, taglines            |
| **Mono**    | JetBrains Mono    | variable 400–900       | eyebrow, números, fechas, etiquetas de bloque, badges, **botones**, footer  |

**Instrument Serif no es variable.** Tiene un único peso, el 400, más su
cursiva. Consecuencia práctica: **en el display no hay `font-weight` como
recurso de jerarquía.** La jerarquía sale del tamaño y, si hace falta, de la
cursiva. Las otras dos sí son variables.

Y un segundo efecto que muerde al maquetar: Instrument Serif tiene la **altura
de x bastante menor** que Schibsted Grotesk, así que a igual tamaño en píxeles
el serif se lee más pequeño. Por eso el tamaño de los títulos de tarjeta tiene
un suelo de 24 px: a 20 px el título quedaba visualmente por debajo de su
propio tagline en móvil.

Detalle que sorprende y es deliberado: **los botones van en mono con
versalitas**, no en la tipografía de texto. Junto con las etiquetas y los
números, es lo que da el aire de ficha técnica.

### Escala

Cinco tamaños, y solo cinco. Todos fluidos menos el último.

| Token            | Móvil | Escritorio | Para qué                                     |
| ---------------- | ----- | ---------- | -------------------------------------------- |
| `--text-hero`    | 44 px | 96 px      | el `<h1>` del Hero                           |
| `--text-section` | 28 px | 48 px      | títulos de sección y `<h1>` de ficha         |
| `--text-card`    | 24 px | 30 px      | títulos de tarjeta                           |
| `--text-lead`    | 19 px | 22 px      | taglines, primer párrafo, bloques destacados |
| `--text-meta`    | 13 px | 13 px      | todo lo que va en mono                       |

Verificada en el navegador, no a ojo.

### Espaciado

Una sola escala, dos tokens:

- `--spacing-section` — 72 px en móvil, 144 px en escritorio. El aire vertical
  entre secciones.
- `--spacing-gutter` — 20 px en móvil, 40 px en escritorio. El margen lateral.

El ancho interno lo controla un único componente `Container` (máximo 1152 px),
no cada sección por su cuenta.

---

## 6. Color

Seis tokens nombrados y nada más. Cero gradientes, cero sombras decorativas.

| Token     | Claro     | Oscuro    | Para qué                        |
| --------- | --------- | --------- | ------------------------------- |
| `paper`   | `#faf9f6` | `#12110f` | el fondo                        |
| `surface` | `#f2f0eb` | `#1b1a17` | fondos de realce (hover)        |
| `line`    | `#e0ddd6` | `#2b2925` | los hairlines — **decorativos** |
| `muted`   | `#6e6a62` | `#9a958c` | metadatos, texto secundario     |
| `ink`     | `#17150f` | `#f5f3ee` | el texto                        |
| `accent`  | `#9e3b22` | `#e0755a` | **una vez por pantalla**        |

Los doce pares de texto pasan AA en los dos modos. `line` está en 1.29:1 **a
propósito**, porque es decorativo: cualquier borde que signifique algo usa
`muted` o `ink`, nunca `line`.

---

## 7. Rutas

| URL   | Página | Idioma  |
| ----- | ------ | ------- |
| `/`   | Home   | español |
| `/en` | Home   | inglés  |
| `/*`  | 404    | —       |

Español sin prefijo, inglés bajo `/en`. **Sin librería de i18n**: son unas 100
cadenas y no justifica el peso. Un fichero por idioma, y `useLocale()` lee el
prefijo de la URL y devuelve el bundle correcto.

Las dos URLs se generan como HTML estático en el build (`ssr: false` +
`prerender`), y del mismo listado salen el `sitemap.xml` y el `robots.txt` para
que no puedan desincronizarse.

El build deja además dos ficheros para hosts estáticos:

- **`404.html`** — copia del `__spa-fallback.html`. Es lo que hace que un
  refresco en una ruta desconocida no dé el 404 del host. Se copia del fallback
  y no de `index.html` para que no se vea la Home española un instante antes de
  que hidrate el 404.
- **`.nojekyll`** — sin él, GitHub Pages pasa el directorio por Jekyll, que
  descarta todo lo que empieza por `_`, incluido ese fallback.

---

## 8. Lo que conviene decidir al revisar esto

Tres de las cinco tensiones que había están resueltas: el CTA ya apunta a `01`,
la Solución ya está en la tarjeta y el desbordamiento de móvil ya no ocurre.
Queda esto:

1. **El CTA y el «seguir bajando» hacen lo mismo.** El botón lleva a la sección
   que empieza justo debajo. Sobra uno de los dos, y probablemente el hint.
2. **`featured` no filtra nada** (los cinco proyectos están en `true`).
3. **La numeración 01–05 está escrita a mano** en cinco ficheros. Reordenar
   obliga a renumerar, y una retícula numerada que salta rompe justo lo que la
   hace «precisa».
4. **Las cinco tarjetas completas hacen la Home larga.** Es lo que se buscaba
   —densidad y todo a la vista— pero conviene mirarla entera una vez antes de
   darla por buena.
5. **`SITE.url` sigue en `https://example.com`.** Bloquea canónicas, hreflang,
   `og:image` y el sitemap. Y si el destino es una _project page_ de GitHub
   Pages (`usuario.github.io/mi-portafolio/`), además hacen falta `base` en
   Vite y `basename` en el router.
