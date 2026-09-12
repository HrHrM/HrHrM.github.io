import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import './TextType.css'

/**
 * TextType — React Bits (MIT + Commons Clause, © David Haz).
 * https://reactbits.dev
 *
 * Escribe el texto carácter a carácter, con cursor. Lo que cambia respecto al
 * original va marcado con «CAMBIO».
 *
 * **Sin GSAP.** El original carga la librería entera para una sola cosa:
 * parpadear el cursor con `repeat: -1, yoyo: true`. Eso son dos líneas de
 * `@keyframes`. Son ~23 KB gzip en un sitio cuyo CSS entero pesa 8,5 KB.
 */

type TextTypeProps = {
  text: string | string[]
  as?: ElementType
  typingSpeed?: number
  initialDelay?: number
  pauseDuration?: number
  deletingSpeed?: number
  loop?: boolean
  className?: string
  showCursor?: boolean
  hideCursorWhileTyping?: boolean
  cursorCharacter?: ReactNode
  cursorClassName?: string
  cursorBlinkDuration?: number
  variableSpeed?: { min: number; max: number }
  onSentenceComplete?: (sentence: string, index: number) => void
  /** Empieza al entrar en pantalla. */
  startOnVisible?: boolean
  /**
   * CAMBIO — control externo del arranque, que el original no tiene: solo
   * ofrece `startOnVisible`, atado a un `IntersectionObserver` propio. Aquí el
   * disparo lo decide quien lo usa, porque en la Navbar el momento no es
   * «entré en pantalla» sino «la barra apareció», que es otro estado.
   */
  start?: boolean
  /**
   * CAMBIO — reserva el ancho del texto más largo. El original deja que el
   * nodo crezca carácter a carácter, y dentro de un contenedor flex eso empuja
   * a los hermanos en cada pulsación: en la Navbar, el bloque de enlaces
   * temblaba entero mientras se escribía el nombre.
   */
  reserveSpace?: boolean
  /**
   * CAMBIO — retira el cursor al terminar. El original solo sabe ocultarlo
   * *mientras* escribe (`hideCursorWhileTyping`), así que al acabar deja un
   * cursor parpadeando para siempre. En un titular pasa; en el logo de una
   * barra que está en pantalla todo el rato, es un tic permanente.
   */
  hideCursorWhenDone?: boolean
}

export function TextType({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  start = true,
  reserveSpace = true,
  hideCursorWhenDone = false,
}: TextTypeProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const longest = useMemo(
    () => texts.reduce((a, b) => (b.length > a.length ? b : a), ''),
    [texts],
  )

  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(!startOnVisible)
  const containerRef = useRef<HTMLElement>(null)

  const reducedMotion = usePrefersReducedMotion()

  /**
   * Estado derivado, no guardado. La versión anterior tenía un `typing` en
   * `useState` y escribía el texto completo con `setShown` en la rama de
   * movimiento reducido; las dos cosas son `setState` dentro de un efecto, que
   * provoca un render en cascada y que el linter marca con razón. Aquí salen
   * de lo que ya se sabe en el render.
   */
  const running = visible && start && !done && !reducedMotion
  const display = reducedMotion ? texts[0] : shown
  const finished = reducedMotion || done

  // El callback en un ref y fuera de las dependencias: pasarlo inline desde el
  // padre reiniciaría el tecleo en cada render del padre.
  const notify = useRef(onSentenceComplete)
  useEffect(() => {
    notify.current = onSentenceComplete
  })

  useEffect(() => {
    if (!startOnVisible) return
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    // `done` en la guarda para que no se vuelva a teclear nunca. Importa
    // porque `start` puede apagarse y encenderse —en la Navbar depende de si
    // se ha pasado del Hero, y eso va y viene con el scroll— y sin esto el
    // nombre se reescribiría cada vez que la barra reaparece.
    //
    // Con la preferencia de movimiento reducido puesta no se teclea nada: el
    // texto sale entero, y de eso se encarga `display` en el render. Escribir
    // carácter a carácter es movimiento, y del que más molesta — obliga a leer
    // algo que se está moviendo.
    if (!visible || !start || done || reducedMotion) return

    /**
     * CAMBIO — un solo efecto con una cadena de `setTimeout`, en vez de un
     * efecto que se desmonta y se vuelve a montar **en cada carácter**. El
     * original mete `displayedText` y `currentCharIndex` en las dependencias,
     * así que teclear una frase de 60 letras son 60 ciclos de limpieza y
     * suscripción. Aquí el progreso vive en variables locales y el efecto se
     * monta una vez.
     */
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    let index = 0
    let chars = 0
    let deleting = false

    const speed = () =>
      variableSpeed
        ? Math.random() * (variableSpeed.max - variableSpeed.min) +
          variableSpeed.min
        : typingSpeed

    const step = () => {
      if (cancelled) return
      const full = texts[index]

      if (!deleting) {
        chars += 1
        setShown(full.slice(0, chars))

        if (chars >= full.length) {
          if (!loop && index === texts.length - 1) {
            notify.current?.(full, index)
            setDone(true)
            return
          }
          deleting = true
          timer = setTimeout(step, pauseDuration)
          return
        }
        timer = setTimeout(step, speed())
        return
      }

      chars -= 1
      setShown(full.slice(0, chars))

      if (chars <= 0) {
        deleting = false
        notify.current?.(full, index)
        index = (index + 1) % texts.length
        timer = setTimeout(step, typingSpeed)
        return
      }
      timer = setTimeout(step, deletingSpeed)
    }

    timer = setTimeout(step, initialDelay)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [
    visible,
    start,
    done,
    reducedMotion,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    variableSpeed,
  ])

  const cursorHidden =
    (hideCursorWhileTyping && running) || (hideCursorWhenDone && finished)

  // CAMBIO — JSX con un componente en variable, en vez del `createElement` del
  // original. Hace lo mismo con el prop `as`, se lee mucho mejor y evita que
  // el linter tome el `ref` de un objeto de props literal por una lectura de
  // ref durante el render.
  const Tag = Component

  /**
   * **Las clases propias no pasan por `cn()`, y no es descuido.**
   *
   * `cn()` es clsx + `tailwind-merge`, y `tailwind-merge` resuelve conflictos
   * por prefijo: para él, `text-type__cursor`, `text-type__cursor--blink` y
   * `text-type__cursor--hidden` son tres utilidades del grupo `text-*` que se
   * pisan, así que conserva **solo la última**. Medido: el cursor acababa con
   * `class="text-type__cursor--hidden"` a secas, sin la clase base ni el
   * parpadeo.
   *
   * El nombre del bloque viene del componente original y no se cambia; lo que
   * se cambia es no meterlo en un resolutor que no es para esto. Las clases
   * que sí llegan de fuera (`className`, `cursorClassName`) se concatenan al
   * final, que es donde el usuario espera que ganen.
   */
  const classes = (...parts: (string | false | undefined)[]) =>
    parts.filter(Boolean).join(' ')

  return (
    <Tag
      ref={containerRef}
      className={classes('text-type', className)}
      style={{ '--type-blink': `${cursorBlinkDuration * 2}s` } as CSSProperties}
    >
      {/* El texto real para lectores de pantalla. Lo visual va `aria-hidden`
          porque un nodo que cambia cada 50ms se anunciaría sin parar. */}
      <span className="text-type__sr">{texts.join('. ')}</span>

      {reserveSpace ? (
        <span aria-hidden="true" className="text-type__sizer">
          {longest}
          {showCursor ? (
            <span className="text-type__cursor">{cursorCharacter}</span>
          ) : null}
        </span>
      ) : null}

      <span aria-hidden="true" className="text-type__live">
        {display}
        {showCursor ? (
          <span
            className={classes(
              'text-type__cursor',
              'text-type__cursor--blink',
              cursorHidden && 'text-type__cursor--hidden',
              cursorClassName,
            )}
          >
            {cursorCharacter}
          </span>
        ) : null}
      </span>
    </Tag>
  )
}
