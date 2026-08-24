import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Une clases resolviendo los conflictos de Tailwind. Obligatorio cuando hay condicionales. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
