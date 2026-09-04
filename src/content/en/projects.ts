import type { Project } from '../types'

/**
 * Written, not translated — tighter than the Spanish, which is how English
 * reads naturally here.
 *
 * Keep `slug` identical to the Spanish bundle: the language switcher relies on
 * it to stay on the same project when you change language.
 *
 * The three client projects are `nda`: the employer is named in Experience — it
 * is on the CV and on LinkedIn — but there is no internal architecture, no
 * business numbers, no dashboards and no code here. End-client sectors are
 * given without naming the clients.
 */
export const projects: Project[] = [
  {
    slug: 'suite-administrativa',
    title: 'Multi-Client Admin Suite',
    tagline:
      'Restructuring fractured administrative workflows into a unified, consolidated flow.',
    context:
      'Enterprise suite · ~20 internal operators and external corporate accounts',
    problem:
      'The suite aggregated payments, invoicing, fleet tracking, and order management into siloed modules. Legacy interface patterns forced operators through deep screen hierarchies and repetitive multi-click workflows, compounding navigation errors.',
    solution:
      'Rebuilt core navigation around task-oriented paths rather than departmental silos, cutting total interaction depth per transaction. Migrated legacy modules iteratively to protect day-to-day operations while establishing modern interface conventions.',
    role: 'Sole frontend responsibility. Implementation of client-facing interfaces, integration against REST APIs, and definition of UI states, input validation, and layout logic on top of base designs.',
    stack: ['React', 'React Native', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'sitio-corporativo-galilei',
    title: 'Galilei Corporate Website',
    tagline:
      'Production-ready marketing and services portal delivered from design to release.',
    context: 'Corporate web platform · Public',
    problem:
      'The company needed a robust, fully responsive corporate presence built against approved mockups, removing technical dependency on external web studios for updates.',
    solution:
      'Built the full web client in React and TypeScript, resolving responsive breakpoints, fluid layout shifts, and missing UI states directly during development.',
    role: 'End-to-end frontend development. UI design provided by external agency; architecture, component structure, markup, and responsive implementations delivered independently.',
    stack: ['React', 'TypeScript'],
    links: { live: 'https://galilei.com.ve/' },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Enterprise Multi-Tenant Platform',
    tagline:
      'Role-based permission architecture supporting four corporate clients on a single codebase.',
    context:
      'Software consultancy · 4 corporate clients (Telecommunications, Banking, Entertainment, Hospitality)',
    problem:
      'Four distinct enterprise clients required vastly different operational features inside the same core application. The existing codebase risked branching into hard client forks, multiplying maintenance overhead.',
    solution:
      'Implemented a dynamic, role-based permission system and modular navigation that rendered custom feature suites per client from a shared application core. Extracted common business logic into shared frontend services.',
    role: 'Development of admin modules and permissions engine. Integration of ecosystem REST APIs and technical agreement on data payload contracts with backend engineers.',
    outcome:
      'Eliminated the need for code forks, standardizing cross-client feature delivery and improving release velocity across the frontend team.',
    stack: ['Angular', 'TypeScript', 'REST APIs'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-punto-de-venta',
    title: 'POS Hardware Operations App',
    tagline:
      'Low-latency operational client engineered for resource-constrained Android POS terminals.',
    context: 'Low-spec Android POS hardware',
    problem:
      'Standard mobile development patterns overloaded the target hardware due to severe memory ceilings. Data volume had to be tightly managed to prevent application dropouts during operations.',
    solution:
      'Architected the application foundation in Flutter with strictly paginated queries and client-side memory caps. Managed live state sync through targeted Firebase listeners, optimizing payload footprints before consumption.',
    role: 'Initial project architecture: structural UI foundation, caching layers, and Firebase integration. Established code standards for downstream contributors.',
    outcome:
      'Prioritized memory efficiency and runtime stability over non-essential graphical overhead, achieving dependable operation on low-power hardware.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'comunicador-caa',
    title: 'AAC Mobile Communicator',
    tagline: 'Accessible mobile speech synthesis for non-verbal individuals.',
    context: 'Undergraduate Thesis · Universidad Alejandro de Humboldt',
    problem:
      'Dedicated Augmentative and Alternative Communication (AAC) hardware carries prohibitive cost barriers, restricting access for individuals with speech and motor disabilities.',
    solution:
      'Developed an accessible React Native client utilizing custom icon grids and text-to-speech engines, enabling rapid sentence construction and vocalization directly from standard smartphones.',
    role: 'Individual engineering project: user requirements, mobile development, testing, and technical documentation.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: { repo: 'https://github.com/HrHrM/ReactN-Tesis' },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
