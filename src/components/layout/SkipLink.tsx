import { useLocale } from '@/hooks/useLocale'

/**
 * Primer elemento tabulable de la página. Invisible hasta que recibe foco:
 * quien navega con teclado no debería tener que pasar por toda la Navbar en
 * cada carga.
 */
export function SkipLink() {
  const { ui } = useLocale()

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-meta focus:text-ink focus:uppercase"
    >
      {ui.nav.skipToContent}
    </a>
  )
}
