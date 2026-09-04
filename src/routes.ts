import { type RouteConfig, index, route } from '@react-router/dev/routes'

/**
 * Rutas explícitas, no basadas en ficheros.
 *
 * Una sola página por idioma: los casos de estudio se leen completos en la
 * Home, así que no hay ficha de proyecto ni rutas dinámicas. `Home.tsx` se
 * monta dos veces —`useLocale()` lee el prefijo del pathname y devuelve el
 * bundle correcto— y el `id` es lo que permite reutilizar el mismo módulo.
 */
export default [
  index('pages/Home.tsx'),
  route('en', 'pages/Home.tsx', { id: 'home-en' }),

  route('*', 'pages/NotFound.tsx'),
] satisfies RouteConfig
