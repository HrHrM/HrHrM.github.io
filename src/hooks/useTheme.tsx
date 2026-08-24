import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
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

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('theme', next)
      } catch {
        // Modo privado o almacenamiento bloqueado: el tema no persiste y basta.
      }
      return next
    })
  }, [])

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
