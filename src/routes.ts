import { type RouteConfig, index, route } from '@react-router/dev/routes'

/**
 * Rutas explícitas, no basadas en ficheros.
 *
 * Home.tsx y ProjectDetail.tsx se reutilizan para los dos idiomas: `useLocale()`
 * lee el prefijo del pathname y devuelve el bundle correcto. El `id` es lo que
 * permite montar el mismo módulo dos veces.
 */
export default [
  index('pages/Home.tsx'),
  route('proyectos/:slug', 'pages/ProjectDetail.tsx'),

  route('en', 'pages/Home.tsx', { id: 'home-en' }),
  route('en/projects/:slug', 'pages/ProjectDetail.tsx', { id: 'project-detail-en' }),

  route('*', 'pages/NotFound.tsx'),
] satisfies RouteConfig
