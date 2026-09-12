import { test, expect } from '@playwright/test'

/**
 * `prefers-reduced-motion`, que estaba implementado en todos los efectos y
 * nunca se había comprobado renderizado.
 *
 * El fallo concreto que esto busca está escrito en el CLAUDE.md §4: con
 * `animation-fill-mode: both`, poner a cero solo la **duración** deja el
 * elemento en su fotograma inicial durante todo el `animation-delay`. Y el
 * fotograma inicial de casi todos estos efectos es `opacity: 0`. Resultado:
 * quien tenga la preferencia activada —que suele tenerla por mareo o
 * migraña— ve una página en blanco. Es el peor fallo posible de accesibilidad:
 * el que solo le pasa a quien pidió ayuda.
 *
 * Por eso la aserción no es «no hay animación» sino «el texto **se ve**».
 */

test.use({ reducedMotion: 'reduce' })

for (const path of ['/', '/en/']) {
  test(`con movimiento reducido, el hero se ve en ${path}`, async ({
    page,
  }) => {
    await page.goto(path)

    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('Johnny')

    // El nombre va partido en trozos por el efecto de pliegue: cada trozo
    // tiene que estar opaco y sin girar, no solo el contenedor.
    const pieces = await page.locator('h1 .fold-text__panel').all()
    expect(
      pieces.length,
      'no se encontró el efecto de pliegue',
    ).toBeGreaterThan(0)

    for (const piece of pieces) {
      const state = await piece.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { opacity: Number(cs.opacity), transform: cs.transform }
      })
      expect(state.opacity, 'un trozo del nombre quedó invisible').toBe(1)
      expect(
        ['none', 'matrix(1, 0, 0, 1, 0, 0)'],
        'un trozo del nombre quedó girado en 3D',
      ).toContain(state.transform)
    }
  })
}

test('con movimiento reducido, el nombre de la barra no se teclea', async ({
  page,
}) => {
  // Escribir carácter a carácter es de los movimientos que más molestan: obliga
  // a leer algo que se está moviendo. Con la preferencia puesta el texto sale
  // entero de una vez, y el cursor deja de parpadear — un rectángulo que se
  // enciende y se apaga cada 0,9s es movimiento igual.
  await page.goto('/')
  await page.evaluate(() => {
    const hero = document.getElementById('hero')!
    window.scrollTo(
      0,
      hero.getBoundingClientRect().bottom + window.scrollY + 40,
    )
  })

  const live = page.locator('header .text-type__live')
  await expect(live).toContainText('Johnny Bohorquez')

  const cursor = page.locator('header .text-type__live .text-type__cursor')
  expect(
    await cursor.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none')
})

test('con movimiento reducido, el menú móvil sigue abriendo', async ({
  page,
}) => {
  // Sin recorrido, pero usable: quitar la animación no puede dejar el menú sin
  // abrirse, que es el modo en que este tipo de arreglo se rompe.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const button = page.locator('header button[aria-controls="menu-movil"]')
  const box = (await button.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)

  const clip = page.locator('#menu-movil .nav-panel__clip')
  await expect
    .poll(() => clip.evaluate((el) => el.getBoundingClientRect().height), {
      timeout: 3000,
    })
    .toBeGreaterThan(200)
  await expect(page.locator('#menu-movil a[href$="#contact"]')).toBeVisible()
})

test('con movimiento reducido, todo el contenido está visible', async ({
  page,
}) => {
  await page.goto('/')

  // Recorre la página entera: los efectos de entrada por sección son los que
  // más fácil se quedan a medias.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
  })
  await page.waitForTimeout(300)

  const invisible = await page.evaluate(() => {
    const out: string[] = []
    for (const el of document.querySelectorAll('h1, h2, h3, p, li, dd')) {
      if (!el.textContent?.trim()) continue
      if (el.closest('[aria-hidden="true"]')) continue
      const cs = getComputedStyle(el)
      if (Number(cs.opacity) < 0.9 || cs.visibility === 'hidden') {
        out.push(
          `${el.tagName.toLowerCase()} «${el.textContent.trim().slice(0, 40)}» opacity=${cs.opacity}`,
        )
      }
    }
    return out
  })

  expect(invisible, invisible.join('\n')).toEqual([])
})

test.describe('con movimiento normal', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('el hero también acaba visible', async ({ page }) => {
    // La contraparte: comprobar que la preferencia reducida no es la única
    // ruta por la que el texto se ve. Si esta fallara, el fallo sería que las
    // animaciones no terminan.
    await page.goto('/')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    await expect
      .poll(
        async () =>
          page
            .locator('h1 .fold-text__panel')
            .first()
            .evaluate((el) => Number(getComputedStyle(el).opacity)),
        { timeout: 4000 },
      )
      .toBe(1)
  })
})
