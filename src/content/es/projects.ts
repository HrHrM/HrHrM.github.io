import type { Project } from '../types'

/**
 * Orden: se ordena por año descendente, y el desempate lo da el orden de este
 * array (Array.sort es estable). La suite de Galilei va primera a propósito.
 *
 * Los tres proyectos de cliente van en `nda`: la empresa se nombra en
 * Experiencia —está en el CV y en LinkedIn—, pero aquí no hay arquitectura
 * interna, números de negocio, capturas de paneles ni código. Los sectores de
 * los clientes finales se dan sin nombrarlos, que es lo que pide el §5.
 */
export const projects: Project[] = [
  {
    slug: 'suite-administrativa',
    title: 'Suite administrativa multi-cliente',
    tagline:
      'Rehacer los recorridos de una suite de herramientas en vez de seguir estirando el flujo heredado.',
    context: 'Suite empresarial · ~20 usuarios internos y varios clientes',
    problem:
      'La suite reúne herramientas que no se parecen entre sí: información de pagos, facturación, rastreo en mapa, productos y pedidos. Cada una había crecido por su lado y arrastraba decisiones de interfaz de hace años, así que tareas corrientes pedían recorrer varias pantallas y bastantes clics. A eso se sumaban vistas antiguas con errores y con código que costaba tocar.',
    solution:
      'En vez de extender el flujo que ya existía, rehíce los recorridos partiendo de cómo se resuelve hoy este tipo de tarea: menos pantallas por tarea y menos clics para llegar al mismo resultado. Fue una decisión discutible y la tomé a conciencia — seguir el patrón que ya estaba habría sido más rápido de entregar — pero cada pantalla nueva que se añadiera sobre el flujo viejo heredaba el problema. Las vistas antiguas fueron pasando al diseño y al flujo nuevo de forma progresiva, no de golpe.',
    role: 'Soy el único frontend del equipo. Trabajo con tres desarrolladores de backend y mi parte es que todo lo que ellos exponen llegue al usuario con la mejor interfaz posible. En los proyectos recientes hay un diseñador general, pero el detalle —los estados, los casos límite, el comportamiento real de cada pantalla— cae de mi lado.',
    // TODO(resultado): si puedes contar los clics o las pantallas de UN flujo
    // concreto antes y después, ese es el número más convincente que tienes.
    // Ejemplo: "registrar un pedido pasó de 4 pantallas y 11 clics a 2 y 5".
    stack: ['React', 'React Native', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'sitio-corporativo-galilei',
    title: 'Sitio corporativo',
    tagline: 'El sitio público de la empresa, programado de principio a fin.',
    context: 'Sitio corporativo · público',
    problem:
      'La empresa necesitaba su sitio público construido a partir de un diseño ya definido, funcionando en móvil y sin depender de un proveedor externo para cada cambio.',
    solution:
      'Lo programé completo siguiendo el diseño entregado, resolviendo el paso de la maqueta al comportamiento real: estados, adaptación a móvil y los detalles que un diseño estático no especifica.',
    role: 'La programación es mía, de principio a fin. El diseño no: lo recibí ya definido y mi trabajo fue implementarlo con fidelidad.',
    stack: ['React', 'TypeScript'],
    links: { live: 'https://galilei.com.ve/' },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Plataforma web con permisos modulares',
    tagline:
      'Un menú multi-rol que dio a cada cliente su propia instancia sin duplicar el proyecto.',
    context:
      'Consultoría de software · 4 clientes corporativos (telecomunicaciones, banca, cine y entretenimiento)',
    problem:
      'El proyecto web principal servía a cuatro clientes corporativos a la vez, y cada uno llegaba con requisitos propios: funciones de cine, de restaurantes, de sectores que no se parecían en nada. Casi nada fallaba, pero el código no estaba preparado para absorber esa suma sin repetirse, y cada requisito nuevo empujaba hacia mantener una versión por cliente.',
    solution:
      'Implementé un menú multi-rol con permisos modulares: cada cliente pasó a tener su propia instancia de menús sobre el mismo proyecto, sin bifurcar el código. En paralelo saqué a funciones reutilizables las piezas que se repetían, para que el siguiente requisito no obligara a escribirlas otra vez.',
    role: 'Éramos dos en frontend. Las APIs REST las integré yo, y antes me reunía con el equipo de backend para acordar qué necesitábamos que expusieran: el contrato salía de esas reuniones, no me llegaba cerrado.',
    outcome:
      'Programar se volvió más ágil: muchas piezas quedaron reutilizables y eso subió la productividad de todo el equipo de frontend, no solo la mía.',
    stack: ['Angular', 'TypeScript', 'APIs REST'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-punto-de-venta',
    title: 'App de gestión para terminales POS',
    tagline:
      'Datos en tiempo real en equipos POS Android, donde el margen de recursos es mínimo.',
    context: 'Terminales POS Android de gama baja',
    problem:
      'La aplicación tenía que correr en equipos POS Android, no en teléfonos: hardware con muy poco margen de memoria y de cómputo. No es que algo estuviera roto — la restricción era el punto de partida. Cualquier patrón que diera por sentado un dispositivo normal (cargar una lista completa, imágenes sin tratar, estado que crece sin límite) sobrecargaba el equipo.',
    solution:
      'Levanté la base de la app en Flutter con carga paginada contra Firebase, para no sostener en memoria más de lo que hiciera falta en cada pantalla, y con las imágenes optimizadas antes de llegar al dispositivo. La sincronización en tiempo real la resolvía Firebase en sus propias consultas.',
    role: 'Arranqué el proyecto desde cero y construí la base sobre la que siguió creciendo. Más adelante la aplicación pasó a manos de otra persona.',
    outcome:
      'La renuncia fue deliberada: sacrifiqué acabado visual para que la app se sostuviera en el equipo. En un POS ese es el intercambio correcto, y preferí decidirlo de entrada antes que descubrirlo en producción.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'comunicador-caa',
    title: 'Comunicador para personas sin habla',
    tagline:
      'Iconos y texto que se convierten en voz, para quien no puede producirla.',
    context: 'Proyecto de tesis · Universidad Alejandro de Humboldt',
    problem:
      'Una persona con discapacidad del habla necesita algo que hable por ella, y necesita que sea lo que ya lleva encima: el teléfono. La barrera no es solo técnica, también es de acceso — un dispositivo dedicado de comunicación asistida es caro y no todo el mundo puede tenerlo.',
    solution:
      'Una aplicación móvil en React Native donde se pulsa un icono o se escribe un texto y el teléfono lo reproduce en voz alta mediante síntesis de voz. Los iconos permiten construir frases sin escribir, que es lo que marca la diferencia cuando teclear cada palabra resulta demasiado lento para una conversación.',
    role: 'Proyecto propio, de principio a fin: fue mi trabajo de tesis.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: { repo: 'https://github.com/HrHrM/ReactN-Tesis' },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
