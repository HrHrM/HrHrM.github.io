/**
 * Los números del campo de partículas del Hero, y el muestreo determinista que
 * usa la versión quieta.
 *
 * Están aquí y no dentro del componente porque los comparten dos piezas: el
 * campo en WebGL (`Particles`) y el SVG que se ve mientras aquel arranca
 * (`ParticlesStatic`). Con dos copias, el relevo se notaría en cuanto alguien
 * cambiara la densidad o el tamaño en una sola.
 *
 * Todo es puro: se ejecuta igual en el build de Node, que es donde se
 * prerenderiza el SVG (CLAUDE.md §2).
 */

export const FIELD = {
  count: 240,
  /** Cuánto se separan del centro. */
  spread: 9,
  /** Estiramiento en profundidad. Por debajo de `cameraDistance` o media nube
      acaba detrás del objetivo. */
  depth: 3,
  /** Apertura de la cámara. El original de React Bits usa 15, que es un
      teleobjetivo y deja casi todo fuera de cuadro. */
  fov: 35,
  cameraDistance: 20,
  baseSize: 90,
  /** 0 = todas iguales. */
  sizeRandomness: 0.7,
} as const

/**
 * La opacidad se declara por tema, pero **no** por la razón que parecía.
 *
 * El primer ajuste bajó el modo claro a 0.22 porque en una captura las motas
 * grises sobre papel casi blanco parecían suciedad. Era una mala lectura: a
 * ese alfa el punto queda en `rgb(216,221,219)` sobre `paper`, o sea 1.15:1
 * contra el fondo — en una pantalla de verdad no se ve nada. El modo oscuro,
 * a 0.45, ronda 2:1 y por eso sí funcionaba.
 *
 * Los dos valores buscan la misma presencia percibida, no el mismo número.
 * Claro necesita más alfa porque parte de un fondo con mucha más luminancia, y
 * la caída relativa por unidad de alfa es menor.
 *
 * Subidos después desde 0.4 / 0.45, que ya se veían pero quedaban demasiado
 * tímidos. Contra el fondo de cada tema, el punto pasa de ~1.7:1 a ~2.1:1 en
 * claro y de ~2.0:1 a ~2.5:1 en oscuro. Sigue siendo textura de fondo: por
 * encima de 3:1 empieza a competir con el texto en vez de sostenerlo.
 */
export const FIELD_OPACITY = { light: 0.52, dark: 0.58 } as const

/**
 * El SVG quieto se dibuja en un lienzo de referencia fijo y luego se escala
 * con `preserveAspectRatio="slice"`. Se hace así porque en el prerender no hay
 * viewport: no se puede saber cuánto mide el Hero, y este placeholder solo
 * tiene que aguantar hasta que el canvas de verdad pinte su primer fotograma.
 */
export const STATIC_VIEWBOX = { width: 1600, height: 900 } as const

/** PRNG con semilla (mulberry32). Hace falta que sea determinista: el SVG se
    genera en el build **y** otra vez al hidratar, y con `Math.random()` los
    dos no coincidirían — React lo cantaría como error de hidratación. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type StaticParticle = { cx: number; cy: number; r: number }

/**
 * Reproduce en CPU lo que el vertex shader hace en GPU: reparte los puntos por
 * el volumen de una esfera, los estira en profundidad y los proyecta con la
 * misma cámara. Es lo que hace que las dos versiones tengan la misma densidad
 * y la misma escala de tamaños, en vez de parecerse de lejos.
 *
 * Se omite el vaivén temporal del shader: en el fotograma cero aporta un
 * desplazamiento y nada más, y el campo es aleatorio de todos modos.
 */
export function sampleStaticField(seed = 20260908): StaticParticle[] {
  const random = seeded(seed)
  const { width, height } = STATIC_VIEWBOX
  const aspect = width / height
  const halfFov = Math.tan((FIELD.fov * Math.PI) / 180 / 2)

  const particles: StaticParticle[] = []
  for (let i = 0; i < FIELD.count; i++) {
    // Rechazo hasta caer dentro de la esfera y raíz cúbica del radio: es lo que
    // reparte los puntos por igual en el volumen. Sin la raíz se apelotonan en
    // el centro. Mismo criterio que el componente animado.
    let x: number, y: number, z: number, lengthSquared: number
    do {
      x = random() * 2 - 1
      y = random() * 2 - 1
      z = random() * 2 - 1
      lengthSquared = x * x + y * y + z * z
    } while (lengthSquared > 1 || lengthSquared === 0)

    const radius = Math.cbrt(random())
    const sizeSeed = random()

    const px = x * radius * FIELD.spread
    const py = y * radius * FIELD.spread
    const pz = z * radius * FIELD.spread * FIELD.depth

    // Vista: la cámara mira hacia -z desde `cameraDistance`.
    const viewZ = pz - FIELD.cameraDistance
    if (viewZ >= 0) continue // detrás del objetivo

    const ndcX = px / (-viewZ * halfFov * aspect)
    const ndcY = py / (-viewZ * halfFov)
    if (Math.abs(ndcX) > 1.2 || Math.abs(ndcY) > 1.2) continue

    const dist = Math.hypot(px, py, viewZ)
    // `gl_PointSize` es el diámetro, así que el radio del círculo es la mitad.
    const size =
      (FIELD.baseSize * (1 + FIELD.sizeRandomness * (sizeSeed - 0.5))) / dist

    // Enteros para x/y y un decimal para el radio: sobre un lienzo de
    // 1600x900 la precisión extra no se ve y sí ocupa en el HTML, que es donde
    // acaba este SVG.
    particles.push({
      cx: Math.round((ndcX * 0.5 + 0.5) * width),
      cy: Math.round((1 - (ndcY * 0.5 + 0.5)) * height),
      r: Math.round((size / 2) * 10) / 10,
    })
  }
  return particles
}
