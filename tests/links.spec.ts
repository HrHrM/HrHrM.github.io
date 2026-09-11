import { test, expect, type APIRequestContext } from '@playwright/test'

/**
 * Los enlaces de salida. **Van etiquetados `@external` y fuera de la suite por
 * defecto**, porque dependen de una red y de servidores ajenos: un fallo aquí
 * no siempre significa que el sitio esté mal.
 *
 *     npm run test:links
 *
 * Se ejecuta a mano de vez en cuando, y en particular antes de enseñarle el
 * portafolio a alguien. Meterlo en CI haría que el despliegue dependiera de
 * que LinkedIn esté de humor.
 */

/**
 * Un 999 de LinkedIn o un 403 de Play Store no son enlaces rotos: son bloqueos
 * a clientes sin navegador. Lo que sí sería un fallo es que el dominio no
 * resuelva o que devuelva 404. Por eso se aceptan como «llegó», y se distingue
 * de «responde bien».
 */
const BOT_BLOCKED = new Set([401, 403, 405, 429, 999])

async function reach(request: APIRequestContext, url: string) {
  try {
    const res = await request.get(url, {
      maxRedirects: 5,
      timeout: 20_000,
      headers: {
        // Sin esto, bastantes sitios responden 403 a cualquier cliente.
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
      },
    })
    return { status: res.status(), error: null as string | null }
  } catch (err) {
    return { status: 0, error: (err as Error).message }
  }
}

test.describe('@external', () => {
  test('todos los enlaces de salida resuelven', async ({ page, request }) => {
    const urls = new Set<string>()

    for (const path of ['/', '/en/']) {
      await page.goto(path)
      for (const href of await page
        .locator('a[href^="http"]')
        .evaluateAll((els) =>
          els.map((el) => (el as HTMLAnchorElement).href),
        )) {
        urls.add(href)
      }
    }

    expect(urls.size, 'no se encontró ningún enlace externo').toBeGreaterThan(0)

    const broken: string[] = []
    const blocked: string[] = []

    for (const url of urls) {
      const { status, error } = await reach(request, url)
      if (error) broken.push(`${url} → sin respuesta (${error})`)
      else if (BOT_BLOCKED.has(status)) blocked.push(`${url} → ${status}`)
      else if (status >= 400) broken.push(`${url} → ${status}`)
    }

    // Los bloqueos se informan pero no tumban la prueba.
    if (blocked.length) {
      console.log(
        `\nBloqueos a robots (no son fallos):\n  ${blocked.join('\n  ')}`,
      )
    }

    expect(broken, broken.join('\n')).toEqual([])
  })

  test('el enlace de Play Store se abre desde fuera de Venezuela', async ({
    page,
    request,
  }) => {
    // Es el único producto que el portafolio anuncia como publicado, así que es
    // la única prueba comprobable que tiene un lector. Está en la tienda de
    // Venezuela y desde fuera puede responder «no disponible en tu región»:
    // un reclutador de fuera pulsaría lo único verificable y encontraría un
    // error. Esta prueba existe para que eso no se descubra por sorpresa.
    await page.goto('/')
    const href = await page
      .locator('a[href*="play.google.com"]')
      .first()
      .getAttribute('href')

    if (!href) test.skip(true, 'ya no hay enlace a Play Store')

    const { status, error } = await reach(request, href!)
    expect(error, `Play Store no respondió: ${error}`).toBeNull()

    const body = await (await request.get(href!)).text()
    const unavailable =
      /not available in your country|no está disponible|We're sorry, the requested URL was not found/i.test(
        body,
      )

    expect(
      unavailable,
      `Play Store devolvió ${status} pero la ficha no se ve desde aquí. ` +
        'Opciones: dejarlo con una nota en la tarjeta, o quitar el enlace.',
    ).toBe(false)
  })
})
