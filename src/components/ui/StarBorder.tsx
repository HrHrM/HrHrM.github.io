import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/cn'

import './StarBorder.css'

/**
 * StarBorder — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Dos destellos que recorren el borde superior e inferior de lo que envuelve.
 *
 * **Es un envoltorio, no un botón.** El original *es* el botón: trae su propio
 * fondo, borde, tipografía y relleno, y un prop `as` para decidir la etiqueta.
 * Aquí eso sobra y estorba: el botón del proyecto ya existe en `Button.tsx`
 * con sus variantes y su hover, y duplicar esos estilos en un CSS aparte crea
 * dos fuentes de verdad para la misma pieza. Este componente solo pone el
 * destello; dentro va el botón de siempre.
 *
 * De ahí que no haya `as`, `backgroundColor`, `textColor` ni `borderColor`:
 * los cuatro describen el botón, que ya no es asunto suyo. Y de ahí que
 * `color` sea una variable CSS con el acento por defecto, en vez de un hex
 * suelto (CLAUDE.md §6).
 *
 * Los destellos son decorativos y van con `aria-hidden`: quien usa el enlace
 * con teclado o lector de pantalla no se pierde nada.
 *
 * La animación es CSS, no JS. Corre en el compositor y el navegador la para
 * cuando la pestaña no está visible; con el elemento fuera de pantalla sigue
 * declarada, pero sin trabajo en el hilo principal.
 */

type StarBorderProps = {
  children: ReactNode
  className?: string
  /** Color del destello. Por defecto, el acento del tema. */
  color?: string
  /** Duración de una pasada. */
  speed?: string
  /** Cuánto asoma el destello por arriba y por abajo, en píxeles. */
  thickness?: number
}

export function StarBorder({
  children,
  className,
  color,
  speed = '6s',
  thickness = 2,
}: StarBorderProps) {
  const style = {
    '--star-speed': speed,
    '--star-thickness': `${thickness}px`,
    ...(color ? { '--star-color': color } : {}),
  } as CSSProperties

  return (
    <span className={cn('star-border', className)} style={style}>
      <span
        aria-hidden="true"
        className="star-border__glow star-border__glow--top"
      />
      <span
        aria-hidden="true"
        className="star-border__glow star-border__glow--bottom"
      />
      <span className="star-border__content">{children}</span>
    </span>
  )
}
