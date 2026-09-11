import type { CSSProperties } from 'react'

import { cn } from '@/lib/cn'

import './FoldText.css'

/**
 * FoldText — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * El texto entra por trozos, cada uno girando sobre una bisagra, con un
 * desfase entre ellos.
 *
 * **Sin GSAP.** El original monta una `gsap.timeline` más `ScrollTrigger` para
 * animar `transform`, `opacity` y una sombra; las tres tienen `@keyframes`
 * nativos, y el desfase —lo único que la timeline aportaba— sale de un
 * `animation-delay` calculado con el índice de cada trozo. Son ~23 KB gzip que
 * no entran, en un sitio cuyo CSS entero pesa 8,5.
 *
 * **Solo dispara al montar.** El original ofrece cuatro disparadores (`mount`,
 * `hover`, `scroll`, `loop`). Aquí se usa en el hero, que está sobre el
 * pliegue, así que `scroll` no aplica; y `hover` o `loop` sobre un titular
 * serían movimiento repetido en el primer viewport, que es lo que el
 * CLAUDE.md §4 evita.
 *
 * **La accesibilidad es la del original y hay que conservarla:** el texto real
 * va en un nodo oculto para lectores de pantalla y los trozos visibles llevan
 * `aria-hidden`. Una palabra partida en spans puede leerse letra a letra.
 */

type FoldTextProps = {
  text: string
  /** Por carácter o por palabra. En frases largas, `word` se lee mejor. */
  splitBy?: 'char' | 'word'
  hinge?: 'top' | 'bottom' | 'left' | 'right'
  /** Duración de cada trozo, en ms. */
  duration?: number
  /** Desfase entre trozos, en ms. */
  stagger?: number
  /** Retardo antes del primer trozo, en ms. */
  delay?: number
  perspective?: number
  /** Fuerza de la sombra del pliegue, de 0 a 1. */
  creaseShading?: number
  /**
   * Trozo de `text` que va en color de acento.
   *
   * No está en el original, que recibe un `color` único para todo. Hace falta
   * porque el subtítulo del hero lleva una palabra en acento —el único acento
   * del primer viewport— y pasarlo como cadena plana la perdería.
   */
  highlight?: string
  className?: string
}

type Piece =
  | { key: number; space: true; text: string }
  | { key: number; space: false; text: string; index: number; accent: boolean }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/**
 * Trocea el texto y anota, para cada trozo, su orden de animación y si cae
 * dentro del tramo resaltado.
 *
 * Función de módulo y no lógica dentro del `map` del JSX: llevar la cuenta de
 * posiciones exige mutar contadores, y hacerlo mientras React renderiza es
 * precisamente lo que marca el linter. Aquí la mutación es local y el
 * componente recibe los datos ya resueltos.
 *
 * El resaltado se decide por **posición en la cadena**, no comparando textos:
 * así da igual partir por letra o por palabra, y no marca de más si la palabra
 * resaltada aparece dos veces.
 */
function split(
  text: string,
  splitBy: 'char' | 'word',
  highlight?: string,
): Piece[] {
  // `split(/(\s+)/)` conserva los separadores: sin ellos las palabras se
  // pegarían al recomponerse en spans.
  const parts = splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text)

  const start = highlight ? text.indexOf(highlight) : -1
  const end = start === -1 ? -1 : start + (highlight?.length ?? 0)

  const pieces: Piece[] = []
  let cursor = 0
  let panel = 0

  parts.forEach((part, key) => {
    if (!part) return
    const at = cursor
    cursor += part.length

    // Los espacios no son un panel: no se doblan, solo separan.
    if (/^\s+$/.test(part)) {
      pieces.push({ key, space: true, text: part })
      return
    }

    pieces.push({
      key,
      space: false,
      text: part,
      index: panel++,
      accent: start !== -1 && at < end && at + part.length > start,
    })
  })

  return pieces
}

export function FoldText({
  text,
  splitBy = 'char',
  hinge = 'top',
  duration = 650,
  stagger = 45,
  delay = 0,
  perspective = 700,
  creaseShading = 0.55,
  highlight,
  className,
}: FoldTextProps) {
  const pieces = split(text, splitBy, highlight)

  const style = {
    '--fold-duration': `${duration}ms`,
    '--fold-stagger': `${stagger}ms`,
    '--fold-delay': `${delay}ms`,
    '--fold-perspective': `${Math.max(120, perspective)}px`,
    '--fold-crease': clamp(creaseShading, 0, 1),
  } as CSSProperties

  return (
    <span
      className={cn('fold-text', className)}
      data-hinge={hinge}
      style={style}
    >
      <span className="fold-text__sr">{text}</span>
      <span aria-hidden="true">
        {pieces.map((piece) =>
          piece.space ? (
            <span key={`s-${piece.key}`}>{piece.text.replace(/ /g, ' ')}</span>
          ) : (
            <span key={`p-${piece.key}`} className="fold-text__piece">
              <span
                className={cn(
                  'fold-text__panel',
                  piece.accent && 'text-accent',
                )}
                style={{ '--fold-i': piece.index } as CSSProperties}
              >
                {piece.text}
              </span>
            </span>
          ),
        )}
      </span>
    </span>
  )
}
