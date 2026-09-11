import { useEffect, useRef } from 'react'
import { Camera, Geometry, Mesh, Program, Renderer } from 'ogl'

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { FIELD, FIELD_OPACITY } from '@/lib/particleField'

/**
 * Campo de partículas en WebGL, adaptado del componente `Particles` de
 * React Bits (MIT + Commons Clause, © David Haz — https://reactbits.dev).
 *
 * Lo que cambia respecto al original, y por qué:
 *
 * - **El color sale de los tokens, no de un array de hex.** El original recibe
 *   `particleColors={['#ffffff']}`; blanco sobre `paper` —que aquí es casi
 *   blanco— no se ve. Ahora se leen variables CSS, así que el tema oscuro se
 *   resuelve solo.
 * - **Se quitó el temblor de color del fragment shader.** El original suma
 *   `0.2 * sin(...)` a cada canal, que sobre una paleta de seis colores es
 *   ruido; y con `line` en claro (ya cerca del blanco) ese +0.2 satura a blanco
 *   y las partículas parpadean. Queda como uniform por si se quiere volver.
 * - **`prefers-reduced-motion`, pausa fuera de pantalla y con la pestaña
 *   oculta.** El original deja el `requestAnimationFrame` corriendo siempre.
 * - **`ResizeObserver`** en vez de `resize` de `window`: el contenedor cambia
 *   de tamaño sin que lo haga la ventana.
 * - **El contexto WebGL se libera al desmontar.** Importante porque el efecto
 *   se rehace en cada cambio de tema: sin `loseContext` el navegador acumula
 *   contextos y a partir de ~16 empieza a descartar los viejos.
 * - **El puntero se escucha en `window`.** El contenedor es decorativo y va con
 *   `pointer-events-none`, así que nunca recibiría `mousemove`.
 */

type ParticlesProps = {
  className?: string
  /** Variables CSS de las que sale la paleta. Decorativas por defecto. */
  colorTokens?: string[]
  count?: number
  /** Cuánto se separan del centro. */
  spread?: number
  /** Estiramiento en profundidad. Conviene dejarlo por debajo de la distancia
      de cámara o media nube acaba detrás del objetivo. */
  depth?: number
  /** Apertura de la cámara. El original usa 15, que es un teleobjetivo y deja
      casi todo fuera de cuadro. */
  fov?: number
  speed?: number
  baseSize?: number
  /** 0 = todas iguales. */
  sizeRandomness?: number
  cameraDistance?: number
  /** Opacidad global del campo; es el mando fino para que no compita. Si no
      se pasa, cada tema usa la suya (ver `FIELD_OPACITY` en
      `lib/particleField`, donde está el porqué de que no sean el mismo
      número). */
  opacity?: number
  moveOnHover?: boolean
  hoverFactor?: number
  disableRotation?: boolean
  /** Temblor de color del original. 0 lo apaga. */
  colorJitter?: number
  /** Se llama tras pintar el primer fotograma, para retirar el placeholder. */
  onFirstFrame?: () => void
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uDepth;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    // El original multiplica la profundidad por 10 fijo. Con la camara a 20
    // eso deja media nube detras del objetivo y el resto tan lejos que el
    // punto queda en un pixel: por eso no se veian las particulas. Ahora es
    // un uniform, y se mantiene por debajo de cameraDistance.
    // (Sin acentos ni comillas invertidas: esto va dentro de un template
    // literal de JS, y un backtick aqui lo cerraria a media cadena.)
    pos.z *= uDepth;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uColorJitter;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    // Borde suave en vez del recorte duro del original: sobre papel casi
    // blanco, un círculo con el canto marcado se lee como suciedad.
    float circle = smoothstep(0.5, 0.35, d);
    if (circle <= 0.0) discard;

    vec3 tint = vColor + uColorJitter * sin(uv.yxx + uTime + vRandom.y * 6.28);
    gl_FragColor = vec4(tint, circle * uOpacity);
  }
`

/**
 * Normaliza cualquier color CSS a RGB 0–1 apoyándose en el propio motor del
 * navegador: se asigna a `fillStyle`, que lo devuelve ya resuelto. Así el token
 * puede ser hex, `rgb()` u `oklch()` sin escribir un parser por formato.
 */
function toRgb(
  ctx: CanvasRenderingContext2D,
  input: string,
): [number, number, number] {
  ctx.fillStyle = '#000000'
  ctx.fillStyle = input
  const resolved = ctx.fillStyle

  if (resolved.startsWith('#')) {
    const int = parseInt(resolved.slice(1, 7), 16)
    return [
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255,
    ]
  }

  const parts = resolved.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return [0.5, 0.5, 0.5]
  return [
    Number(parts[0]) / 255,
    Number(parts[1]) / 255,
    Number(parts[2]) / 255,
  ]
}

/**
 * A nivel de módulo y no como literal en los parámetros: un array por defecto
 * escrito en la firma es un objeto nuevo en cada render, y como está en las
 * dependencias del efecto, el campo entero se reconstruiría constantemente —
 * un contexto WebGL nuevo por render hasta que el navegador empiece a tirar
 * los viejos.
 *
 * Va `muted` y no `line`, que es el token decorativo y sería lo esperable: a
 * 1.2:1 contra `paper` las partículas literalmente no se veían en ninguno de
 * los dos modos. La sutileza la pone `uOpacity`, que sí se puede graduar, y no
 * un color que ya nace invisible.
 */
const DEFAULT_TOKENS = ['--muted']

export function Particles({
  className,
  colorTokens = DEFAULT_TOKENS,
  count = FIELD.count,
  spread = FIELD.spread,
  depth = FIELD.depth,
  fov = FIELD.fov,
  speed = 0.06,
  baseSize = FIELD.baseSize,
  sizeRandomness = FIELD.sizeRandomness,
  cameraDistance = FIELD.cameraDistance,
  opacity,
  moveOnHover = true,
  hoverFactor = 0.6,
  disableRotation = false,
  colorJitter = 0,
  onFirstFrame,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const reducedMotion = usePrefersReducedMotion()

  // El callback se guarda en un ref y **no** entra en las dependencias del
  // efecto. Si entrara, pasarle una función inline desde el padre bastaría
  // para reconstruir el canvas en cada render. Así quien lo use no tiene que
  // acordarse de estabilizarlo.
  const notify = useRef(onFirstFrame)
  useEffect(() => {
    notify.current = onFirstFrame
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const probe = document.createElement('canvas').getContext('2d')
    if (!probe) return

    const styles = getComputedStyle(document.documentElement)
    const palette = colorTokens
      .map((token) => styles.getPropertyValue(token).trim())
      .filter(Boolean)
      .map((value) => toRgb(probe, value))
    if (palette.length === 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    /**
     * **Si el navegador no da WebGL, no se monta nada y ya está.**
     *
     * Sin esta comprobación, el portafolio entero se sustituye por «Un error
     * inesperado. Vuelve a intentarlo.» — la página de error del ErrorBoundary
     * de `root.tsx`. Para un sitio cuyo objetivo es que alguien lo abra y vea
     * el trabajo, es el peor fallo posible, y lo provoca un adorno.
     *
     * La cadena: `ogl` **no lanza** al no conseguir contexto. Hace
     * `console.error('unable to create webgl context')` y sigue con `gl` a
     * `null` (`node_modules/ogl/src/core/Renderer.js:46`); lo que revienta es
     * la primera línea que lo usa, con un `TypeError` que sube por el render de
     * React. Por eso no basta con un `try` alrededor del `new Renderer()`: hay
     * que preguntar antes.
     *
     * No es un caso de laboratorio. Pasa con la aceleración por hardware
     * desactivada (frecuente en portátiles corporativos), en máquinas
     * virtuales y escritorios remotos, en Firefox con `webgl.disabled` y en
     * navegadores endurecidos por privacidad. Lo destapó Firefox en el runner
     * de CI, que no tiene GPU; Chromium no lo veía porque cae a SwiftShader
     * por software y sí consigue contexto.
     *
     * Sondear aparte tiene además una ventaja sobre capturar la excepción:
     * **no deja el `console.error` de ogl en la consola del visitante**, y una
     * consola limpia es lo que permite que «cero errores» siga siendo una
     * aserción útil.
     *
     * Retirarse en silencio es lo correcto: `onFirstFrame` no llega a
     * llamarse, así que `ParticlesStatic` —ya pintado debajo— se queda
     * visible y nadie nota nada.
     */
    const probeCanvas = document.createElement('canvas')
    const probeGl =
      probeCanvas.getContext('webgl2') ?? probeCanvas.getContext('webgl')
    if (!probeGl) return
    // El sondeo consume un contexto, y el navegador solo concede unos pocos.
    probeGl.getExtension('WEBGL_lose_context')?.loseContext()

    // El `try` se queda como segunda red: la creación puede fallar por otras
    // razones —contexto perdido al arrancar, memoria— y ninguna justifica
    // tumbar la página.
    let renderer
    try {
      renderer = new Renderer({ dpr, depth: false, alpha: true })
      if (!renderer.gl) return
    } catch {
      return
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, { fov })
    camera.position.set(0, 0, cameraDistance)

    const resize = () => {
      const { clientWidth, clientHeight } = container
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight)
      camera.perspective({ aspect: clientWidth / clientHeight })
    }

    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Rechazo hasta caer dentro de la esfera y raíz cúbica del radio: es lo
      // que reparte los puntos por igual en el volumen. Sin la raíz se apelotonan
      // en el centro.
      let x: number, y: number, z: number, lengthSquared: number
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        lengthSquared = x * x + y * y + z * z
      } while (lengthSquared > 1 || lengthSquared === 0)

      const radius = Math.cbrt(Math.random())
      positions.set([x * radius, y * radius, z * radius], i * 3)
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4,
      )
      colors.set(palette[Math.floor(Math.random() * palette.length)], i * 3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: spread },
        uDepth: { value: depth },
        uBaseSize: { value: baseSize * dpr },
        uSizeRandomness: { value: sizeRandomness },
        uOpacity: { value: opacity ?? FIELD_OPACITY[theme] },
        uColorJitter: { value: colorJitter },
      },
      transparent: true,
      depthTest: false,
    })

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })

    let notified = false
    let pointerX = 0
    let pointerY = 0
    let elapsed = 0

    const draw = () => {
      program.uniforms.uTime.value = elapsed * 0.001

      if (moveOnHover) {
        particles.position.x = -pointerX * hoverFactor
        particles.position.y = -pointerY * hoverFactor
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15
        particles.rotation.z += 0.01 * speed
      }

      renderer.render({ scene: particles, camera })

      // El relevo con el SVG quieto: se avisa con algo ya pintado, no al
      // montar, para que no quede un hueco entre que el placeholder se va y el
      // canvas tiene contenido. Una sola vez: esto corre 60 veces por segundo.
      if (!notified) {
        notified = true
        notify.current?.()
      }
    }

    let frame = 0
    let running = false
    let last = 0

    const tick = (now: number) => {
      // Tope al delta: al volver de una pestaña oculta, el primer salto sería
      // de varios segundos y el campo daría un tirón.
      const delta = last ? Math.min(now - last, 64) : 16
      last = now
      elapsed += delta * speed
      draw()
      frame = requestAnimationFrame(tick)
    }

    let onScreen = false

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion
      if (shouldRun === running) return
      running = shouldRun
      if (shouldRun) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }

    const sizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    sizeObserver.observe(container)

    const screenObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    screenObserver.observe(container)

    document.addEventListener('visibilitychange', sync)
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    // Un fotograma siempre, también con `prefers-reduced-motion`: el campo
    // quieto sigue siendo textura, y apagarlo del todo dejaría el hueco.
    resize()
    draw()

    return () => {
      cancelAnimationFrame(frame)
      sizeObserver.disconnect()
      screenObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pointermove', onPointerMove)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [
    colorTokens,
    count,
    spread,
    depth,
    fov,
    speed,
    baseSize,
    sizeRandomness,
    cameraDistance,
    opacity,
    moveOnHover,
    hoverFactor,
    disableRotation,
    colorJitter,
    theme,
    reducedMotion,
  ])

  return <div ref={containerRef} className={cn('h-full w-full', className)} />
}
