# Portafolio

Portafolio personal de desarrollador. Vite + React + TypeScript, Tailwind v4,
React Router en framework mode con prerender a HTML estático.

El contexto completo del proyecto — objetivo, arquitectura, decisiones de diseño
y convenciones — está en [CLAUDE.md](./CLAUDE.md). Este README solo cubre cómo
arrancarlo.

## Requisitos

- Node **>= 20** (React Router 7). Ojo: React Router 8 exige Node >= 22.22.0.
- npm 10+

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # build + prerender a dist/client
npm run typecheck  # react-router typegen && tsc
npm run lint       # oxlint
npm run format     # prettier
```

## Cómo funciona el prerender

`react-router.config.ts` usa `ssr: false` con `prerender`, así que el build emite
un `.html` real por ruta en `dist/client` y el cliente hidrata encima. No hay
servidor en runtime.

La comprobación de que funciona es directa — el HTML tiene que traer el contenido,
no un `<div>` vacío:

```bash
npm run build
grep -o "<h1[^>]*>[^<]*</h1>" dist/client/index.html
```

Con `ssr: false` las rutas dinámicas **hay que enumerarlas una a una** en
`prerender`, y `action` y `headers` no están disponibles.

## Estructura

```
src/
  root.tsx        <html>, tema anti-flash, ErrorBoundary
  routes.ts       rutas explícitas, ambos idiomas
  components/     ui/ (primitivos) · layout/
  sections/       Hero, Projects, About, Stack, Experience, Contact
  pages/          Home, ProjectDetail, NotFound   ← export default (lo exige el framework)
  content/        es/ · en/ · types.ts            ← fuente de verdad del contenido
  hooks/  lib/  styles/  assets/
```

Añadir un proyecto es empujar un objeto a `src/content/es/projects.ts`.
Ningún componente se toca.

## Deploy

`vercel.json` apunta a `dist/client` con fallback SPA. Cambiar a Netlify o
Cloudflare Pages es sustituir ese único fichero.
