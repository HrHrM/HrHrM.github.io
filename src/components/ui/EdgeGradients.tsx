import { useScrolledPast } from '@/hooks/useScrolledPast'

import './EdgeGradients.css'

/**
 * Dos columnas de degradado animado en los bordes del viewport, que rellenan
 * el margen vacío que deja el `Container` (72rem) en pantallas anchas: 144px
 * por lado a 1440 y 384px a 1920.
 *
 * **Arrancan al pasar el hero**, con el mismo hook que ya usa la Navbar. El
 * hero tiene su propia geodésica y su campo de partículas; encender esto
 * encima sería la tercera cosa moviéndose en el primer viewport.
 *
 * **Cada tema tiene su efecto, no el mismo con otro número.** En oscuro es luz
 * aditiva: el acento sobre un fondo casi negro. En claro la luz no traduce
 * —sobre papel no hay nada que iluminar— así que es sombra: `ink` de la paleta,
 * que es lo que da contraste sobre blanco.
 *
 * Es puramente decorativo: `aria-hidden` y `pointer-events: none`. No hay aquí
 * ninguna información, y nada que se pueda pulsar.
 *
 * **Sin `motion`.** El `GradientText` de React Bits del que sale la idea anima
 * `background-position` con `useAnimationFrame`, lo que obliga a instalar
 * `motion` y a correr un rAF durante toda la visita. Un `@keyframes` da el
 * mismo movimiento, lo gestiona el compositor y el navegador lo pausa solo
 * cuando la pestaña no está visible.
 */
export function EdgeGradients() {
  const past = useScrolledPast('hero')
  return (
    <div aria-hidden="true">
      <div className="edge-gradient edge-gradient--left" data-visible={past} />
      <div className="edge-gradient edge-gradient--right" data-visible={past} />
    </div>
  )
}
