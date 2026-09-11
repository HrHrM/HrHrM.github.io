import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '@react-router/dev/config'

import { SITE } from './src/lib/constants'
import { absoluteUrl } from './src/lib/paths'

/**
 * Rutas a generar: una por idioma y nada más.
 *
 * Los casos de estudio se leen completos en la Home, así que no hay rutas
 * dinámicas que enumerar. Cuando las hubo, este listado se derivaba de
 * `content/{es,en}/projects.ts`; si algún día vuelven las fichas, ese es el
 * sitio donde volver a leerlas.
 */
const ROUTE_PATHS = ['/', '/en'] as const

export default {
  // Conserva el árbol de src/ que describe el CLAUDE.md en vez del app/ por defecto.
  appDirectory: 'src',
  buildDirectory: 'dist',

  // Sin servidor en runtime: el build emite un .html por ruta y el cliente hidrata.
  ssr: false,

  /**
   * Los cinco cambios de comportamiento que React Router 7 anuncia para la 8.
   * Se activan ya por dos razones: silencian los avisos de consola y, sobre
   * todo, dejan el proyecto probado contra el comportamiento nuevo, así que el
   * salto a la 8 (cuando Node llegue a 22.22) no traerá sorpresas.
   */
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },

  prerender: [...ROUTE_PATHS],

  /**
   * Tres ficheros que el build tiene que dejar en `dist/client`:
   *
   * - `sitemap.xml` y `robots.txt`, generados del mismo listado que el
   *   prerender para que no puedan desincronizarse. Salen con `SITE.url`:
   *   mientras eso sea example.com el sitemap apunta a un sitio ajeno — el
   *   mismo bloqueo que las canónicas, y se arregla en un solo sitio.
   * - `404.html`, que es lo que hace que un refresco en una ruta desconocida
   *   funcione en un host estático como GitHub Pages. Se copia del
   *   `__spa-fallback.html` que ya emite React Router: es el cascarón sin
   *   contenido prerenderizado, así que el visitante no ve la Home española
   *   durante un instante antes de que hidrate el 404. Si algún día deja de
   *   emitirse, cae a `index.html`, que es el comportamiento clásico.
   */
  async buildEnd({ viteConfig }) {
    /**
     * `viteConfig.build.outDir` es el directorio raíz del build (`dist`), NO
     * el del cliente: los ficheros servibles van en `dist/client`, y `dist/`
     * solo contiene esa carpeta. Escribir ahí deja el sitemap y el robots
     * fuera de lo que publica el host — estuvieron así hasta que el 404.html
     * lo destapó, porque copiar el fallback desde `dist/` falló con ENOENT.
     */
    const buildDir = viteConfig.build.outDir ?? 'dist'
    const outDir = path.join(buildDir, 'client')
    const base = SITE.url.replace(/\/$/, '')

    /**
     * Las URL salen de `absoluteUrl`, la misma función que construye las
     * canónicas de cada página, en vez de concatenarse a mano aquí. Antes eran
     * dos formas distintas de escribir lo mismo y divergieron: el sitemap
     * listaba `…/en` mientras Pages redirige eso a `…/en/` con un 301, así que
     * cada `<loc>` apuntaba a una redirección.
     */
    const es = absoluteUrl(base, '/')
    const en = absoluteUrl(base, '/en')

    const urls = ROUTE_PATHS.map((p) =>
      [
        '  <url>',
        `    <loc>${absoluteUrl(base, p)}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${es}"/>`,
        '  </url>',
      ].join('\n'),
    ).join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

    const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

    await mkdir(outDir, { recursive: true })
    await Promise.all([
      writeFile(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8'),
      writeFile(path.join(outDir, 'robots.txt'), robots, 'utf8'),
    ])

    const fallback = path.join(outDir, '__spa-fallback.html')
    const notFound = path.join(outDir, '404.html')
    try {
      await copyFile(fallback, notFound)
    } catch {
      await writeFile(
        notFound,
        await readFile(path.join(outDir, 'index.html'), 'utf8'),
        'utf8',
      )
    }

    /**
     * `.nojekyll` va con el 404: GitHub Pages pasa el directorio por Jekyll si
     * no está, y Jekyll descarta todo lo que empieza por `_` — incluido el
     * `__spa-fallback.html` del que sale el propio 404. Fichero vacío, y no
     * molesta en Vercel ni en Netlify.
     */
    await writeFile(path.join(outDir, '.nojekyll'), '', 'utf8')

    console.log(
      `  sitemap.xml, robots.txt, 404.html y .nojekyll escritos (${ROUTE_PATHS.length} URLs)`,
    )
  },
} satisfies Config
