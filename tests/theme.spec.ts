import { test, expect } from '@playwright/test'

/**
 * El tema: que persista y que **no parpadee**.
 *
 * El parpadeo es el interesante. Lo evita un script en línea en el `<head>`
 * que lee `localStorage` y pone la clase `dark` antes de que se pinte nada
 * (`root.tsx`). Si ese script se moviera, se hiciera `defer` o se rompiera,
 * la página se vería igual una vez cargada: el único síntoma sería un
 * fogonazo blanco de un fotograma al entrar en modo oscuro. Nadie lo detecta
 * revisando código.
 */

const DARK_BG = /rgb\(13, 22, 20\)|#0d1614/i

test('por defecto sigue la preferencia del sistema', async ({ browser }) => {
  const dark = await browser.newContext({ colorScheme: 'dark' })
  const p1 = await dark.newPage()
  await p1.goto('/')
  await expect(p1.locator('html')).toHaveClass(/dark/)
  await dark.close()

  const light = await browser.newContext({ colorScheme: 'light' })
  const p2 = await light.newPage()
  await p2.goto('/')
  await expect(p2.locator('html')).not.toHaveClass(/dark/)
  await light.close()
})

test('el botón alterna y lo recuerda al recargar', async ({ page }) => {
  await page.goto('/')
  const before = await page
    .locator('html')
    .evaluate((el) => el.classList.contains('dark'))

  await page
    .getByRole('button', { name: /tema|theme/i })
    .first()
    .click()

  // La transición de vista tarda 620ms; sin esperar, la clase puede leerse a
  // medio camino.
  await expect
    .poll(() =>
      page.locator('html').evaluate((el) => el.classList.contains('dark')),
    )
    .toBe(!before)

  const stored = await page.evaluate(() => localStorage.getItem('theme'))
  expect(stored).toBe(before ? 'light' : 'dark')

  await page.reload()
  expect(
    await page.locator('html').evaluate((el) => el.classList.contains('dark')),
  ).toBe(!before)
})

test('no parpadea: el fondo ya es oscuro en el primer fotograma', async ({
  browser,
}) => {
  // Se fuerza el tema oscuro contra una preferencia de sistema clara: así, si
  // el script anti-flash no corriera a tiempo, el primer fotograma saldría con
  // el fondo claro y la diferencia sería máxima.
  const context = await browser.newContext({ colorScheme: 'light' })
  await context.addInitScript(() => localStorage.setItem('theme', 'dark'))
  const page = await context.newPage()

  // `commit` devuelve el control en cuanto llega la respuesta, antes de que
  // el documento acabe de cargar y mucho antes de que React hidrate.
  await page.goto('/', { waitUntil: 'commit' })

  const classAtStart = await page
    .locator('html')
    .evaluate((el) => el.classList.contains('dark'))
  expect(classAtStart, 'la clase dark no estaba puesta al empezar').toBe(true)

  await page.waitForLoadState('domcontentloaded')
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  )
  expect(bg).toMatch(DARK_BG)

  await context.close()
})

test('el tema sobrevive al cambio de idioma', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.getByRole('link', { name: 'EN', exact: true }).first().click()
  await expect(page).toHaveURL(/\/en\/?$/)
  await expect(page.locator('html')).toHaveClass(/dark/)
})
