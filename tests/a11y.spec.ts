import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accesibilidad automática.
 *
 * Axe no sustituye a revisar a mano —cubre en torno a un tercio de lo que
 * falla de verdad— pero encuentra sin discusión lo que aquí tiene más
 * superficie: contraste, nombres accesibles, orden de encabezados y `aria`
 * mal puesto. Y hay bastante `aria-hidden` repartido por los efectos.
 *
 * Se pasa en los dos temas porque el contraste cambia con la paleta, y el
 * cálculo de los doce pares de texto se hizo a mano: esto lo verifica sobre
 * el render real, que es donde aparecen los que nadie calculó.
 */

const ROUTES = ['/', '/en/']

for (const path of ROUTES) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`axe sin infracciones en ${path} · tema ${scheme}`, async ({
      page,
    }) => {
      /**
       * Triplica el tiempo permitido (30s → 90s), y no es tapar una carrera.
       *
       * Axe recorre el DOM entero calculando contraste elemento por elemento,
       * y en Firefox eso son entre 10 y 20 segundos por ruta. Con cuatro
       * workers compitiendo por la misma máquina se pasaba de los 30 por
       * defecto: fallaba con `Test timeout exceeded`, sin una sola infracción,
       * mientras que la misma prueba a solas terminaba en 12s.
       *
       * Un fallo por reloj en una prueba que en realidad pasa es peor que una
       * prueba lenta: enseña a ignorar el rojo.
       */
      test.slow()

      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(path)
      // Que monten los efectos que dependen de estar en pantalla.
      await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight / 2),
      )
      await page.waitForTimeout(400)
      await page.evaluate(() => window.scrollTo(0, 0))

      /**
       * **Hay que esperar a que la barra termine de desvanecerse.**
       *
       * Al volver arriba, la barra tarda en irse: el `IntersectionObserver`
       * que decide si se ha pasado del Hero no ha disparado todavía, y encima
       * hay 200ms de transición. Medido en Firefox: a los 200ms del `scrollTo`
       * la barra seguía a `opacity: 1`, y no llegaba a 0 hasta pasados los 500.
       *
       * Analizar ahí dentro es medir un fotograma cualquiera de un fundido, y
       * axe marcaba contraste insuficiente en el nombre y en dos enlaces — con
       * razón, porque a media opacidad el contraste es malo de verdad. No es un
       * defecto del sitio: es texto que se está yendo. Solo falló en CI, que va
       * más lento, y por eso pasó desapercibido en local.
       *
       * Se espera a que la opacidad se estabilice y no a un tiempo fijo, que es
       * la misma disciplina que `settle` en `navigation.spec.ts`.
       */
      const barra = page.locator('header nav[aria-label]').first()
      await expect
        .poll(
          async () => {
            const antes = await barra.evaluate(
              (el) => getComputedStyle(el).opacity,
            )
            await page.waitForTimeout(100)
            const despues = await barra.evaluate(
              (el) => getComputedStyle(el).opacity,
            )
            return antes === despues ? despues : null
          },
          { timeout: 5000 },
        )
        .toBe('0')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}) — ${v.help}\n    ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(' '))
            .join('\n    ')}`,
      )

      expect(results.violations, summary.join('\n')).toEqual([])
    })
  }
}

test('el foco de teclado es visible en los controles principales', async ({
  page,
}) => {
  await page.goto('/')

  // Suelo de calidad no negociable del CLAUDE.md §4. Se comprueba que el
  // navegador dibuja **algo**: contorno, sombra o borde. Sin esto, navegar sin
  // ratón es adivinar dónde estás.
  const seen: string[] = []
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    const state = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName.toLowerCase(),
        label: (el.textContent ?? '').trim().slice(0, 24),
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        shadow: cs.boxShadow !== 'none',
      }
    })
    if (!state) continue
    if (!state.outline && !state.shadow) {
      seen.push(`${state.tag} «${state.label}» sin indicador de foco`)
    }
  }

  expect(seen, seen.join('\n')).toEqual([])
})

test('hay un solo h1 por página y los encabezados no saltan niveles', async ({
  page,
}) => {
  for (const path of ROUTES) {
    await page.goto(path)

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter((el) => !el.closest('[aria-hidden="true"]'))
        .map((el) => Number(el.tagName[1])),
    )

    expect(levels.filter((l) => l === 1).length, `${path}: h1`).toBe(1)

    for (let i = 1; i < levels.length; i++) {
      expect(
        levels[i] - levels[i - 1],
        `${path}: salto de h${levels[i - 1]} a h${levels[i]}`,
      ).toBeLessThanOrEqual(1)
    }
  }
})
