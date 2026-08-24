import { Link } from 'react-router'

import { useLocale } from '@/hooks/useLocale'
import { LOCALES } from '@/lib/constants'
import { cn } from '@/lib/cn'

/**
 * Conserva la ruta actual al cambiar de idioma: desde una ficha de proyecto se
 * va a la misma ficha, no al inicio (CLAUDE.md §3).
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const { locale, ui, swapTo } = useLocale()

  return (
    <nav
      aria-label={ui.locale.label}
      className={cn('flex items-center border border-line', className)}
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
              isActive
                ? 'bg-ink text-paper'
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
