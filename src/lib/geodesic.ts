/**
 * La geodésica del Hero: geometría y proyección, sin nada de DOM.
 *
 * Vive aquí y no dentro del componente porque la dibujan dos cosas: el canvas
 * animado (`WireframeBall`) y el SVG quieto que se ve mientras aquel arranca
 * (`WireframeBallStatic`). Si cada uno tuviera su copia, el relevo entre los
 * dos se notaría en cuanto alguien tocara un número.
 *
 * Al ser puro se ejecuta igual en el build de Node, que es donde se
 * prerenderiza el SVG del placeholder (CLAUDE.md §2).
 */

export type Vec3 = [number, number, number]
export type Edge = [number, number]
type Face = [number, number, number]
export type Mesh = { points: Vec3[]; edges: Edge[] }

const PHI = (1 + Math.sqrt(5)) / 2

function normalize([x, y, z]: Vec3): Vec3 {
  const length = Math.hypot(x, y, z)
  return [x / length, y / length, z / length]
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/**
 * Clave estable para deduplicar vértices. El guard del cero no es paranoia:
 * sin él `-1e-17` y `0` son dos entradas distintas y la esfera sale con
 * costuras por donde no cierran las caras.
 */
function keyOf([x, y, z]: Vec3): string {
  const round = (value: number) => {
    const r = Math.round(value * 1e5) / 1e5
    return (r === 0 ? 0 : r).toFixed(5)
  }
  return `${round(x)},${round(y)},${round(z)}`
}

/** Los doce vértices del icosaedro, ya proyectados sobre la esfera unidad. */
function icosahedron(): Vec3[] {
  const points: Vec3[] = []
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      points.push([0, a, b * PHI], [a, b * PHI, 0], [a * PHI, 0, b])
    }
  }
  return points.map(normalize)
}

/**
 * Las aristas de un sólido regular son los pares a distancia mínima. Se
 * deducen en vez de teclear la tabla de 30 porque una tabla escrita a mano se
 * equivoca en silencio: la figura sale casi bien y nadie encuentra por qué.
 */
function regularEdges(points: Vec3[]): Edge[] {
  let shortest = Infinity
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      shortest = Math.min(shortest, distance(points[i], points[j]))
    }
  }

  const edges: Edge[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (distance(points[i], points[j]) < shortest * 1.05) edges.push([i, j])
    }
  }
  return edges
}

/** Una cara es un trío de vértices unidos entre sí de tres en tres. */
function facesFrom(points: Vec3[], edges: Edge[]): Face[] {
  const joined = new Set(edges.map(([i, j]) => `${i}:${j}`))
  const linked = (i: number, j: number) =>
    joined.has(i < j ? `${i}:${j}` : `${j}:${i}`)

  const faces: Face[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (!linked(i, j)) continue
      for (let k = j + 1; k < points.length; k++) {
        if (linked(j, k) && linked(i, k)) faces.push([i, j, k])
      }
    }
  }
  return faces
}

/** Cada cara en cuatro, con los puntos nuevos empujados a la esfera. */
function subdivide(points: Vec3[], faces: Face[]) {
  const next = [...points]
  const index = new Map(next.map((point, i) => [keyOf(point), i]))

  const midpoint = (a: number, b: number) => {
    const point = normalize([
      (next[a][0] + next[b][0]) / 2,
      (next[a][1] + next[b][1]) / 2,
      (next[a][2] + next[b][2]) / 2,
    ])
    const key = keyOf(point)
    const existing = index.get(key)
    if (existing !== undefined) return existing

    next.push(point)
    index.set(key, next.length - 1)
    return next.length - 1
  }

  const nextFaces: Face[] = []
  for (const [a, b, c] of faces) {
    const ab = midpoint(a, b)
    const bc = midpoint(b, c)
    const ca = midpoint(c, a)
    nextFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
  }
  return { points: next, faces: nextFaces }
}

/**
 * Tras subdividir, la malla ya no es regular —las aristas de una geodésica no
 * miden todas lo mismo—, así que aquí no vale el criterio de distancia mínima:
 * las aristas salen de las caras y se deduplican por par ordenado.
 */
function edgesFromFaces(faces: Face[]): Edge[] {
  const seen = new Set<string>()
  const edges: Edge[] = []
  for (const [a, b, c] of faces) {
    const sides: Edge[] = [
      [a, b],
      [b, c],
      [c, a],
    ]
    for (const [from, to] of sides) {
      const key = from < to ? `${from}:${to}` : `${to}:${from}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([from, to])
    }
  }
  return edges
}

const meshes = new Map<number, Mesh>()

/** 0 → 12 vértices y 30 aristas · 1 → 42 y 120 · 2 → 162 y 480. */
export function meshFor(detail: number): Mesh {
  const cached = meshes.get(detail)
  if (cached) return cached

  let points = icosahedron()
  let faces = facesFrom(points, regularEdges(points))
  for (let i = 0; i < detail; i++) {
    const divided = subdivide(points, faces)
    points = divided.points
    faces = divided.faces
  }

  const mesh: Mesh = { points, edges: edgesFromFaces(faces) }
  meshes.set(detail, mesh)
  return mesh
}

/* ─────────────────────────────────────────────────────────────
   Proyección — los números que hacen que el canvas y el SVG
   quieto se vean como la misma figura.
   ───────────────────────────────────────────────────────────── */

/** Distancia de la cámara en radios. A 3.2 se nota qué cara está delante sin
    que el sólido parezca un ojo de pez. */
export const CAMERA = 3.2

/** Un giro sobre el eje vertical puro parece la aguja de un reloj; inclinar el
    eje es lo que hace que se lea como un volumen. */
export const BASE_PITCH = 0.42

/**
 * Radio en fracción del lado corto, **antes** de la perspectiva. Hay que
 * contarla: un vértice de la cara delantera se escala hasta
 * `CAMERA / (CAMERA - 1)` ≈ 1.45, así que un 0.34 «de radio» acababa pintando
 * 0.49 y la figura se salía por la derecha.
 */
export const RADIUS = 0.24

/**
 * Por encima de la mitad de la caja, alineada con la masa de texto.
 *
 * El valor correcto **no** es 0.5, y el viaje de ida y vuelta merece quedar
 * escrito. Se subió a 0.5 midiendo contra el bloque de contenido completo, que
 * incluye el zócalo de datos; pero el zócalo es una franja de mono de 13px
 * separada 64px del resto, y no pesa como texto. Centrar contra él dejaba la
 * figura 85px por debajo del eje del nombre y la frase, y se veía descolgada.
 *
 * La referencia buena es el bloque sin el zócalo: de la línea de rol al CTA.
 * Su centro cae en 0.435 del hero a 1920x1080 y en 0.407 a 1366x768 — no es
 * una fracción constante porque la separación del zócalo es absoluta y la
 * altura del hero no. 0.42 es el punto que sirve a las dos.
 */
export const CENTER_Y = 0.42

/** Hairline de verdad: con el `dpr` en la transformada, 0.75 CSS px es una
    línea fina en pantalla normal y afiladísima en retina. */
export const LINE_WIDTH = 0.75

export const ALPHA_NEAR = 0.62
export const ALPHA_FAR = 0.1

export type Projected = { x: number; y: number; depth: number }

/** Proyecta los vértices una sola vez por fotograma: las 120 aristas comparten
    extremos, y proyectar por arista sería hacer el doble de trabajo. */
export function projectMesh(
  mesh: Mesh,
  width: number,
  height: number,
  yaw: number,
  pitch: number,
): Projected[] {
  const centerX = width / 2
  const centerY = height * CENTER_Y
  const radius = Math.min(width, height) * RADIUS

  const cosYaw = Math.cos(yaw)
  const sinYaw = Math.sin(yaw)
  const cosPitch = Math.cos(pitch)
  const sinPitch = Math.sin(pitch)

  return mesh.points.map(([x, y, z]) => {
    const x1 = x * cosYaw + z * sinYaw
    const z1 = z * cosYaw - x * sinYaw
    const y2 = y * cosPitch - z1 * sinPitch
    const z2 = y * sinPitch + z1 * cosPitch
    const scale = (CAMERA / (CAMERA - z2)) * radius
    return {
      x: centerX + x1 * scale,
      y: centerY - y2 * scale,
      depth: (z2 + 1) / 2,
    }
  })
}

/** Sin oclusión real, el desvanecido por profundidad media es lo que separa la
    cara de delante de la de detrás. */
export function edgeAlpha(from: Projected, to: Projected): number {
  const depth = (from.depth + to.depth) / 2
  return ALPHA_FAR + (ALPHA_NEAR - ALPHA_FAR) * depth ** 1.6
}
