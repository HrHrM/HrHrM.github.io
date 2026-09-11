import { test, expect } from '@playwright/test'

/**
 * El prerender: que el HTML **estático** traiga el contenido.
 *
 * Es la comprobación que no se puede saltar (CLAUDE.md §7). Si esto falla, el
 * motivo entero de usar framework mode se ha perdido y nadie se entera: la
 * página se ve idéntica en el navegador, porque React la rellena al hidratar.
 * Quien lo nota es Google, y meses después.
 *
 * Va con `request` y no con `page` a propósito: `request` no ejecuta
 * JavaScript, así que lo que se mide es exactamente el HTML que sale del
 * servidor. Con `page` la prueba pasaría igual aunque el prerender estuviera
 * muerto.
 */

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'stack', 'contact']

const ROUTES = [
  { path: '/', locale: 'es', title: 'Desarrollador de software' },
  { path: '/en/', locale: 'en', title: 'Software Developer' },
] as const

for (const route of ROUTES) {
  test.describe(`prerender ${route.path}`, () => {
    test('el HTML trae el nombre y las seis secciones', async ({ request }) => {
      const html = await (await request.get(route.path)).text()

      expect(html).toContain('Johnny Bohorquez')
      for (const id of SECTIONS) {
        expect(html, `falta la sección ${id}`).toContain(`id="${id}"`)
      }
    })

    test('trae el texto real, no solo la estructura', async ({ request }) => {
      const html = await (await request.get(route.path)).text()

      // Un `<div>` con los `id` correctos y sin texto dentro también pasaría
      // la prueba de arriba. Esto mide que el contenido de verdad está: los
      // párrafos de «Sobre mí» son de los más largos del sitio.
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<[^>]+>/g, ' ')
      expect(text.length).toBeGreaterThan(4000)
    })

    test('el idioma y el título son los del idioma', async ({ request }) => {
      const html = await (await request.get(route.path)).text()

      expect(html).toContain(`<html lang="${route.locale}"`)
      expect(html).toContain(route.title)
    })

    test('las etiquetas de SEO apuntan al dominio real', async ({
      request,
    }) => {
      const html = await (await request.get(route.path)).text()

      // El fallo que esto cubre no es hipotético: `SITE.url` estuvo en
      // `https://example.com` hasta el día de publicar, y con ese valor las
      // canónicas le decían a Google que el sitio vivía en otro dominio.
      expect(html).not.toContain('example.com')
      expect(html).toMatch(/rel="canonical"/)

      // Sin distinguir mayúsculas, y no por comodidad: React serializa el prop
      // `hrefLang` tal cual, así que en el HTML sale `hrefLang="es"`. Es válido
      // —los nombres de atributo de HTML no distinguen caja— pero una
      // comparación literal en minúsculas falla y hace pensar que falta la
      // etiqueta. Ya pasó al escribir esta prueba.
      expect(html).toMatch(/hreflang="es"/i)
      expect(html).toMatch(/hreflang="en"/i)
      expect(html).toMatch(/hreflang="x-default"/i)

      // `og:image` tiene que ser absoluta o WhatsApp y LinkedIn no la
      // resuelven (CLAUDE.md §8).
      const og = html.match(/property="og:image"\s+content="([^"]+)"/)
      expect(og, 'no hay og:image').not.toBeNull()
      expect(og![1]).toMatch(/^https:\/\//)
    })
  })
}

test('la canónica de cada ruta responde 200, sin redirección', async ({
  request,
}) => {
  // Declarar como canónica una URL que redirige es un error silencioso: Google
  // sigue el 301 y la indexa igual, así que nada avisa. Esto lo hace ruidoso.
  for (const route of ROUTES) {
    const html = await (await request.get(route.path)).text()
    const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1]
    expect(canonical, `sin canónica en ${route.path}`).toBeTruthy()

    const path = new URL(canonical!).pathname
    const res = await request.get(path, { maxRedirects: 0 })
    expect(
      res.status(),
      `la canónica de ${route.path} (${path}) no responde 200`,
    ).toBe(200)
  }
})

test('el sitemap y el robots existen y concuerdan', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()

  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  const txt = await robots.text()

  expect(txt).toContain('Sitemap:')
  // Nada de `noindex` colado por error.
  expect(txt).not.toMatch(/Disallow:\s*\/\s*$/m)

  // Cada URL del sitemap tiene que responder 200 tal cual está escrita.
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  expect(locs.length).toBeGreaterThan(0)
  for (const loc of locs) {
    const res = await request.get(new URL(loc).pathname, { maxRedirects: 0 })
    expect(res.status(), `${loc} no responde 200`).toBe(200)
  }
})

test('una ruta desconocida devuelve 404 de verdad', async ({ request }) => {
  // Con estado 200 el fallback esconde el fallo: el navegador y Google verían
  // una página válida donde no hay nada.
  const res = await request.get('/no-existe-esta-ruta', { maxRedirects: 0 })
  expect(res.status()).toBe(404)
})
