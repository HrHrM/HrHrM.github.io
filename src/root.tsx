import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
} from 'react-router'

/**
 * El fichero crítico, importado como URL para poder precargarlo.
 * Sin `preload` la cadena es HTML → CSS → fuente, y la fuente de reserva se ve
 * durante todo ese trayecto. Con `preload` la descarga arranca en paralelo al
 * CSS, que es lo que quita el salto de tipografía en el titular.
 *
 * Ahora es uno solo: display y texto son la misma familia variable, así que el
 * titular y el cuerpo se pintan con el mismo fichero.
 */
import schibstedLatin from '@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2?url'

// Solo los subsets latinos y solo el eje de peso en estilo normal:
// `index.css` arrastraría además todas las cursivas variables.
import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './styles/index.css'

import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { SkipLink } from './components/layout/SkipLink'
import { ThemeProvider } from './hooks/useTheme'
import { content } from './content'
import { homePath, localeFromPath } from './lib/paths'

/**
 * El HTML es estático (ssr: false + prerender), así que el tema tiene que
 * resolverse antes del primer paint o quien use modo oscuro ve un fogonazo
 * blanco en cada carga. Este script es bloqueante y va antes de <Links />.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`

/**
 * `crossOrigin` es obligatorio en un preload de fuente incluso en el mismo
 * origen: sin él el navegador descarga el fichero dos veces, porque las fuentes
 * se piden siempre en modo CORS y el preload sin CORS no le sirve.
 */
export const links = () => [
  {
    rel: 'preload',
    href: schibstedLatin,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous' as const,
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <html lang={localeFromPath(pathname)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <SkipLink />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}

/**
 * Se pinta cuando la ruta revienta antes de llegar a una página, así que no
 * puede usar `useLocale()`: ese hook resuelve el bundle desde el contenido de
 * una página que aquí no existe. El idioma sale del pathname, igual que en
 * `Layout`, y el texto de `content[locale]` — nada incrustado aquí.
 *
 * `error.statusText` se descarta a propósito: lo escribe el router siempre en
 * inglés ("Not Found"), y mezclarlo dejaba la versión española a medias.
 */
export function ErrorBoundary({ error }: { error: unknown }) {
  const { pathname } = useLocation()
  const strings = content[localeFromPath(pathname)].ui.error

  const isResponse = isRouteErrorResponse(error)
  const title = isResponse ? String(error.status) : 'Error'
  const detail = isResponse ? strings.notFound : strings.unexpected

  return (
    <main id="main" className="py-section">
      <div className="mx-auto w-full max-w-6xl px-gutter">
        <p className="font-mono text-meta tracking-widest text-muted uppercase">
          {title}
        </p>
        <h1 className="mt-4 font-display text-section">{detail}</h1>
        <a
          href={homePath(localeFromPath(pathname))}
          className="mt-8 inline-block font-mono text-meta tracking-wide text-accent uppercase underline underline-offset-4"
        >
          {strings.backHome}
        </a>
      </div>
    </main>
  )
}
