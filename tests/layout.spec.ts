import { test, expect } from '@playwright/test'

/**
 * Maquetado y consola: los dos fallos que se cuelan sin que nadie los vea.
 *
 * El scroll horizontal es el más traicionero de los dos. En escritorio no se
 * nota —hay sitio de sobra— y en móvil convierte todo el sitio en algo que se
 * mueve de lado al desplazarse. Casi siempre lo causa un elemento decorativo
 * con posición absoluta, y aquí hay unos cuantos: los gradientes de los
 * márgenes, la espiral de «Sobre mí», las partículas del hero.
 */

const WIDTHS = [390, 768, 1024, 1440, 1920]
const ROUTES = ['/', '/en/']

for (const path of ROUTES) {
  for (const width of WIDTHS) {
    test(`sin scroll horizontal en ${path} a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)

      // Hasta el fondo: los adornos del final de página no existen hasta que
      // se llega, porque montan con IntersectionObserver.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(400)

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          // Y quién lo causa, para no tener que buscarlo a mano al fallar.
          culprits: [...document.querySelectorAll('body *')]
            .filter(
              (el) => el.getBoundingClientRect().right > doc.clientWidth + 1,
            )
            .slice(0, 5)
            .map((el) => {
              const r = el.getBoundingClientRect()
              return `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')} → ${Math.round(r.right)}px`
            }),
        }
      })

      expect(
        overflow.scrollWidth,
        `se desborda ${overflow.scrollWidth - overflow.clientWidth}px. Culpables: ${overflow.culprits.join(' · ') || 'ninguno identificado'}`,
      ).toBeLessThanOrEqual(overflow.clientWidth)
    })
  }

  test(`sin errores de consola en ${path}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

    await page.goto(path)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(600)

    expect(errors, errors.join('\n')).toEqual([])
  })
}

test('el menú móvil abre y navega', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  // Sin desplazamiento suave: lo que se prueba es a dónde llega el enlace, no
  // la animación, y en móvil el recorrido hasta Contacto es aún más largo. La
  // nota completa está en `navigation.spec.ts`, en `visit`.
  await page.addStyleTag({
    content: 'html, body { scroll-behavior: auto !important; }',
  })

  const menu = page.getByRole('button', { name: /menú|menu/i }).first()

  // El botón del menú se oculta sobre el Hero igual que los enlaces —abre lo
  // mismo, así que ahí no tendría nada que abrir— y hay que bajar antes de
  // pulsarlo. Se reintenta porque `<ScrollRestoration />` sube la página al
  // acabar la hidratación; ver la nota larga en `navigation.spec.ts`.
  await expect
    .poll(
      async () => {
        const y = await page
          .locator('#hero')
          .evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY)
        await page.evaluate(
          (to) => window.scrollTo({ top: to, behavior: 'instant' }),
          y + 40,
        )
        await page.waitForTimeout(200)
        return menu.evaluate((el) => getComputedStyle(el).pointerEvents)
      },
      { timeout: 15_000 },
    )
    .toBe('auto')

  // Con el ratón en coordenadas, no con `locator.click()`: este desplaza la
  // página antes de pulsar y con una cabecera `sticky` eso acaba en scrollY 0,
  // donde el botón vuelve a estar oculto. La nota larga está en
  // `navigation.spec.ts`, junto a `clickNav`.
  const menuBox = (await menu.boundingBox())!
  await page.mouse.click(
    menuBox.x + menuBox.width / 2,
    menuBox.y + menuBox.height / 2,
  )

  const link = page.locator('#menu-movil a[href$="#contact"]')
  await expect(link).toBeVisible()
  const linkBox = (await link.boundingBox())!
  await page.mouse.click(
    linkBox.x + linkBox.width / 2,
    linkBox.y + linkBox.height / 2,
  )

  await page.waitForTimeout(900)
  const top = await page
    .locator('#contact')
    .evaluate((el) => el.getBoundingClientRect().top)
  expect(Math.abs(top - 80)).toBeLessThanOrEqual(6)
})

test('las imágenes y el CV que se enlazan existen', async ({
  page,
  request,
}) => {
  await page.goto('/')

  // Rutas absolutas que escribe algo de fuera del bundle —el CV, las OG, los
  // iconos— y que por tanto Vite no comprueba (CLAUDE.md §8). Un cambio de
  // nombre aquí da un 404 silencioso.
  const assets = [
    '/favicon.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/og-es.png',
    '/og-en.png',
    '/Johnny_Bohorquez_CV_ES.pdf',
    '/Johnny_Bohorquez_CV.pdf',
  ]

  for (const asset of assets) {
    const res = await request.get(asset)
    expect(res.status(), `${asset} no responde`).toBe(200)
  }
})
