import type { Project } from '../types'

/**
 * TODO(content): placeholders. These are written in English on purpose — the
 * Spanish version is not the source to translate from. Each locale gets its
 * own wording (CLAUDE.md §3).
 *
 * Keep `slug` identical across locales: the language switcher relies on it to
 * stay on the same project when you change language.
 */
export const projects: Project[] = [
  {
    slug: 'plataforma-pedidos',
    title: 'TODO: Ordering platform',
    tagline: 'Rebuilding a retail checkout without losing a day of sales.',
    context: 'Retail · TODO: scale',
    problem:
      'Checkout lived inside an eight-year-old monolith. Changing the payment form meant redeploying everything, so in practice nobody touched it.',
    solution:
      'I pulled checkout out into its own app against the existing API, served behind the same domain through a reverse proxy so traffic could move over gradually.',
    role: 'I designed the form component system and migrated the address, shipping and payment steps. The platform team owned the API and infrastructure.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    links: {},
    visibility: 'private',
    featured: true,
    year: 2025,
  },
  {
    slug: 'panel-logistica',
    title: 'TODO: Operations dashboard',
    tagline: 'An operations board that replaced a shared spreadsheet.',
    context: 'Logistics · TODO: scale',
    problem:
      'Daily operations ran on a spreadsheet twelve people had open at once. Edits overwrote each other and nobody knew which copy was current.',
    solution:
      'I built a dashboard with server state as the single source of truth, live updates across every desk, and an audit trail of who changed what.',
    role: 'End to end: data model, API and frontend. The operations team defined the workflow.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'sitio-corporativo',
    title: 'TODO: Corporate site',
    tagline: 'Real performance and SEO on a site that used to take nine seconds to paint.',
    context: 'Professional services · TODO: scale',
    problem:
      'The site ran on a plugin-heavy CMS. Multiple megabytes on first load, invisible for the search terms that mattered, and every edit went through an outside vendor.',
    solution:
      'I rebuilt it as a static site generated at build time, content in version control, images optimised in the pipeline. Marketing publishes without a middleman.',
    role: 'I did the architecture, the build and the content migration. The client supplied copy and identity.',
    outcome: 'TODO: real metric',
    stack: ['Vite', 'React', 'TypeScript', 'Tailwind CSS'],
    links: {},
    visibility: 'public',
    featured: true,
    year: 2024,
  },
  {
    slug: 'herramienta-open-source',
    title: 'TODO: Own tool',
    tagline: 'What I built to stop doing the same thing by hand.',
    context: 'Personal project · open source',
    problem: 'TODO: which repetitive task hurt enough to justify a tool.',
    solution: 'TODO: what it does and how it is used.',
    role: 'Personal project, end to end.',
    stack: ['TypeScript', 'Node.js'],
    links: { repo: 'https://github.com/TODO/TODO' },
    visibility: 'public',
    featured: false,
    year: 2023,
  },
]
