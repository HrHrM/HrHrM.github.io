import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

type ThemeToggleProps = {
  labels: { toLight: string; toDark: string }
  /** `bar` dentro de la Navbar · `bare` suelto sobre el Hero, sin caja. */
  variant?: 'bar' | 'bare'
  className?: string
}

/**
 * Los dos iconos se pintan siempre y es CSS quien decide cuál se ve. Si el
 * icono dependiera del estado de React habría un salto visible entre el HTML
 * estático y la hidratación, justo lo que el script anti-flash evita.
 */
export function ThemeToggle({
  labels,
  variant = 'bar',
  className,
}: ThemeToggleProps) {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      className={cn(
        'grid size-9 place-items-center border text-muted transition-colors hover:text-ink',
        // El borde transparente se queda puesto en `bare`: sin él el control
        // encoge 2px y los dos estados no cuadran al cambiar.
        variant === 'bar'
          ? 'border-line hover:border-ink'
          : 'border-transparent',
        className,
      )}
    >
      <Sun aria-hidden="true" className="size-4 dark:hidden" />
      <Moon aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  )
}
