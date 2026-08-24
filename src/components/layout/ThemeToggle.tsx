import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

type ThemeToggleProps = {
  labels: { toLight: string; toDark: string }
  className?: string
}

/**
 * Los dos iconos se pintan siempre y es CSS quien decide cuál se ve. Si el
 * icono dependiera del estado de React habría un salto visible entre el HTML
 * estático y la hidratación, justo lo que el script anti-flash evita.
 */
export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      className={cn(
        'grid size-9 place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink',
        className,
      )}
    >
      <Sun aria-hidden="true" className="size-4 dark:hidden" />
      <Moon aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  )
}
