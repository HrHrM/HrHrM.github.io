import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'

// Solo los subsets latinos y solo el eje de peso en estilo normal:
// `index.css` arrastraría además todas las cursivas variables.
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-ext-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './styles/index.css'

/**
 * El HTML es estático (ssr: false + prerender), así que el tema tiene que
 * resolverse antes del primer paint o quien use modo oscuro ve un fogonazo
 * blanco en cada carga. Este script es bloqueante y va antes de <Links />.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const isResponse = isRouteErrorResponse(error)
  const title = isResponse ? `${error.status}` : 'Algo se rompió'
  const detail = isResponse
    ? error.statusText || 'La página no existe.'
    : 'Un error inesperado. Vuelve a intentarlo.'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-gutter text-center">
      <p className="font-mono text-meta tracking-widest text-muted uppercase">
        Error
      </p>
      <h1 className="font-display text-section text-ink">{title}</h1>
      <p className="max-w-prose">{detail}</p>
      <a href="/" className="font-mono text-meta text-accent underline">
        Volver al inicio
      </a>
    </main>
  )
}
