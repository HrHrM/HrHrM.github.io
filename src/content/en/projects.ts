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
    title: 'Multi-client admin suite',
    tagline:
      'Rebuilding the paths through a tool suite instead of stretching the flow it inherited.',
    context: 'Business suite · ~20 internal users and several clients',
    problem:
      'The suite gathers tools with little in common: payment records, invoicing, map tracking, products and orders. Each had grown on its own and carried interface decisions made years earlier, so ordinary tasks meant crossing several screens and a fair number of clicks. Older views also came with bugs and code that was hard to touch.',
    solution:
      'Rather than extend the flow already in place, I rebuilt the paths from how this kind of task is solved today: fewer screens per task, fewer clicks to the same result. It was a debatable call and I made it deliberately — following the established pattern would have shipped faster — but every new screen added on top of the old flow would inherit the problem. Older views moved to the new design and flow gradually, not in one cut.',
    role: 'I am the only frontend developer on the team. I work with three backend developers, and my part is making sure everything they expose reaches the user with the best interface it can have. Recent projects have a general designer, but the detail — states, edge cases, how each screen actually behaves — lands on me.',
    stack: ['React', 'React Native', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'sitio-corporativo-galilei',
    title: 'Corporate website',
    tagline: "The company's public site, built end to end.",
    context: 'Corporate site · public',
    problem:
      'The company needed its public site built from an agreed design, working on mobile, without depending on an outside vendor for every change.',
    solution:
      'I built the whole thing against the design I was given, resolving what a static mockup never specifies: states, mobile behaviour, and the details that only surface once it runs.',
    role: 'The build is mine, end to end. The design is not: it arrived defined and my job was to implement it faithfully.',
    stack: ['React', 'TypeScript'],
    links: { live: 'https://galilei.com.ve/' },
    visibility: 'public',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Web platform with modular permissions',
    tagline:
      'A multi-role menu that gave each client its own instance without forking the project.',
    context:
      'Software consultancy · 4 corporate clients (telecoms, banking, cinema and leisure)',
    problem:
      'The main web product served four corporate clients at once, each arriving with its own requirements: cinema features, restaurant features, sectors with nothing in common. Very little was actually broken, but the code was not ready to absorb that without repeating itself, and every new requirement pushed towards keeping one version per client.',
    solution:
      'I built a multi-role menu with modular permissions, so each client got its own menu instance on the same project instead of a fork. Alongside that I pulled the repeated pieces into shared functions, so the next requirement would not mean writing them again.',
    role: 'There were two of us on frontend. I integrated the REST APIs of the main web ecosystem, agreeing in meetings with the backend team on what they needed to expose — the contract came out of those meetings rather than arriving fixed.',
    outcome:
      'Development got faster: a lot of pieces became reusable, which lifted the whole frontend team, not just my own output.',
    stack: ['Angular', 'TypeScript', 'REST APIs'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-punto-de-venta',
    title: 'Management app for POS terminals',
    tagline:
      'Live data on Android POS hardware, where there is almost no headroom.',
    context: 'Low-end Android POS terminals',
    problem:
      'The app had to run on Android POS terminals, not phones: hardware with very little memory and compute headroom. Nothing was broken — the constraint was the starting point. Any pattern that assumed a normal device (loading a full list, untreated images, state that grows without bound) would overload the terminal.',
    solution:
      'I built the app foundation in Flutter with paginated loading against Firebase, so no screen held more in memory than it needed, and with images optimised before they reached the device. Firebase handled real-time sync on its own queries.',
    role: 'I started the project from scratch and built the foundation it kept growing on. Later the app passed to someone else.',
    outcome:
      'Giving something up was the deliberate part: I traded visual polish so the app would hold on the hardware. On a POS that is the right exchange, and I would rather decide it up front than discover it in production.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'comunicador-caa',
    title: 'Communication aid for non-speaking users',
    tagline:
      'Icons and text turned into speech, for people who cannot produce it.',
    context: 'Thesis project · Universidad Alejandro de Humboldt',
    problem:
      'Someone with a speech disability needs something to speak for them, and it needs to be the device they already carry: their phone. The barrier is not only technical but one of access — a dedicated AAC device is expensive and not everyone can have one.',
    solution:
      'A React Native app where you tap an icon or type text and the phone says it out loud through speech synthesis. The icons let someone build a sentence without typing, which is what matters when typing every word is far too slow for a conversation.',
    role: 'My own project, end to end: it was my thesis work.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: { repo: 'https://github.com/HrHrM/ReactN-Tesis' },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
