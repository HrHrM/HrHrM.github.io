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
      'Reestructuración de flujos de trabajo administrativos fragmentados en un flujo consolidado y unificado.',
    context:
      'Suite empresarial · ~20 operadores internos y múltiples cuentas corporativas',
    problem:
      'La suite agrupaba pagos, facturación, rastreo y gestión de pedidos en módulos aislados. Los patrones de interfaz heredados forzaban a los operadores a navegar por jerarquías profundas de pantallas y flujos repetitivos, multiplicando los clics y los errores.',
    solution:
      'Reconstrucción de la navegación central en torno a rutas orientadas a tareas, reduciendo la profundidad de interacción por transacción. Migración iterativa de módulos heredados para proteger las operaciones diarias mientras se establecían convenciones de interfaz modernas.',
    role: 'Responsabilidad exclusiva en frontend. Implementación de interfaces para clientes, integración con APIs REST y definición de estados de UI, validación de datos y lógica de diseño sobre maquetas base.',
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
    title: 'Sitio corporativo de Galilei',
    tagline:
      'Portal corporativo y de servicios entregado desde el diseño hasta producción.',
    context: 'Plataforma web corporativa · Público',
    problem:
      'La empresa requería una presencia web robusta y totalmente responsiva construida a partir de diseños aprobados, eliminando la dependencia técnica de proveedores externos para cada actualización.',
    solution:
      'Construcción del cliente web completo en React y TypeScript, resolviendo puntos de quiebre responsivos, comportamientos en dispositivos móviles y estados de interfaz ausentes directamente durante el desarrollo.',
    role: 'Desarrollo frontend de extremo a extremo. El diseño fue provisto por una agencia de terceros; la arquitectura, estructura de componentes, marcado y comportamiento responsivo se implementaron de forma independiente.',
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
      'Arquitectura de permisos basada en roles que soporta múltiples clientes corporativos en un solo proyecto.',
    context:
      'Consultoría de software · 4 clientes corporativos (Telecomunicaciones, Banca, Cine y Ocio)',
    problem:
      'El producto web principal atendía a cuatro clientes empresariales con requisitos operativos completamente distintos. El código base corría el riesgo de bifurcarse permanentemente en versiones separadas para cada cliente, multiplicando la carga de mantenimiento.',
    solution:
      'Implementación de un sistema dinámico de permisos basado en roles y un menú modular que renderizaba suites personalizadas por cliente desde una misma instancia. Extracción de la lógica repetida en funciones compartidas.',
    role: 'Desarrollo de módulos administrativos y motor de permisos. Integración de APIs REST del ecosistema y definición técnica de contratos de datos acordados con el equipo de backend.',
    outcome:
      'Eliminación de la necesidad de bifurcar el código, acelerando el desarrollo general y mejorando la reutilización de componentes en todo el equipo frontend.',
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
      'Cliente operativo de baja latencia diseñado para terminales POS Android con recursos muy limitados.',
    context: 'Hardware POS Android de bajas especificaciones',
    problem:
      'Los patrones de desarrollo móvil convencionales sobrecargaban el hardware objetivo debido a techos severos de memoria. El volumen de estado y las imágenes debían gestionarse estrictamente para evitar que la aplicación fallara durante su uso.',
    solution:
      'Arquitectura de la base de la aplicación en Flutter con cargas estrictamente paginadas y límites de memoria del lado del cliente. Sincronización en tiempo real gestionada a través de Firebase, optimizando las imágenes y los datos antes de llegar al dispositivo.',
    role: 'Arquitectura inicial del proyecto: estructura de pantallas, capa de datos e integración con Firebase. La base estableció los patrones para el resto del desarrollo.',
    outcome:
      'Priorización deliberada de la eficiencia de memoria sobre los detalles visuales, logrando una operación confiable en hardware de baja potencia, indispensable en un entorno POS.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'comunicador-caa',
    title: 'Comunicador móvil para usuarios no verbales',
    tagline:
      'Iconos y texto convertidos en voz para personas que no pueden producirla por sí mismas.',
    context: 'Proyecto de Tesis · Universidad Alejandro de Humboldt',
    problem:
      'Los dispositivos dedicados de Comunicación Aumentativa y Alternativa (CAA) tienen costos prohibitivos, creando una fuerte barrera de acceso técnico y económico para personas con discapacidades del habla.',
    solution:
      'Desarrollo de una aplicación en React Native que permite tocar íconos o escribir texto para que el teléfono lo vocalice mediante síntesis de voz, facilitando la construcción rápida de oraciones para una conversación fluida.',
    role: 'Proyecto académico individual: análisis de requisitos, desarrollo móvil y documentación técnica.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: { repo: 'https://github.com/HrHrM/ReactN-Tesis' },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
