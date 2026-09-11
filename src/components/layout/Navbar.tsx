import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router'

import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { useLocale } from '@/hooks/useLocale'
import { useScrolledPast } from '@/hooks/useScrolledPast'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/lib/nav'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/cn'

/**
 * Mientras se está en el Hero solo se ven los dos controles —idioma y tema— y
 * el resto de la barra no existe: ni fondo, ni hairline, ni enlaces. La
 * navegación aparece a partir de Experiencia, que es donde hay algo entre lo
 * que navegar.
 *
 * Lo que se oculta se atenúa, no se desmonta. Con `opacity-0` la maqueta no se
 * mueve al cambiar de estado, y `focus-within` lo devuelve entero en cuanto
 * entra el foco: quien navega con teclado alcanza los enlaces desde arriba sin
 * tener que hacer scroll primero.
 */
export function Navbar() {
  const { ui, home } = useLocale()
  const [open, setOpen] = useState(false)
  const active = useScrollSpy([...SECTION_IDS])

  // Los enlaces de sección son `Link` del router y **no** `<a href="#id">`, y
  // no es cosmético. Con un ancla plana el navegador cambia el hash por su
  // cuenta; el router lo ve como una navegación y `<ScrollRestoration />`
  // restaura la posición que tenía guardada para esa clave, cancelando el
  // salto al ancla. Se veía como «hay que pulsar dos veces»: en realidad el
  // primer clic saltaba y la restauración lo devolvía.
  //
  // Con `Link` la navegación la conduce el router, que al haber hash busca el
  // elemento y va a él en vez de restaurar. Es lo que ya hacía bien el CTA del
  // hero, que siempre fue un `Link`.
  const past = useScrolledPast('hero')

  // `pointer-events-none` va con `opacity-0`: un enlace invisible que sigue
  // siendo clicable es una trampa para el ratón.
  const hidden =
    'pointer-events-none opacity-0 focus-within:pointer-events-auto focus-within:opacity-100'

  // Bloquea el scroll del fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Cerrar con Escape: el menú es un overlay y tiene que soltarse sin ratón.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const items = SECTION_IDS.map((id) => ({ id, label: ui.nav[id] }))

  return (
    <header
      className={cn(
        // El borde se mantiene declarado y solo cambia de color: quitarlo
        // movería la barra un píxel cada vez que aparece.
        'sticky top-0 z-50 border-b transition-colors duration-200',
        past
          ? 'border-line bg-paper/85 backdrop-blur-sm'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          to={home}
          className={cn(
            'font-display text-lg text-ink transition-opacity duration-200',
            !past && hidden,
          )}
        >
          {SITE.name}
        </Link>

        <nav
          aria-label={ui.nav.primary}
          className={cn(
            'hidden transition-opacity duration-200 md:block',
            !past && hidden,
          )}
        >
          <ul className="flex items-center gap-7">
            {items.map(({ id, label }) => (
              <li key={id}>
                <Link
                  to={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(
                    'font-mono text-meta tracking-wide uppercase transition-colors',
                    active === id ? 'text-accent' : 'text-muted hover:text-ink',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch variant={past ? 'bar' : 'bare'} />
          <ThemeToggle labels={ui.theme} variant={past ? 'bar' : 'bare'} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={ui.nav.menu}
            className={cn(
              'grid size-9 place-items-center border text-muted transition-opacity duration-200 md:hidden',
              past ? 'border-line' : 'border-transparent',
              // El menú abre los mismos enlaces que se ocultan arriba, así que
              // sobre el Hero no tiene nada que abrir.
              !past && hidden,
            )}
          >
            {open ? (
              <X aria-hidden="true" className="size-4" />
            ) : (
              <Menu aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-movil"
          aria-label={ui.nav.menu}
          className="border-t border-line bg-paper md:hidden"
        >
          <ul className="flex flex-col px-gutter py-2">
            {items.map(({ id, label }) => (
              <li key={id} className="border-b border-line last:border-0">
                <Link
                  to={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-mono text-meta tracking-wide text-muted uppercase"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
