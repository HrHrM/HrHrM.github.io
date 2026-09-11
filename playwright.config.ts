import { defineConfig, devices } from '@playwright/test'

/**
 * Las pruebas corren contra el **build**, servido por `tests/server.mjs`, y no
 * contra `react-router dev`.
 *
 * Es deliberado. El dev server inyecta el CSS por JS, no aplica el prerender y
 * no redirige `/en` a `/en/`: probar ahí sería comprobar un sitio que nadie
 * visita. El CLAUDE.md ya documenta un caso de esto —el parpadeo de HTML sin
 * estilo que solo ocurre en `dev`— y no tiene sentido añadir otro.
 *
 *     npm test              # construye y prueba
 *     npm run test:fast     # reutiliza el build de antes
 *     npm run test:ui       # el visor interactivo
 */
const PORT = 4173
const BASE = `http://127.0.0.1:${PORT}`

// Reconstruir en cada ejecución es lo correcto por defecto —así nunca se prueba
// contra un build viejo— pero cuesta unos segundos, y al iterar sobre una sola
// prueba eso molesta.
//
// El interruptor se lee de `npm_lifecycle_event`, que es el nombre del script
// que npm está ejecutando, en vez de un `SKIP_BUILD=1` por delante del comando:
// esa sintaxis no existe en el `cmd` de Windows, que es donde se desarrolla
// esto, y la alternativa habitual es añadir `cross-env` como dependencia para
// exportar una variable. `SKIP_BUILD` se sigue respetando para quien la ponga
// desde su propio intérprete.
const skipBuild =
  process.env.SKIP_BUILD === '1' ||
  process.env.npm_lifecycle_event === 'test:fast'

const command = skipBuild
  ? 'node tests/server.mjs'
  : 'npm run build && node tests/server.mjs'

export default defineConfig({
  testDir: './tests',
  // Ninguna prueba escribe estado compartido, así que pueden ir en paralelo.
  fullyParallel: true,
  // En CI, un `.only` olvidado convierte la suite entera en una sola prueba y
  // el resto deja de comprobarse sin que nadie lo note.
  forbidOnly: !!process.env.CI,
  // Cero reintentos también en CI, y a propósito: este sitio es estático y no
  // tiene red ni animaciones que dependan del reloj. Una prueba que solo pasa
  // al segundo intento aquí es una prueba mal escrita, y reintentar lo taparía.
  retries: 0,
  // En CI se añade el informe HTML porque el workflow lo sube como artefacto
  // cuando algo falla: leer una traza es mucho más rápido que reproducir el
  // fallo a ciegas desde el log.
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list']],

  /**
   * Cuatro, no los ocho que Playwright deduce de los 16 núcleos de esta
   * máquina. Con ocho, Firefox empezaba a caerse solo: contextos que no cerran
   * («can't access property `_maybeDontRestoreTabs`») y pruebas de maquetado
   * agotando el tiempo a los 53s. Las mismas 49 pruebas pasan enteras con
   * concurrencia baja, así que era contención, no el sitio — pero un fallo
   * intermitente que no es del código es peor que uno lento: enseña a ignorar
   * la suite.
   */
  workers: 4,

  use: {
    baseURL: BASE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Un motor distinto, porque los dos fallos de maquetación que más han
    // costado en este proyecto eran de CSS, no de JS. Firefox además ignora
    // `::view-transition`, así que confirma que las transiciones degradan sin
    // romper la navegación.
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],

  webServer: {
    command,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    // El build de Vite más el prerender de las dos rutas tarda bastante más
    // que el minuto por defecto en un portátil frío.
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
