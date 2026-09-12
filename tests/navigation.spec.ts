import { test, expect, type Page } from '@playwright/test'

/**
 * Navegación: la barra superior y el cambio de idioma.
 *
 * La prueba del primer clic es la que más se ha ganado su sitio en este repo.
 * El fallo real: los enlaces eran `<a href="#seccion">`, el cambio de hash
 * contaba como navegación para el router, y `<ScrollRestoration />` restauraba
 * la posición guardada en `sessionStorage` **después** de que el ancla hubiera
 * saltado. Medido entonces: el primer clic llevaba a scrollY 7942 —el fondo de
 * la página— y hacía falta un segundo clic para llegar. La pista de que era el
 * router y no el CSS: el CTA del hero, que sí era un `Link`, funcionaba.
 *
 * Por eso todo lo de aquí mide **después de un solo clic**. Una prueba que
 * tolerase dos no habría detectado nada.
 */

const SECTIONS = ['about', 'experience', 'projects', 'stack', 'contact']

/** El `scroll-margin-top` que deja la sección bajo la barra fija. */
const ANCHOR_OFFSET = 80
const TOLERANCE = 4

/**
 * Abre una ruta con el desplazamiento suave desactivado.
 *
 * Lo que estas pruebas comprueban es **a dónde llega un clic**, no la física de
 * la animación. Y con `scroll-behavior: smooth` esa animación es lentísima
 * cuando el salto es largo: medido, ir del Hero a Contacto —7261px— tarda
 * 1641ms y los últimos 20px caen a razón de 1 por fotograma. Con la suite en
 * paralelo, esa cola se estira aún más y el sondeo caducaba a mitad de la
 * deceleración: por eso `#contact` salía a 95px unas veces y a 72 otras, dos
 * puntos cualesquiera de la misma frenada.
 *
 * Quitar la animación no debilita nada. El fallo que estas pruebas cubren —el
 * ancla peleando con `<ScrollRestoration />`— es de destino, no de recorrido:
 * ocurría igual con desplazamiento instantáneo.
 */
async function visit(page: Page, path: string) {
  // Va con `addInitScript` y no con `addStyleTag` después del `goto`: al abrir
  // una URL con ancla, el navegador empieza el salto **durante** la carga, así
  // que un estilo añadido después llega tarde y la animación ya está en marcha.
  // Se veía como una medición a mitad de recorrido —72px en vez de 80— solo en
  // la prueba que entra con `#contact` en la URL.
  await page.addInitScript(() => {
    const apply = () => {
      const style = document.createElement('style')
      style.textContent = 'html, body { scroll-behavior: auto !important; }'
      document.head.append(style)
    }
    if (document.head) apply()
    else document.addEventListener('DOMContentLoaded', apply, { once: true })
  })
  await page.goto(path)
}

/**
 * Deja la página en un punto donde la barra existe de verdad.
 *
 * Hacen falta dos cosas que no son obvias:
 *
 * 1. **Hay que bajar del Hero.** Mientras se está arriba, los enlaces están en
 *    el DOM pero con `pointer-events-none opacity-0`: es deliberado —la
 *    navegación aparece a partir de que hay algo entre lo que navegar— así que
 *    pulsarlos a scrollY 0 no lo puede hacer nadie.
 *
 * 2. **Hay que reintentar.** Un solo `scrollTo` justo después de `goto` no se
 *    sostiene: al terminar la hidratación, `<ScrollRestoration />` devuelve la
 *    página a la posición guardada, que en un contexto nuevo es 0. Se veía como
 *    un clic que nunca llegaba a ocurrir, y la captura del fallo mostraba el
 *    Hero entero — la prueba había hecho scroll y algo la había subido.
 *
 * Por eso se comprueba `pointer-events` y no la visibilidad: para Playwright un
 * elemento con `opacity: 0` sigue siendo «visible», así que esa aserción pasaba
 * sin garantizar nada. `pointer-events` se hereda, de modo que leerlo en el
 * enlace refleja lo que tenga el `<nav>` que lo contiene.
 */
async function revealNavbar(page: Page) {
  await expect
    .poll(
      async () => {
        const heroBottom = await page
          .locator('#hero')
          .evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY)
        // `instant` y no el `smooth` de la hoja de estilos: aquí interesa
        // llegar, no la animación, y el desplazamiento suave añade una carrera
        // más a una función que ya está esperando a la hidratación.
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: 'instant' }),
          heroBottom + 40,
        )
        await settle(page)
        return page
          .getByRole('navigation')
          .first()
          .locator('a[href*="#"]')
          .first()
          .evaluate((el) => getComputedStyle(el).pointerEvents)
      },
      { timeout: 15_000, intervals: [200, 300, 500, 1000] },
    )
    .toBe('auto')
}

/**
 * Pulsa un enlace de la barra **sin dejar que Playwright desplace la página**.
 *
 * `locator.click()` llama antes a `scrollIntoViewIfNeeded()`, y con una
 * cabecera `position: sticky` eso es una trampa: al desplazar, la barra sigue
 * al scroll, el navegador vuelve a verla «fuera de sitio» y sigue desplazando.
 * Medido aquí: de scrollY 667 pasaba a 299 y de ahí a 0. Al llegar arriba la
 * barra se oculta —`pointer-events-none` sobre el Hero— y el clic ya no puede
 * ocurrir nunca. La prueba se quedaba 30s reintentando y la captura del fallo
 * mostraba el Hero entero, que fue la pista.
 *
 * Nada de esto le pasa a una persona: nadie desplaza la página antes de pulsar
 * lo que ya está viendo. Así que se pulsa con el ratón en coordenadas reales.
 *
 * No es `{ force: true }` a propósito. `force` se salta **todas** las
 * comprobaciones, incluida la de que no haya nada tapando el enlace, que es
 * justo lo que hay que seguir verificando: aquí hay adornos con posición
 * absoluta en los márgenes. Por eso se comprueba a mano con `elementFromPoint`
 * que quien recibe el clic es el enlace, y solo entonces se pulsa.
 */
async function clickNav(page: Page, id: string) {
  const link = page
    .getByRole('navigation')
    .first()
    .locator(`a[href$="#${id}"]`)
    .first()

  const box = await link.boundingBox()
  expect(box, `no se pudo medir el enlace a #${id}`).not.toBeNull()
  const x = box!.x + box!.width / 2
  const y = box!.y + box!.height / 2

  const hit = await page.evaluate(
    ({ x, y }) =>
      document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href') ??
      document.elementFromPoint(x, y)?.tagName ??
      null,
    { x, y },
  )
  expect(hit, `algo tapa el enlace a #${id}`).toContain(`#${id}`)

  await page.mouse.click(x, y)
}

/**
 * Espera a que el desplazamiento pare de verdad.
 *
 * Sondear la posición es más fiable que un `waitForTimeout`: en una máquina
 * lenta un tiempo corto da un falso fallo y uno largo hace lenta la suite
 * entera. Pero hay una trampa, y la primera versión cayó en ella.
 *
 * Con `scroll-behavior: smooth`, **`scrollY` no se mueve durante los primeros
 * fotogramas**: el navegador tarda en arrancar la animación. Medido aquí: tras
 * pedir el salto, la posición seguía en 0 hasta los 177ms y no pasó de 62 hasta
 * los 281. Contando solo tres fotogramas quietos, «todavía no ha empezado» se
 * confundía con «ya ha terminado» y la medición salía a mitad de camino —
 * `#contact` daba 95px en vez de 80.
 *
 * De ahí las dos condiciones: ocho fotogramas quietos **y** un suelo de 250ms.
 */
async function settle(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        let last = window.scrollY
        let quiet = 0
        const started = performance.now()
        const tick = () => {
          if (window.scrollY === last) quiet += 1
          else {
            quiet = 0
            last = window.scrollY
          }
          if (quiet >= 8 && performance.now() - started > 250) resolve(true)
          else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }),
    null,
    { timeout: 8000 },
  )
}

/**
 * Comprueba que la sección quedó anclada bajo la barra.
 *
 * Va con `expect.poll` en vez de una sola lectura porque el suelo de tiempo de
 * `settle` reduce la carrera pero no la elimina: reintentar es lo que la cierra
 * del todo, y no hace la prueba más permisiva —la tolerancia sigue siendo la
 * misma— solo más paciente.
 *
 * **La última sección tiene una salida, y no es una concesión.** A Contacto no
 * siempre se le puede poner el borde a 80px: es lo último del documento, y si
 * por debajo no queda recorrido, el navegador ya ha hecho todo lo que podía.
 * Medido, y la diferencia es de idioma:
 *
 *     ruta    documento   hace falta   máximo    margen
 *     /            8663         7928     7943      +15
 *     /en/         8243         7538     7523      −15   ← se queda a 95px
 *
 * El inglés ocupa entre un 15% y un 25% menos (CLAUDE.md §4), así que su página
 * es 420px más corta y se queda sin recorrido justo por 15. Exigir 80px ahí
 * sería exigir algo imposible, así que se acepta también «el documento está al
 * tope»: la sección se ve entera igual y nadie percibe la diferencia. Lo que
 * sigue siendo un fallo —y lo que esta prueba existe para pillar— es aterrizar
 * en cualquier otro sitio.
 */
async function expectAnchored(page: Page, id: string) {
  let state = { top: NaN, atBottom: false }
  try {
    await expect
      .poll(
        async () => {
          state = await page.locator(`#${id}`).evaluate((el) => ({
            top: el.getBoundingClientRect().top,
            atBottom:
              Math.ceil(window.scrollY + window.innerHeight) >=
              document.documentElement.scrollHeight - 1,
          }))
          if (Math.abs(state.top - ANCHOR_OFFSET) <= TOLERANCE) return true
          // Al tope del documento, basta con que la sección esté arrimada
          // arriba: nunca más abajo de donde la dejaría el ancla.
          return state.atBottom && state.top <= ANCHOR_OFFSET + 24
        },
        { timeout: 6000, intervals: [100, 200, 400, 800] },
      )
      .toBe(true)
  } catch {
    throw new Error(
      `#${id} quedó a ${Math.round(state.top)}px del borde (esperado ${ANCHOR_OFFSET} ±${TOLERANCE})` +
        `, y el documento ${state.atBottom ? 'sí' : 'no'} estaba al tope`,
    )
  }
}

for (const path of ['/', '/en/']) {
  test.describe(`navbar ${path}`, () => {
    test('cada enlace llega a su sección al primer clic', async ({ page }) => {
      await visit(page, path)

      for (const id of SECTIONS) {
        // Se vuelve al mismo punto de partida antes de cada enlace —justo
        // debajo del Hero, no al inicio— para que los cinco se midan en las
        // mismas condiciones y con la barra visible.
        await revealNavbar(page)

        await clickNav(page, id)
        await settle(page)
        await expectAnchored(page, id)
      }
    })

    test('el primer clic no manda al fondo de la página', async ({ page }) => {
      // La forma exacta que tenía el fallo: no era «se queda quieto», era «se
      // va al final». Merece su propia aserción porque describe el síntoma.
      await visit(page, path)
      await revealNavbar(page)
      const max = await page.evaluate(
        () => document.body.scrollHeight - window.innerHeight,
      )

      await clickNav(page, 'about')
      await settle(page)

      const y = await page.evaluate(() => window.scrollY)
      expect(y, 'el clic acabó en el fondo del documento').toBeLessThan(
        max * 0.5,
      )
    })

    test('una recarga con hash en la URL cae en la sección', async ({
      page,
    }) => {
      // Es el otro camino a la misma sección: alguien comparte el enlace.
      await visit(page, `${path}#contact`)
      await settle(page)
      await expectAnchored(page, 'contact')
    })
  })
}

/**
 * La barra en móvil, donde vive el fallo que originó todo esto.
 *
 * En móvil la barra es transparente sobre el Hero, y ahí se pintaban **cuatro**
 * controles sueltos: `ES`, `EN`, el tema y el menú. Al desplazarse un poco, el
 * titular pasaba justo por debajo y quedaba «Desarrollando ap·ES·icaciones ☰
 * web y móviles». Con un solo botón el problema desaparece, y estas pruebas
 * son las que impiden que los controles vuelvan a la barra sin querer.
 */
test.describe('barra en móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  const burger = (page: Page) =>
    page.locator('header button[aria-controls="menu-movil"]')

  /** Pulsa con el ratón en coordenadas: ver la nota de `clickNav`. */
  async function tap(page: Page, locator: ReturnType<Page['locator']>) {
    const box = await locator.boundingBox()
    expect(box, 'el elemento no tiene caja').not.toBeNull()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
  }

  test('en el Hero solo se ve el botón de menú', async ({ page }) => {
    await visit(page, '/')

    // El botón, sí: es lo único desde lo que se puede hacer algo en móvil, así
    // que se queda visible incluso con la barra transparente.
    await expect(burger(page)).toBeVisible()
    expect(
      await burger(page).evaluate((el) => getComputedStyle(el).pointerEvents),
    ).toBe('auto')

    // Y nada más. Se cuenta lo que hay **fuera** del panel, que es donde
    // estaban antes los cuatro controles.
    const fuera = await page.evaluate(() => {
      const bar = document.querySelector('header > div')
      if (!bar) return null
      return [...bar.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect()
        return (
          r.width > 0 && r.height > 0 && getComputedStyle(el).opacity !== '0'
        )
      }).length
    })
    expect(fuera, 'hay más de un control visible en la barra').toBe(1)
  })

  test('el idioma y el tema viven dentro del menú', async ({ page }) => {
    await visit(page, '/')
    const panel = page.locator('#menu-movil')

    // Cerrado: `inert` lo saca del foco y del árbol de accesibilidad.
    await expect(panel).toHaveAttribute('inert', '')
    expect(
      await panel.evaluate(
        (el) =>
          el.querySelector('.nav-panel__clip')!.getBoundingClientRect().height,
      ),
    ).toBe(0)

    await tap(page, burger(page))
    await expect(panel).not.toHaveAttribute('inert', '')

    // Los cinco enlaces más los dos controles, todos dentro.
    await expect(panel.locator('a[href*="#"]')).toHaveCount(5)
    await expect(panel.locator('a[hreflang]')).toHaveCount(2)
    await expect(
      panel.getByRole('button', { name: /tema|theme/i }),
    ).toHaveCount(1)
  })

  test('el tema se puede cambiar desde el menú, sin salir del Hero', async ({
    page,
  }) => {
    // Es la razón por la que el botón sigue visible arriba: si no, en móvil no
    // habría forma de llegar a estos dos controles sin bajar antes.
    await visit(page, '/')
    const antes = await page
      .locator('html')
      .evaluate((el) => el.classList.contains('dark'))

    await tap(page, burger(page))

    // Hay que esperar a que el panel termine de crecer: mientras se abre, la
    // caja del botón todavía se está moviendo y el clic cae donde estaba, no
    // donde está. Es el mismo tipo de carrera que el desplazamiento suave.
    const clip = page.locator('#menu-movil .nav-panel__clip')
    await expect
      .poll(() => clip.evaluate((el) => el.getBoundingClientRect().height), {
        timeout: 3000,
      })
      .toBeGreaterThan(200)
    await page.waitForTimeout(120)

    await tap(
      page,
      page.locator('#menu-movil').getByRole('button', { name: /tema|theme/i }),
    )

    await expect
      .poll(() =>
        page.locator('html').evaluate((el) => el.classList.contains('dark')),
      )
      .toBe(!antes)
  })

  test('el menú se abre con recorrido, no de golpe', async ({ page }) => {
    await visit(page, '/')
    const clip = page.locator('#menu-movil .nav-panel__clip')

    await tap(page, burger(page))

    // A mitad de la transición el alto tiene que estar **entre** los dos
    // extremos. Si fuera un cambio seco, la muestra intermedia ya valdría el
    // final y esta comprobación no distinguiría una cosa de la otra.
    await page.waitForTimeout(140)
    const medio = await clip.evaluate((el) => el.getBoundingClientRect().height)

    await page.waitForTimeout(600)
    const final = await clip.evaluate((el) => el.getBoundingClientRect().height)

    expect(final, 'el panel no llegó a abrirse').toBeGreaterThan(200)
    expect(medio, `a mitad medía ${medio} y al final ${final}`).toBeGreaterThan(
      0,
    )
    expect(medio).toBeLessThan(final)
  })

  test('el icono se pliega en aspa al abrir', async ({ page }) => {
    await visit(page, '/')
    const lines = () =>
      page
        .locator('.nav-burger__line')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform))

    expect(await lines()).toEqual(['none', 'none'])

    await tap(page, burger(page))
    await page.waitForTimeout(500)

    // 45° son cos/sin = 0.7071 en la matriz, y el desplazamiento vertical es
    // medio hueco más medio grosor: (6 + 1.5) / 2 = 3.75px.
    const abierto = await lines()
    expect(abierto[0]).toContain('0.707107')
    expect(abierto[0]).toContain('3.75')
    expect(abierto[1]).toContain('-3.75')
  })

  test('el menú se cierra al elegir una sección', async ({ page }) => {
    await visit(page, '/')
    await tap(page, burger(page))
    await page.waitForTimeout(600)

    await tap(page, page.locator('#menu-movil a[href$="#experience"]'))
    await expect(page.locator('#menu-movil')).toHaveAttribute('inert', '')
    await expect(burger(page)).toHaveAttribute('aria-expanded', 'false')
  })
})

/**
 * El nombre de la barra se escribe a máquina cuando la barra aparece.
 *
 * Lo que de verdad se protege aquí es el **ancho reservado**. Sin él, el nodo
 * crece letra a letra dentro de un contenedor flex y empuja a los enlaces en
 * cada pulsación: no es un detalle estético, es toda la fila temblando durante
 * medio segundo cada vez que se pasa del Hero.
 */
test.describe('el nombre se teclea en la barra', () => {
  test('se escribe entero y sin mover los enlaces de al lado', async ({
    page,
  }) => {
    await visit(page, '/')

    const navLeft = () =>
      page
        .locator('header nav[aria-label]')
        .first()
        .evaluate((el) => Math.round(el.getBoundingClientRect().left))

    const partida = await navLeft()
    await revealNavbar(page)

    const posiciones: number[] = []
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(110)
      posiciones.push(await navLeft())
    }

    expect(
      new Set([partida, ...posiciones]).size,
      `los enlaces se movieron: ${[...new Set(posiciones)].join(', ')}`,
    ).toBe(1)

    await expect
      .poll(
        () =>
          page
            .locator('header .text-type__live')
            .evaluate((el) => el.textContent?.replace('_', '') ?? ''),
        { timeout: 5000 },
      )
      .toBe('Johnny Bohorquez')
  })

  test('el nombre completo llega a un lector de pantalla', async ({ page }) => {
    // Lo visual va `aria-hidden` porque un nodo que cambia cada 38ms se
    // anunciaría sin parar. El texto real vive en un nodo aparte.
    await visit(page, '/')
    await expect(page.locator('header .text-type__sr')).toHaveText(
      'Johnny Bohorquez',
    )
  })
})

test.describe('idioma', () => {
  test('cambiar de idioma conserva la ruta y cambia el lang', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')

    await page.getByRole('link', { name: 'EN', exact: true }).first().click()
    await expect(page).toHaveURL(/\/en\/?$/)
    // `toHaveAttribute` y no un `getAttribute` suelto: la URL cambia antes de
    // que React vuelva a pintar el `<html>`, y en Firefox esa ventana es lo
    // bastante ancha como para leer todavía `es`. La versión con `expect`
    // reintenta; la lectura directa no.
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('link', { name: 'ES', exact: true }).first().click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('el contenido cambia de verdad, no solo el atributo', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('#about')).toContainText('Construyo interfaces')

    await page.getByRole('link', { name: 'EN', exact: true }).first().click()
    await expect(page.locator('#about')).toContainText('I build')
  })

  test('/en redirige a /en/, como en GitHub Pages', async ({ request }) => {
    const res = await request.get('/en', { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(res.headers()['location']).toBe('/en/')
  })
})

test('el enlace de saltar al contenido funciona con teclado', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skip = page.locator('a[href="#main"], a[href^="#"]').first()
  await expect(skip).toBeFocused()

  // Y se ve al enfocarlo: un «saltar al contenido» invisible no sirve de nada.
  const visible = await skip.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.top > -r.height
  })
  expect(visible, 'el enlace de salto no se ve al enfocarlo').toBe(true)
})
