import { Link } from 'react-router'

import { useLocale } from '@/hooks/useLocale'
import { LOCALES } from '@/lib/constants'
import { cn } from '@/lib/cn'

type LocaleSwitchProps = {
  /** `bar` dentro de la Navbar · `bare` suelto sobre el Hero, sin caja. */
  variant?: 'bar' | 'bare'
  className?: string
}

/**
 * Conserva la ruta actual al cambiar de idioma: desde una ficha de proyecto se
 * va a la misma ficha, no al inicio (CLAUDE.md §3).
 */
export function LocaleSwitch({
  variant = 'bar',
  className,
}: LocaleSwitchProps) {
  const { locale, ui, swapTo } = useLocale()

  return (
    <nav
      aria-label={ui.locale.label}
      className={cn(
        'flex items-center border',
        variant === 'bar' ? 'border-line' : 'border-transparent',
        className,
      )}
    >
      {LOCALES.map((code) => {
        const isActive = code === locale
        return (
          <Link
            key={code}
            to={swapTo(code)}
            hrefLang={code}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'px-2.5 py-1.5 font-mono text-meta tracking-wide uppercase transition-colors',
              // Sobre el Hero el bloque sólido pesaba demasiado para ser el
              // único elemento de la esquina: ahí el idioma activo se marca
              // solo con el color del texto.
              isActive
                ? variant === 'bar'
                  ? 'bg-ink text-paper'
                  : 'text-ink'
                : 'text-muted hover:text-ink',
            )}
          >
            {ui.locale[code]}
          </Link>
        )
      })}
    </nav>
  )
}
