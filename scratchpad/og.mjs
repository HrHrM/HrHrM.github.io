/**
 * Rasteriza `scratchpad/og.html` a `public/og-es.png` y `public/og-en.png`.
 *
 *     npx playwright install chromium   # una sola vez
 *     node scratchpad/og.mjs
 *
 * Se sirve el repo por HTTP en vez de abrir el fichero con `file://` porque
 * `og.html` carga las fuentes desde `node_modules`, y con `file://` el
 * navegador las bloquea sin decir nada: la imagen sale con la fuente de
 * sistema y la diferencia solo se ve comparando.
 *
 * 1200×630 es la medida que piden OpenGraph y Twitter. `deviceScaleFactor: 1`
 * a propósito: al doble de escala la imagen pesa cuatro veces más y ningún
 * cliente la muestra por encima de 600px de ancho.
 */
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
}

const server = createServer(async (req, res) => {
  // `normalize` corta los `..`: es un servidor de un solo uso, pero servir el
  // disco entero por descuido no cuesta menos por ser temporal.
  const path = join(ROOT, normalize(decodeURI(req.url.split('?')[0])))
  if (!path.startsWith(ROOT)) return res.writeHead(403).end()
  try {
    await stat(path)
  } catch {
    return res.writeHead(404).end()
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
  })
  createReadStream(path).pipe(res)
})

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

for (const [lang, query] of [
  ['es', ''],
  ['en', '?en'],
]) {
  await page.goto(`${base}/scratchpad/og.html${query}`)
  // Sin esto la captura puede salir con la fuente de reserva: `font-display:
  // block` evita el destello, pero no hace esperar a la captura.
  await page.evaluate(() => document.fonts.ready)
  const out = `public/og-${lang}.png`
  await page.screenshot({ path: join(ROOT, out) })
  console.log(`escrito ${out}`)
}

await browser.close()
server.close()
