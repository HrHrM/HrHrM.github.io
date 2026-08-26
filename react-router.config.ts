import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '@react-router/dev/config'

import { SITE } from './src/lib/constants'

/**
 * Rutas a generar. Se leen los slugs de los dos bundles de contenido, así que
 * añadir un proyecto a `content/es/projects.ts` genera su HTML y su entrada en
 * el sitemap sin tocar nada aquí.
 */
async function routePaths() {
  const [{ projects: es }, { projects: en }] = await Promise.all([
    import('./src/content/es/projects'),
    import('./src/content/en/projects'),
  ])

  return [
    '/',
    '/en',
    ...es.map((p) => `/proyectos/${p.slug}`),
    ...en.map((p) => `/en/projects/${p.slug}`),
  ]
}

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
   *
   * Verificado tras activarlos: typecheck y lint limpios, las 11 rutas siguen
   * prerenderizando y el HTML sigue trayendo el contenido.
   */
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },

  // Con `ssr: false` las rutas dinámicas NO se descubren solas: hay que enumerarlas.
  prerender: routePaths,

  /**
   * sitemap.xml y robots.txt se generan del mismo listado que el prerender, para
   * que no puedan desincronizarse. Salen con la URL de `SITE.url`: mientras eso
   * sea example.com el sitemap apunta a un sitio ajeno — es el mismo bloqueo que
   * las canónicas, y se arregla en un solo sitio.
   */
  async buildEnd({ viteConfig }) {
    const outDir = path.join(viteConfig.build.outDir ?? 'dist/client')
    const base = SITE.url.replace(/\/$/, '')
    const paths = await routePaths()

    const urls = paths
      .map((p) => {
        // Los hreflang del sitemap: cada URL declara sus dos variantes.
        const isEn = p === '/en' || p.startsWith('/en/')
        const esPath = isEn
          ? p === '/en'
            ? '/'
            : p.replace('/en/projects/', '/proyectos/')
          : p
        const enPath = isEn
          ? p
          : p === '/'
            ? '/en'
            : p.replace('/proyectos/', '/en/projects/')

        return [
          '  <url>',
          `    <loc>${base}${p === '/' ? '/' : p}</loc>`,
          `    <xhtml:link rel="alternate" hreflang="es" href="${base}${esPath === '/' ? '/' : esPath}"/>`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${base}${enPath}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${esPath === '/' ? '/' : esPath}"/>`,
          '  </url>',
        ].join('\n')
      })
      .join('\n')

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

    console.log(`  sitemap.xml y robots.txt escritos (${paths.length} URLs)`)
  },
} satisfies Config
