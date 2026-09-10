import type { Project } from '../types'

/**
 * Orden: se ordena por año descendente, y el desempate lo da el orden de este
 * array (Array.sort es estable). Los tres de Galilei van primeros a propósito.
 *
 * Los proyectos de cliente van en `nda`: la empresa se nombra en Experiencia
 * —está en el CV y en LinkedIn—, pero aquí no hay arquitectura interna,
 * números de negocio, capturas de paneles ni código. Los sectores de los
 * clientes finales se dan sin nombrarlos, que es lo que pide el §5.
 */
export const projects: Project[] = [
  {
    slug: 'suite-administrativa',
    title: 'Suite administrativa multi-cliente',
    tagline:
      'Reestructuración del núcleo administrativo para el ecosistema Galilei 360 en un flujo consolidado (GaliSuite).',
    context:
      'Suite empresarial · ~20 operadores internos y múltiples cuentas corporativas',
    problem:
      'La suite agrupaba pagos, facturación, rastreo y gestión de pedidos en módulos aislados. Los patrones de interfaz heredados forzaban a los operadores a navegar por jerarquías profundas de pantallas y flujos repetitivos, multiplicando los clics y los errores.',
    solution:
      'Reconstrucción de la navegación central en torno a rutas orientadas a tareas, reduciendo la profundidad de interacción por transacción. Migración iterativa de módulos heredados para proteger las operaciones diarias del sistema en producción.',
    role: 'Participación clave en el equipo de desarrollo frontend. Implementación de interfaces para clientes, integración con APIs REST y construcción de la lógica de diseño sobre los módulos administrativos.',
    // TODO(resultado): si puedes contar los clics o las pantallas de UN flujo
    // concreto antes y después, ese es el número más convincente que tienes.
    // Ejemplo: "registrar un pedido pasó de 4 pantallas y 11 clics a 2 y 5".
    stack: ['React', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'ecosistema-movil-galilei',
    title: 'Ecosistema móvil multi-rol',
    tagline:
      'Clientes de campo con geolocalización y dashboards de BI en tiempo real para la suite Galilei 360 (Galisales, GaliMate y Gali-bi).',
    context:
      'Suite empresarial · 3 apps móviles por rol (ventas, supervisión y dirección)',
    problem:
      'Los equipos de campo y los gerentes carecían de acceso sincronizado a los datos. Las operaciones requerían seguimiento de geolocalización en segundo plano para los representantes y analíticas de alto nivel para los directivos sin fragmentar la base de datos subyacente.',
    solution:
      'Arquitectura de una suite de aplicaciones en React Native específicas por rol compartiendo una lógica central unificada. Integración de servicios de ubicación para representantes de campo y visualización dinámica de datos para la gerencia.',
    role: 'Desarrollo móvil multiplataforma y arquitectura. Maximización de la reutilización de componentes entre distintos clientes móviles para acelerar la entrega.',
    stack: ['React Native', 'TypeScript', 'Geolocalización', 'APIs REST'],
    // La ficha es de la Play Store de Venezuela: fuera del país puede
    // responder «no disponible en tu región», así que este enlace no siempre
    // comprueba lo que promete para un reclutador de fuera.
    links: {
      store: 'https://play.google.com/store/apps/details?id=com.galisales.app',
    },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'sitio-corporativo-galilei',
    title: 'Sitio corporativo de Galilei',
    tagline:
      'Portal corporativo principal y escaparate de servicios para Galilei Smart Solutions.',
    context: 'Plataforma web corporativa · Público',
    problem:
      'La empresa requería una presencia web robusta y totalmente responsiva construida a partir de maquetas de una agencia externa, eliminando la dependencia técnica de proveedores para cada actualización.',
    solution:
      'Construcción autónoma del cliente web completo en React y TypeScript, resolviendo puntos de quiebre responsivos, comportamientos en dispositivos móviles y estados de interfaz ausentes directamente durante el desarrollo.',
    role: 'Desarrollo frontend individual de extremo a extremo. Arquitectura y marcado implementados utilizando flujos de trabajo acelerados por sub-agentes de IA y spec-kit, transformando el diseño de terceros en un producto final en producción.',
    stack: ['React', 'TypeScript', 'Claude Code', 'spec-kit'],
    links: { live: 'https://galilei.com.ve/' },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Plataforma web con permisos modulares',
    tagline:
      'Motor de roles personalizado y enrutamiento dinámico para el sistema empresarial Pegasus Connect.',
    context:
      'Consultoría de software · 4 clientes corporativos (Telecomunicaciones, Banca, Cine y Ocio)',
    problem:
      'El producto web principal atendía a cuatro clientes empresariales con requisitos operativos completamente distintos. El código base corría el riesgo de bifurcarse permanentemente en repositorios separados.',
    solution:
      'Implementación de un sistema dinámico de permisos basado en roles y un menú modular que renderizaba suites personalizadas por cliente desde una sola instancia. Extracción de la lógica repetida en funciones compartidas.',
    role: 'Desarrollo de módulos administrativos y motor de permisos. Integración de APIs REST y definición técnica de contratos de datos con el equipo de backend.',
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
      'Cliente en tiempo real en Flutter optimizado explícitamente para hardware de punto de venta de bajos recursos.',
    context: 'Hardware POS Android de bajas especificaciones',
    problem:
      'Los patrones de desarrollo móvil convencionales sobrecargaban el hardware objetivo debido a techos severos de memoria. El volumen de estado y las imágenes debían gestionarse estrictamente para evitar que la aplicación fallara durante su uso.',
    solution:
      'Arquitectura de la base de la aplicación en Flutter con cargas estrictamente paginadas y límites de memoria del lado del cliente. Sincronización en tiempo real gestionada a través de Firebase, optimizando las imágenes y los datos antes de llegar al dispositivo.',
    role: 'Arquitectura inicial del proyecto: estructura de pantallas, capa de datos e integración con Firebase. Establecí los estándares arquitectónicos para el resto del ciclo de desarrollo.',
    outcome:
      'Priorización deliberada de la eficiencia de memoria sobre los detalles visuales, logrando una operación confiable en hardware de baja potencia.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    // La lista de tags nueva no incluía «Bajo NDA» para este proyecto, pero
    // tampoco decía que dejara de estarlo. Se mantiene: quitar una marca de
    // confidencialidad es una decisión del cliente, no de maquetación.
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
    // Fuera de la sección: la lista nueva de cinco fichas no lo incluye, y el
    // ecosistema móvil ocupa su sitio. Se deja el dato en vez de borrarlo —la
    // tesis se sigue nombrando en Formación— y vuelve poniendo esto en `true`.
    featured: false,
    year: 2022,
  },
]
