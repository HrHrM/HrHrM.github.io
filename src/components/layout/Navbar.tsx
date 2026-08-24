import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router'

import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { useLocale } from '@/hooks/useLocale'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/lib/nav'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/cn'

export function Navbar() {
  const { ui, home } = useLocale()
  const [open, setOpen] = useState(false)
  const active = useScrollSpy([...SECTION_IDS])

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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          to={home}
          className="font-display text-lg text-ink"
        >
          {SITE.name}
        </Link>

        <nav aria-label={ui.nav.primary} className="hidden md:block">
          <ul className="flex items-center gap-7">
            {items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(
                    'font-mono text-meta tracking-wide uppercase transition-colors',
                    active === id ? 'text-accent' : 'text-muted hover:text-ink',
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle labels={ui.theme} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={ui.nav.menu}
            className="grid size-9 place-items-center border border-line text-muted md:hidden"
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
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-mono text-meta tracking-wide text-muted uppercase"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
