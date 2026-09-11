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
      onClick={(event) => {
        // El centro del propio botón, no el punto del clic: con teclado no hay
        // coordenadas y `event.clientX` valdría 0, así que el círculo saldría
        // de la esquina. Y todo con `getBoundingClientRect`, que da
        // coordenadas de viewport; `offsetLeft` es relativo al ancestro
        // posicionado y aquí la Navbar es uno.
        const box = event.currentTarget.getBoundingClientRect()
        toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
      }}
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
