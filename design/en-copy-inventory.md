# Portafolio — inventario de textos EN + estructura

Generado el 2026-09-03 desde `src/content/en/*` y `src/`, y actualizado el
mismo día dos veces: tras aplicar la pasada de optimización de copy en los dos
idiomas, y tras el paso a **una sola página por idioma** (fuera la ficha de
proyecto). La estructura de §1 refleja lo segundo.

Todo el texto visible sale del sistema de contenido: no queda ni una cadena
incrustada en el JSX.

---

# 1. Estructura del portafolio

## 1.1 Rutas (`src/routes.ts`)

| URL   | Módulo                           | Idioma |
| ----- | -------------------------------- | ------ |
| `/`   | `pages/Home.tsx`                 | es     |
| `/en` | `pages/Home.tsx` (`id: home-en`) | en     |
| `/*`  | `pages/NotFound.tsx`             | —      |

Los `slug` (`suite-administrativa`, `sitio-corporativo-galilei`,
`plataforma-multicliente`, `app-punto-de-venta`, `comunicador-caa`) siguen
siendo idénticos en los dos bundles: ya no son URLs, pero son la clave estable
que empareja cada proyecto entre idiomas.

## 1.2 Orden de la Home

Vive en dos sitios que tienen que coincidir: el ensamblado de `pages/Home.tsx`
y `SECTION_IDS` en `lib/nav.ts` (gobierna Navbar y scroll spy).

```
<main id="main">
  1. Hero          (sin id de sección; no está en la nav)
  2. Experience    #experience   → + bloque Education
  3. About         #about
  4. Stack         #stack
  5. Projects      #projects     → 5 tarjetas
  6. Contact       #contact
</main>
```

Navbar muestra 5 entradas en ese orden: Experience · About · Stack · Work · Contact.
La numeración de `SectionHeading` (`index`) va a mano: 01…05 en ese mismo orden.

## 1.3 Anatomía de la tarjeta de proyecto (`ProjectCard`)

Ya no hay ficha: el caso completo se lee en la Home. La tarjeta no es un enlace
y no lleva hover que insinúe que se puede entrar.

```
01                    │ Multi-Client Admin Suite        ← serif, texto plano
BUSINESS SUITE · …    │ tagline
2025                  │ PROBLEM   → project.problem
                      │ SOLUTION  → project.solution
                      │ MY ROLE   → project.role
                      │ ▏OUTCOME: → project.outcome   (se omite si no existe)
                      │ [badges de stack]
                      │ View live / View repo         (solo visibility: public)
                      │ [UNDER NDA] [PRIVATE CODE]
```

`project.context` va sin etiqueta, en la columna de metadatos de la izquierda
junto al número y el año.

## 1.4 Árbol de ficheros

```
react-router.config.ts   ssr:false · prerender · appDirectory:"src" · buildDirectory:"dist"
src/
  root.tsx       <html>, script anti-flash del tema, ErrorBoundary
  routes.ts
  components/
    ui/          Badge, BrandIcon, Button, Card, Container, SectionHeading
    layout/      Footer, LocaleSwitch, Navbar, SkipLink, ThemeToggle
  sections/      Hero, Experience, About, Stack, Projects, ProjectCard, Contact
  pages/         Home, NotFound
  content/
    types.ts     Visibility · Project · ExperienceItem · EducationItem
                 SkillGroup · UIStrings · ContentBundle
    index.ts     locale → bundle
    es/          projects.ts · experience.ts · skills.ts · ui.ts
    en/          projects.ts · experience.ts · skills.ts · ui.ts
  hooks/         useLocale, useTheme, useScrollSpy, useMediaQuery
  lib/           cn · constants · dates · nav · paths · seo
  styles/        index.css  ← tokens @theme
public/          cv-es.pdf · cv-en.pdf · og-es.png · og-en.png · favicon.svg
```

## 1.5 Modelo de datos que consume el texto

```ts
Project = { slug, title, tagline, context, problem, solution, role,
            outcome?, stack[], cover?, links{live?,repo?},
            visibility: 'public'|'private'|'nda', featured, year }

ExperienceItem = { company, role, start, end|null, summary, highlights?[] }
EducationItem  = { institution, degree, start, end, note? }
SkillGroup     = { id, label, items[] }
```

`visibility` decide qué pinta la tarjeta: `public` → links; `private` →
"Private code"; `nda` → "Under NDA" + "Private code".

---

# 2. Textos largos — dónde están ahora

**El inventario de prosa que había aquí ya se usó y está aplicado.** La versión
optimizada del 2026-09-03 está en el código, en los dos idiomas, y **ese es el
único sitio donde vive el texto**:

| Bloque                                                 | Fichero                             |
| ------------------------------------------------------ | ----------------------------------- |
| Hero, SEO, About, leads de sección, footer, 404, error | `src/content/{es,en}/ui.ts`         |
| Empleos, highlights, formación                         | `src/content/{es,en}/experience.ts` |
| Los 5 casos de estudio                                 | `src/content/{es,en}/projects.ts`   |
| Etiquetas de grupo del stack                           | `src/content/{es,en}/skills.ts`     |

No se copia aquí a propósito: dos copias del mismo texto son dos copias que se
desincronizan. Para volver a pasar la prosa por un simplificador, se regenera
el inventario desde esos ficheros.

## 2.1 Qué cambió en la pasada del 2026-09-03

- **Hero** — el titular pasó por dos versiones el mismo día: primero
  «Construyo interfaces web y móviles de alto rendimiento.» / "Building
  performant web and mobile interfaces.", y después el definitivo, en registro
  nominal: **«Ingeniería de arquitectura web y móvil escalable.» / "Engineering
  scalable web and mobile architecture."** El CTA se acortó a `Ver proyectos` /
  `View work`, y luego pasó a `Ver experiencia` / `View experience` al
  reapuntarlo a la sección 01. El `eyebrow` no se ha tocado en ninguna pasada.
- **SEO** — las dos descriptions se reescribieron alrededor de
  arquitectura/rendimiento. 158 (es) y 157 (en) caracteres: dentro de 150–160.
- **About** — tres párrafos reescritos en registro más técnico. El párrafo 3
  perdió la anécdota («cerrar un mes en el mismo punto donde lo abrí») a cambio
  de una frase de principio.
- **Proyectos** — títulos renombrados a nombres de sistema
  («Enterprise Multi-Tenant Platform», «POS Hardware Operations App»), y los
  cinco `problem` / `solution` / `role` reescritos en registro de arquitectura.
  `[P2]` ahora nombra la empresa en el título («Sitio corporativo de Galilei»).
- **Experiencia** — summaries y highlights reescritos. **El español pasó a
  registro nominal**, ver §4. `[EXP1.h3]` se concretó después: donde decía
  «herramientas de asistencia por IA» ahora nombra Claude Code, spec-kit,
  Playwright y Maestro.
- **Stack** — el grupo de herramientas cambió JIRA · Slack · SCRUM por Claude
  Code · Playwright · Maestro · Agile/SCRUM. Es el único grupo cuyos `items`
  se han tocado.
- **Formación** — el título del grado pasó a `Ing. en Informática` /
  `B.Sc. in Computer Engineering`, ver §4.
- **404 y footer** — puntuación y coma de Oxford.
- **Nuevo:** `ui.error` en los dos bundles, que es lo que arregló el hueco 4.1.

## 2.2 Lo que NO se tocó

El micro-copy de §3: navegación, etiquetas de la tarjeta, contacto, tema, idioma
y los `items` del stack. Siguen exactamente igual.

---

# 3. Micro-copy EN — no tocar salvo error

Etiquetas, botones y textos accesibles. Ya son mínimos; "simplificarlos" solo
puede romper el paralelismo con el español o la accesibilidad.

## 3.1 Navegación — `ui.nav`

| clave           | texto           | nota                       |
| --------------- | --------------- | -------------------------- |
| `projects`      | Work            | apunta a `#projects`       |
| `about`         | About           |                            |
| `stack`         | Stack           |                            |
| `experience`    | Experience      |                            |
| `contact`       | Contact         |                            |
| `menu`          | Open menu       | aria-label del botón móvil |
| `primary`       | Main navigation | aria-label del `<nav>`     |
| `skipToContent` | Skip to content | primer enlace tabulable    |

## 3.2 Etiquetas de la tarjeta — `ui.project`

| clave         | texto        | nota                              |
| ------------- | ------------ | --------------------------------- |
| `problem`     | Problem      |                                   |
| `solution`    | Solution     |                                   |
| `role`        | My role      |                                   |
| `outcome`     | Outcome      | solo si el proyecto lo tiene      |
| `codePrivate` | Private code |                                   |
| `underNda`    | Under NDA    |                                   |
| `viewLive`    | View live    | solo `visibility: public`         |
| `viewRepo`    | View repo    | solo `visibility: public`         |
| `present`     | Present      | lo usa Experiencia, no la tarjeta |

Tres claves se borraron con la ficha: `context` (la columna de metadatos la
pinta sin rótulo), `stack` (las badges no llevan etiqueta) y `readCase` (no hay
enlace al siguiente caso).

## 3.3 Contacto, tema e idioma

| clave                     | texto                 |
| ------------------------- | --------------------- |
| `contact.email`           | Email me              |
| `contact.github`          | GitHub                |
| `contact.linkedin`        | LinkedIn              |
| `contact.cv`              | Download CV           |
| `theme.toLight`           | Switch to light theme |
| `theme.toDark`            | Switch to dark theme  |
| `locale.label`            | Language              |
| `locale.es` / `locale.en` | ES / EN               |

## 3.4 Stack — `src/content/en/skills.ts`

Solo las etiquetas de grupo son texto; los `items` son nombres propios.

| grupo        | etiqueta               | items                                                          |
| ------------ | ---------------------- | -------------------------------------------------------------- |
| `languages`  | Languages              | TypeScript · JavaScript · Dart · HTML · CSS / SASS             |
| `frameworks` | Frameworks & libraries | React · React Native · Angular · Flutter · Node.js             |
| `services`   | Services & integration | Firebase · REST APIs                                           |
| `tooling`    | Tooling & methodology  | Git · Claude Code · Playwright · Maestro · Figma · Agile/SCRUM |
| `spoken`     | Spoken languages       | Spanish — native · English — B2 professional                   |

## 3.5 Cargos de experiencia (`role`, no traducibles del todo)

- Frontend Developer · React
- Frontend Developer · Angular
- Frontend Developer · Flutter

---

# 4. Estado de los huecos

1. [x] **ErrorBoundary bilingüe.** `ui.error` está en los dos bundles y
       `root.tsx` deduce el idioma del `pathname`. `error.statusText` se descarta a
       propósito: el router lo escribe siempre en inglés.
2. [x] **Desbordamiento horizontal en móvil.** Resuelto en Contacto: valor
       recortado al dominio útil, más `min-w-0` y `wrap-break-word`.
3. [ ] **`SITE.url` sigue en `https://example.com`**: canónicas, hreflang,
       `og:image` y sitemap apuntan fuera del sitio. Bloquea el lanzamiento.
4. [ ] **Registro de los `highlights` en español.** La pasada de optimización
       los pasó a frases nominales («Ejecución de refactorización…»), pero el
       CLAUDE.md §5 declara **excepción deliberada**: primera persona y pasado
       («Refactoricé…»), que es el registro estándar de un CV. El comentario de
       cabecera de `es/experience.ts` se actualizó para reflejar lo que hay; si se
       prefiere el registro anterior hay que cambiar las dos cosas. El inglés no
       tiene el problema: usa verbo en pasado sin sujeto.
5. [ ] **Título del grado.** Dice `B.Sc. in Computer Engineering`. La
       Universidad Alejandro de Humboldt no expide un B.Sc.: expide el título de
       Ingeniero en Informática. Alternativas fieles: «Computer Engineering Degree»
       o «Ingeniero en Informática (Computer Engineering)».
6. [ ] **Disponibilidad declarada en el lead de Contacto.** «Available for
       full-time frontend roles» es una afirmación pública mientras el puesto de
       Galilei sigue abierto en Experiencia.

# 5. Restricciones para quien simplifique

De CLAUDE.md, para que la simplificación no rompa decisiones ya tomadas:

- **El inglés está escrito, no traducido**, y ya es entre 15% y 25% más corto
  que el español. Es el registro deliberado: más seco y directo.
- **`role` va en registro impersonal** (frases nominales: "Sole frontend
  responsibility. Implementation of…"). Prohibida la primera persona coloquial
  y el "we" a secas. **Excepción:** los `highlights` de experiencia sí usan
  primera persona en pasado ("Refactored…", "Built…") — es el registro de CV.
- **La atribución negativa se mantiene explícita**: en [P2.role], "The design
  is third-party" no se puede suavizar ni quitar.
- **Nada de métricas inventadas.** Los `outcome` sin números están así porque
  no hay números publicables. No se rellenan.
- **No nombrar a los clientes finales** en los tres proyectos `nda`: solo
  sector y escala.
- **El titular del Hero se pinta a `clamp(2.75rem, 8vw, 6rem)`.** Si crece
  mucho, rompe el layout de móvil; si se acorta, mejor.
- Prohibido "passionate about technology" y equivalentes.
