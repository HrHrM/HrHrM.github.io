import type { Locale } from './constants'

/**
 * Las fechas se guardan en ISO parcial ("2025-04") y se formatean aquí, no en
 * el contenido: así los dos idiomas no pueden desincronizarse cuando cambie
 * una fecha.
 */
export function formatMonthYear(value: string, locale: Locale): string {
  const [year, month] = value.split('-')
  if (!month) return year

  const date = new Date(Number(year), Number(month) - 1, 1)
  const formatted = new Intl.DateTimeFormat(
    locale === 'es' ? 'es-ES' : 'en-US',
    { month: 'short', year: 'numeric' },
  ).format(date)

  // es-ES devuelve el mes en minúscula ("abr 2025"); en una columna de
  // metadatos queda mejor con mayúscula inicial.
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
