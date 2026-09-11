/**
 * Sirve `dist/client` **imitando a GitHub Pages**, que es donde vive el sitio.
 *
 * No es un servidor estático cualquiera, y la diferencia importa: si las
 * pruebas corrieran contra `react-router dev`, comprobarían un sitio que no
 * existe. El dev server inyecta el CSS por JS, no aplica el prerender y no
 * redirige nada. Aquí se reproducen las tres reglas que sí tiene Pages:
 *
 * 1. `/en` responde **301** hacia `/en/`. Verificado contra producción — es lo
 *    que hace Pages cuando el fichero real es `en/index.html`.
 * 2. Un directorio sirve su `index.html`.
 * 3. Lo que no existe devuelve `404.html` **con estado 404**, no con 200. Un
 *    servidor que devuelve el fallback con 200 esconde justo el fallo que el
 *    `404.html` existe para cubrir.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../dist/client/', import.meta.url))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

if (!existsSync(ROOT)) {
  console.error(`No existe ${ROOT}. Ejecuta \`npm run build\` antes.`)
  process.exit(1)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)

  // `normalize` neutraliza los `..` antes de tocar el disco.
  const target = join(ROOT, normalize(pathname))
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end()
    return
  }

  // Regla 1: una ruta sin extensión que existe como directorio se redirige
  // añadiendo la barra, igual que Pages.
  if (
    !extname(pathname) &&
    !pathname.endsWith('/') &&
    existsSync(target) &&
    statSync(target).isDirectory()
  ) {
    res.writeHead(301, { location: `${pathname}/${url.search}` }).end()
    return
  }

  // Regla 2: un directorio sirve su index.
  const file =
    existsSync(target) && statSync(target).isDirectory()
      ? join(target, 'index.html')
      : target

  if (existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    })
    res.end(await readFile(file))
    return
  }

  // Regla 3: el fallback, con 404 de verdad.
  res.writeHead(404, { 'content-type': TYPES['.html'] })
  res.end(await readFile(join(ROOT, '404.html')))
})

const port = Number(process.env.PORT ?? 4173)
server.listen(port, '127.0.0.1', () => {
  console.log(`sirviendo dist/client en http://127.0.0.1:${port}`)
})
