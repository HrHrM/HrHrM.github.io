import type { Project } from '../types'

/**
 * Written, not translated — tighter than the Spanish, which is how English
 * reads naturally here.
 *
 * Keep `slug` identical to the Spanish bundle: the language switcher relies on
 * it to stay on the same project when you change language.
 *
 * The client projects are `nda`: the employer is named in Experience — it is on
 * the CV and on LinkedIn — but there is no internal architecture, no business
 * numbers, no dashboards and no code here. End-client sectors are given without
 * naming the clients.
 */
export const projects: Project[] = [
  {
    slug: 'suite-administrativa',
    title: 'Multi-Client Admin Suite',
    tagline:
      'Restructuring fractured administrative web workflows for the Galilei 360 ecosystem (GaliSuite).',
    context:
      'Enterprise suite · ~20 internal operators, multiple corporate accounts',
    problem:
      'The suite aggregated payments, invoicing, fleet tracking, and order management into siloed modules. Legacy interface patterns forced operators through deep screen hierarchies and repetitive workflows, compounding errors.',
    solution:
      'Rebuilt core navigation around task-oriented paths, cutting interaction depth per transaction. Migrated legacy modules iteratively to protect day-to-day production operations.',
    role: 'Key frontend participation. Implemented client-facing interfaces, integrated REST APIs, and built layout logic over legacy administrative modules.',
    // TODO(outcome): if you can count the clicks or screens of ONE concrete
    // flow before and after, that is the most convincing number you have.
    stack: ['React', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'ecosistema-movil-galilei',
    title: 'Multi-Role Mobile Ecosystem',
    tagline:
      'Location-aware field clients and real-time BI dashboards for the Galilei 360 enterprise suite (Galisales, GaliMate, and Gali-bi).',
    context:
      'Enterprise suite · 3 role-specific mobile apps (sales, supervision, management)',
    problem:
      'Field teams and managers lacked synchronized data access. Operations required background geolocation tracking for reps and high-level analytics for executives without fragmenting the underlying database.',
    solution:
      'Engineered a suite of role-specific React Native applications sharing unified core logic. Integrated location services for field reps and dynamic data visualization for management.',
    role: 'Cross-platform mobile development and architecture. Maximized component reuse across distinct mobile clients to accelerate delivery.',
    stack: ['React Native', 'TypeScript', 'Geolocation', 'REST APIs'],
    // This is the Venezuelan Play Store listing: from abroad it may answer
    // "not available in your country", so the link does not always prove what
    // it promises to a recruiter outside the country.
    links: {
      store: 'https://play.google.com/store/apps/details?id=com.galisales.app',
    },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'sitio-corporativo-galilei',
    title: 'Galilei Corporate Website',
    tagline:
      'Production-ready main portal and services showcase for Galilei Smart Solutions.',
    context: 'Corporate web platform · Public',
    problem:
      'The company needed a robust, fully responsive web presence built against external agency mockups, removing technical dependency on third-party studios for product updates.',
    solution:
      'Built the autonomous full web client in React and TypeScript, resolving responsive breakpoints, fluid layout shifts, and missing UI states directly during development.',
    role: 'End-to-end solo frontend development. The design came from a third-party agency; architecture, component structure, and markup were delivered independently, accelerated by AI sub-agents and spec-kit workflows.',
    stack: ['React', 'TypeScript', 'Claude Code', 'spec-kit'],
    links: { live: 'https://galilei.com.ve/' },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Modular Permission Web Platform',
    tagline:
      'Custom role-engine and dynamic routing for the Pegasus Connect enterprise system.',
    context:
      'Software consultancy · 4 corporate clients (Telecom, Banking, Cinema and Leisure)',
    problem:
      'The core web product served four corporate clients with entirely distinct operational requirements. The codebase risked permanent bifurcation into separate repositories.',
    solution:
      'Implemented a dynamic role-based permission system and modular routing that rendered custom suites per client from a single instance. Extracted repeated logic into shared utility functions.',
    role: 'Development of administrative modules and permission engine. Integrated REST APIs and defined technical data contracts with the backend team.',
    outcome:
      'Eliminated the need to fork the codebase, accelerating overall development and improving component reusability across the frontend team.',
    stack: ['Angular', 'TypeScript', 'REST APIs'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-punto-de-venta',
    title: 'POS Terminal Management App',
    tagline:
      'Real-time Flutter client explicitly optimized for low-resource point-of-sale hardware.',
    context: 'Low-spec Android POS hardware',
    problem:
      'Conventional mobile development patterns overwhelmed the target hardware due to severe memory ceilings. State volume and image caching had to be strictly managed to prevent crashes.',
    solution:
      'Architected the Flutter foundation with strictly paginated payloads and client-side memory limits. Managed real-time synchronization via Firebase, optimizing data payloads before they reached the device.',
    role: 'Initial project architecture: screen structure, data layer, and Firebase integration. Set the architectural standards for the rest of the development lifecycle.',
    outcome:
      'Deliberate prioritization of memory efficiency over visual details, achieving reliable operation on low-power POS hardware.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    // The new tag list dropped "Under NDA" for this one, but did not say the
    // NDA had lifted. It stays: removing a confidentiality mark is the
    // client's call, not a layout decision.
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'comunicador-caa',
    title: 'AAC Communicator for Non-Verbal Users',
    tagline:
      'Icons and typed text turned into speech for people who cannot produce it themselves.',
    context: 'Thesis project · Universidad Alejandro de Humboldt',
    problem:
      'Dedicated Augmentative and Alternative Communication devices are prohibitively expensive, creating a hard access barrier for people with speech disabilities.',
    solution:
      'Built a React Native application where tapping icons or typing text makes the phone speak it aloud through speech synthesis, so sentences can be assembled fast enough to hold a conversation.',
    role: 'Solo academic project: requirements analysis, mobile development, and technical documentation.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: { repo: 'https://github.com/HrHrM/ReactN-Tesis' },
    visibility: 'public',
    // Out of the section: the new five-card list does not include it, and the
    // mobile ecosystem takes its place. The data stays rather than being
    // deleted — the thesis is still named under Education — and it comes back
    // by flipping this to `true`.
    featured: false,
    year: 2022,
  },
]
