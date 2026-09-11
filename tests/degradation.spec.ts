import { test, expect } from '@playwright/test'

/**
 * Que el sitio siga siendo el sitio cuando el navegador no puede con todo.
 *
 * Existe por un fallo real, y de los caros: sin WebGL, el portafolio entero se
 * sustituía por «Un error inesperado. Vuelve a intentarlo.» La cadena era que
 * `ogl` no lanza al quedarse sin contexto — hace `console.error` y sigue con
 * `gl` a `null`— así que reventaba la primera línea que lo usaba, con un
 * `TypeError` que subía hasta el ErrorBoundary de `root.tsx`.
 *
 * Lo destapó Firefox en el runner de CI, que no tiene GPU. En local no se veía:
 * Chromium cae a SwiftShader por software y sí consigue contexto, así que el
 * fallo era invisible en las dos máquinas donde se desarrolla.
 *
 * Y no es un caso de laboratorio. Sin WebGL se queda quien tiene la
 * aceleración por hardware desactivada —frecuente en portátiles
 * corporativos—, quien entra desde una máquina virtual o un escritorio
 * remoto, y quien usa un navegador endurecido por privacidad. Es decir,
 * posiblemente el reclutador.
 *
 * **El bloqueo se hace desde JavaScript y no con banderas del navegador** para
 * que la prueba corra igual en Chromium y en Firefox: cada motor tiene su
 * propia forma de desactivar WebGL, y una prueba que solo funciona en uno deja
 * medio arnés sin cubrir.
 */

const BLOCK_WEBGL = () => {
  const original = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    type: string,
    ...rest: unknown[]
  ) {
    if (
      type === 'webgl' ||
      type === 'webgl2' ||
      type === 'experimental-webgl'
    ) {
      return null
    }
    // El 2D se deja pasar: la geodésica del hero lo usa, y bloquearlo estaría
    // probando otra cosa.
    return original.call(
      this,
      type as '2d',
      ...(rest as [CanvasRenderingContext2DSettings?]),
    )
  } as typeof HTMLCanvasElement.prototype.getContext
}

for (const path of ['/', '/en/']) {
  test(`sin WebGL, ${path} sigue mostrando el portafolio`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

    await page.addInitScript(BLOCK_WEBGL)
    await page.goto(path)

    // Lo primero: que no sea la página de error. Se comprueba por el texto y
    // no por la ausencia de excepciones, porque el ErrorBoundary las captura
    // — que es justo lo que hacía el fallo silencioso.
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText('Johnny Bohorquez')
    await expect(page.locator('body')).not.toContainText(
      /error inesperado|unexpected error/i,
    )

    // Y las seis secciones siguen ahí, no solo el titular.
    for (const id of [
      'hero',
      'about',
      'experience',
      'projects',
      'stack',
      'contact',
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }

    // Sin ruido en la consola tampoco. Se sondea WebGL **antes** de tocar
    // `ogl` justo por esto: capturar la excepción habría dejado su
    // `console.error` a la vista del visitante.
    expect(errors, errors.join('\n')).toEqual([])
  })
}

test('sin WebGL, el placeholder estático del hero se queda visible', async ({
  page,
}) => {
  await page.addInitScript(BLOCK_WEBGL)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.waitForTimeout(800)

  // El hero pinta primero una versión estática y la desvanece cuando el canvas
  // confirma su primer fotograma. Sin WebGL ese fotograma no llega nunca, así
  // que el estático tiene que **quedarse** — si se desvaneciera igual, el
  // fondo del hero saldría vacío.
  const stillVisible = await page.evaluate(() => {
    const svgs = [...document.querySelectorAll('#hero svg')]
    return svgs.some((el) => {
      const cs = getComputedStyle(el.closest('div') ?? el)
      return Number(cs.opacity) > 0.5
    })
  })

  expect(stillVisible, 'el hero se quedó sin fondo al no haber WebGL').toBe(
    true,
  )
})
