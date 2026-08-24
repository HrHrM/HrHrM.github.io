import type { Project } from '../types'

/**
 * Los metadatos (año, stack, visibility) salen del CV y son firmes.
 * Lo que queda en TODO es la prosa: contexto, problema, solución, rol, resultado.
 *
 * Los tres primeros van en `nda`: la empresa se nombra en Experiencia —está en
 * el CV y en LinkedIn—, pero aquí no se enseña arquitectura, números de negocio,
 * capturas de paneles internos ni código. Por eso el título es descriptivo y no
 * el nombre del producto del cliente.
 */
export const projects: Project[] = [
  {
    slug: 'proyectos-web-y-movil',
    // TODO(título): elegir UN proyecto concreto de Galilei. "Proyectos web y
    // móviles" es un puesto, no un caso de estudio.
    title: 'TODO: un proyecto concreto',
    tagline: 'TODO: una línea. Qué era y por qué importaba.',
    context: 'TODO: sector · escala',
    problem: 'TODO: qué estaba roto o faltaba antes de que llegaras.',
    solution: 'TODO: qué construiste, y qué decisión técnica tomaste que pudo haber sido otra.',
    role: 'TODO: qué hiciste tú, en primera persona. Qué hizo el resto del equipo, en tercera.',
    stack: ['React', 'React Native', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Plataforma administrativa multi-cliente',
    tagline:
      'TODO: una línea. Un sistema que había que adaptar a varios clientes sin duplicarlo.',
    context: 'TODO: sector · cuántos clientes',
    problem: 'TODO: qué dolía. Por qué no se había resuelto antes.',
    solution:
      'TODO: cómo resolviste la modularidad, y qué alternativa descartaste.',
    role: 'TODO: tu aporte concreto, separado del equipo.',
    stack: ['Angular', 'TypeScript', 'APIs REST'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-gama-baja',
    title: 'App de gestión para dispositivos de gama baja',
    tagline:
      'TODO: una línea. Datos en tiempo real en teléfonos que no dan para mucho.',
    context: 'TODO: sector · cuántos usuarios · qué gama de dispositivo',
    problem:
      'TODO: qué significaba "bajos recursos" en concreto. Qué fallaba en esos teléfonos.',
    solution:
      'TODO: qué hiciste para que funcionara ahí, y qué sacrificaste a cambio.',
    role: 'TODO: tu aporte concreto, separado del equipo.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    // El único que puede tener link y repo: es tuyo. Carga el peso de demostrar
    // que el código existe, así que conviene que esté publicado y limpio.
    slug: 'lector-texto-a-voz',
    title: 'Lector de texto a voz',
    tagline: 'TODO: una línea. Para quién era y qué problema resolvía.',
    context: 'Proyecto de tesis · Universidad Alejandro de Humboldt',
    problem: 'TODO: por qué elegiste texto a voz. A quién le servía.',
    solution: 'TODO: cómo lo construiste y qué fue lo difícil.',
    role: 'Proyecto propio, de principio a fin.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: {
      // TODO(repo): publicar el repo y poner la URL. Sin esto, el único
      // proyecto que puede demostrar código no demuestra nada.
      repo: undefined,
    },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
