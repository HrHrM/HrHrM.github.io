import type { Project } from '../types'

/**
 * TODO(contenido): los cuatro proyectos son plantillas con longitud realista,
 * no contenido final. Sustituir texto y `visibility` reales.
 *
 * Reglas al rellenarlos (CLAUDE.md §5):
 * - Contexto en tercera persona, aporte propio en primera. Nada de "nosotros".
 * - `outcome` solo si el número es real y publicable. Si no, se deja fuera.
 * - `visibility` hay que confirmarlo con el cliente o el ex-jefe antes de lanzar.
 */
export const projects: Project[] = [
  {
    slug: 'plataforma-pedidos',
    title: 'TODO: Plataforma de pedidos',
    tagline:
      'Rehacer el checkout de una cadena de retail sin parar las ventas de un solo día.',
    context: 'Retail · TODO: escala (p. ej. ~80k pedidos/mes)',
    problem:
      'El proceso de compra vivía en una aplicación monolítica de hace ocho años. Cada cambio en el formulario de pago obligaba a desplegar el sistema entero, así que en la práctica nadie lo tocaba. El equipo de negocio pedía cambios que tardaban trimestres en salir.',
    solution:
      'Extraje el checkout a una aplicación independiente que consume la API existente, y lo desplegué detrás del mismo dominio con un reverse proxy para poder migrar por porcentaje de tráfico en vez de de golpe.',
    role: 'Yo diseñé el sistema de componentes de formulario y migré los pasos de dirección, envío y pago. La API y la infraestructura las llevó el equipo de plataforma.',
    // outcome: se deja fuera a propósito hasta tener un número real y publicable.
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    links: { live: undefined, repo: undefined },
    visibility: 'private',
    featured: true,
    year: 2025,
  },
  {
    slug: 'panel-logistica',
    title: 'TODO: Panel de logística',
    tagline:
      'Un tablero de operaciones que dejó de ser una hoja de cálculo compartida.',
    context: 'Logística · TODO: escala',
    problem:
      'La operación diaria se coordinaba en una hoja de cálculo que abrían doce personas a la vez. Se sobrescribían cambios, nadie sabía cuál era la versión buena, y el estado real de un envío solo lo sabía quien lo hubiera tocado el último.',
    solution:
      'Construí un panel con estado en el servidor como única fuente de verdad, actualizaciones en vivo para todos los puestos y un registro de quién cambió qué y cuándo.',
    role: 'Lo hice de principio a fin: modelo de datos, API y frontend. La definición del flujo operativo salió del equipo de operaciones.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    links: { live: undefined, repo: undefined },
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'sitio-corporativo',
    title: 'TODO: Sitio corporativo',
    tagline:
      'Rendimiento y SEO reales en un sitio que antes tardaba nueve segundos en pintar.',
    context: 'Servicios profesionales · TODO: escala',
    problem:
      'El sitio corría sobre un gestor de contenidos cargado de plugins. Pesaba varios megabytes en la primera carga, no aparecía en búsquedas por los términos que importaban, y editar una página requería pedírselo a un proveedor externo.',
    solution:
      'Lo reconstruí como sitio estático generado en el build, con el contenido en ficheros versionados y las imágenes optimizadas en el pipeline. El equipo de marketing edita y publica sin intermediarios.',
    role: 'Yo hice la arquitectura, el maquetado y la migración del contenido. Los textos y la identidad los aportó el cliente.',
    outcome: 'TODO: métrica real (p. ej. LCP de 9,1 s a 1,2 s)',
    stack: ['Vite', 'React', 'TypeScript', 'Tailwind CSS'],
    links: { live: undefined, repo: undefined },
    visibility: 'public',
    featured: true,
    year: 2024,
  },
  {
    slug: 'herramienta-open-source',
    title: 'TODO: Herramienta propia',
    tagline: 'Lo que construí para dejar de repetir la misma tarea a mano.',
    context: 'Proyecto propio · código abierto',
    problem:
      'TODO: qué tarea repetitiva dolía lo suficiente como para justificar construir una herramienta.',
    solution: 'TODO: qué hace la herramienta y cómo se usa.',
    role: 'Proyecto propio, de principio a fin.',
    stack: ['TypeScript', 'Node.js'],
    links: { repo: 'https://github.com/TODO/TODO' },
    visibility: 'public',
    featured: false,
    year: 2023,
  },
]
