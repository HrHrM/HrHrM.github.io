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
| Rutas | React Router | |
| Prerender | `vite-react-ssg` | HTML estático en build → SEO real |
| Animación | `motion` | con moderación |
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
- **`vite-react-ssg` cambia `main.tsx`**: se exporta `createRoot` en vez de montar
  directamente, y las rutas se declaran como array de objetos.
- **Oxlint es linter, no formateador.** No sustituye a Prettier.

---

## 3. Arquitectura

SPA por capas con **el contenido como fuente de verdad**. Sin state manager:
`useState` local, y un Context solo para el tema. Si algo aquí parece pedir Redux,
es señal de que se complicó de más.

```
src/
  components/
    ui/          Button, Badge, Card, Container  → primitivos, sin lógica de negocio
    layout/      Navbar, Footer, ThemeToggle
  sections/      Hero, About, Projects, Stack, Experience, Contact
  pages/         Home, ProjectDetail, NotFound
  content/
    types.ts     tipos compartidos por ambos idiomas
    es/          projects.ts, experience.ts, skills.ts, ui.ts
    en/          projects.ts, experience.ts, skills.ts, ui.ts
  hooks/         useTheme, useLocale, useScrollSpy, useMediaQuery
  lib/           cn.ts, seo.ts, constants.ts
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
  cover: string;
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
- `vite-react-ssg` prerenderiza ambos idiomas → Google los indexa por separado.
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

Las tres son variable fonts y están en Google Fonts.
Máximo dos familias + la mono. Escala tipográfica definida **antes** de maquetar.

```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  --font-display: "Instrument Serif", ui-serif, serif;
  --font-sans: "Schibsted Grotesk", ui-sans-serif, system-ui;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --text-hero: clamp(2.75rem, 8vw, 6rem);
  --text-section: clamp(1.75rem, 4vw, 3rem);

  /* TODO: paleta — 4 a 6 valores nombrados */
}
```

### Principios

- **Mobile-first**, siempre.
- **Una sola apuesta visual.** Un elemento memorable, todo lo demás disciplinado
  y en silencio. La animación dispersa por toda la página es lo que hace que un
  portafolio se vea genérico.
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
- Hooks y utilidades en `camelCase.ts`.
- Alias `@/` → `src/`, configurado en `vite.config.ts` y `tsconfig.json`.
- Sin `any`. Sin `// @ts-ignore` sin comentario que lo justifique.
- Clases de Tailwind siempre vía `cn()` cuando hay condicionales.
- Los colores salen de los tokens de `@theme`, nunca hex sueltos en el JSX.
- Commits en imperativo: `add project card`, `fix mobile nav overflow`.

---

## 7. Orden de trabajo

- [ ] **Contenido primero** — textos y proyectos escritos antes de diseñar.
- [ ] **Diseño** — tokens → wireframe en gris → alta fidelidad. Mobile primero.
- [ ] **Setup** — Vite, Tailwind con los tokens ya traducidos, deploy vacío a
      producción. Que la tubería funcione desde el día uno.
- [ ] **Maquetado** — con datos reales, sección por sección.
- [ ] **Pulido** — animación, accesibilidad, imágenes optimizadas, Lighthouse.
- [ ] **Lanzamiento** — dominio propio, OG image, analytics ligero.

---

## 8. Pendiente de definir

Esto bloquea el diseño. Rellenar antes de escribir componentes:

- [ ] Nombre, rol y una frase de posicionamiento.
- [ ] Los 3–4 proyectos: problema / qué construí / mi rol / resultado.
- [ ] Nivel de `visibility` de cada uno — preguntar al cliente o ex-jefe si hay duda.
      Suele ser que sí y tarda dos días; hacerlo ya para no rehacer tarjetas después.
- [ ] Tres adjetivos que definan la página. De ahí sale todo lo demás.
- [ ] Referencias: 15–20 piezas, y no solo portafolios — portadas, señalética,
      packaging, revistas. Lo que se repita es la dirección.
- [ ] Paleta — 4 a 6 hex nombrados.
- [ ] Confirmar que Instrument Serif sigue encajando una vez definida la dirección.
- [ ] Dominio.
