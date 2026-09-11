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
 *
 * **El cambio va con transición de vista**, y es un barrido lateral, no el
 * círculo del tema: son dos acciones distintas y compartir gesto las
 * confundiría. El círculo dice «la página cambia de piel»; el barrido, «te has
 * movido de lado, a la otra versión de lo mismo».
 *
 * La dirección se escribe en `--vt-dir` antes de navegar, porque quien dibuja
 * es el CSS. Ir a inglés entra por la derecha y volver por la izquierda: así
 * ida y vuelta no se sienten iguales, que es lo que convierte el gesto en una
 * pista de dónde estás.
 *
 * Lo dispara el prop `viewTransition` del `Link` de React Router. Donde la API
 * no existe, la navegación ocurre igual y sin animación.
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
            viewTransition
            onClick={() => {
              // Índice del idioma destino: `es` es 0 y `en` es 1, así que ir a
              // inglés avanza y volver retrocede.
              const forward = LOCALES.indexOf(code) > LOCALES.indexOf(locale)
              document.documentElement.style.setProperty(
                '--vt-dir',
                forward ? '1' : '0',
              )
            }}
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
