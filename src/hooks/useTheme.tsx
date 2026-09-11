import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  /**
   * `origin` son las coordenadas del clic en el viewport. Sirven para que el
   * círculo de la transición crezca desde el propio botón; sin ellas sale del
   * centro de la pantalla.
   */
  toggle: (origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * El único Context de la aplicación (CLAUDE.md §3).
 *
 * Quien decide el tema en la primera pintada es el script inline de `root.tsx`,
 * no este provider: el HTML es estático y esperar a React significaría un
 * fogonazo. Aquí solo se lee lo que ese script ya dejó puesto y se gestionan
 * los cambios posteriores.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    )
  }, [])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'

      const apply = () => {
        // `flushSync` no es opcional aquí: `startViewTransition` fotografía el
        // DOM en cuanto vuelve este callback, y React agrupa las
        // actualizaciones. Sin forzar el commit, la foto «después» sale con el
        // tema viejo y no se ve transición ninguna.
        flushSync(() => setTheme(next))
        document.documentElement.classList.toggle('dark', next === 'dark')
        try {
          localStorage.setItem('theme', next)
        } catch {
          // Modo privado o almacenamiento bloqueado: no persiste, y basta.
        }
      }

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      // Sin la API o con la preferencia puesta, el tema cambia igual: de golpe.
      // Es exactamente lo que hacía antes, así que el fallback no pierde nada.
      if (reduced || typeof document.startViewTransition !== 'function') {
        apply()
        return
      }

      // El origen del círculo viaja por variables CSS porque quien lo dibuja
      // es la hoja de estilos, no este archivo.
      const root = document.documentElement
      const { x, y } = origin ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
      root.style.setProperty('--vt-x', `${x}px`)
      root.style.setProperty('--vt-y', `${y}px`)
      // Radio hasta la esquina más lejana: si se dejara en `100vmax` el
      // círculo dejaría de cubrir en cuanto el clic no estuviera centrado.
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )
      root.style.setProperty('--vt-r', `${Math.ceil(radius)}px`)

      // La clase acota las reglas del círculo para que no se le apliquen al
      // cambio de idioma, que usa la misma API con otro gesto.
      root.classList.add('vt-theme')
      document
        .startViewTransition(apply)
        .finished.finally(() => root.classList.remove('vt-theme'))
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme tiene que usarse dentro de <ThemeProvider>')
  }
  return context
}
