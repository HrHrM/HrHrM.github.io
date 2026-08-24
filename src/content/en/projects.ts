import type { Project } from '../types'

/**
 * Metadata (year, stack, visibility) comes from the CV and is firm. What stays
 * TODO is the prose.
 *
 * Keep `slug` identical to the Spanish bundle: the language switcher relies on
 * it to stay on the same project when you change language.
 *
 * The first three are `nda`: the employer is named in Experience — it is on the
 * CV and on LinkedIn — but nothing here shows architecture, business numbers,
 * internal dashboards or code. Hence descriptive titles rather than the
 * client's product name.
 */
export const projects: Project[] = [
  {
    slug: 'proyectos-web-y-movil',
    title: 'TODO: one specific project',
    tagline: 'TODO: one line. What it was and why it mattered.',
    context: 'TODO: sector · scale',
    problem: 'TODO: what was broken or missing before you arrived.',
    solution:
      'TODO: what you built, and which technical decision could have gone the other way.',
    role: 'TODO: what you did, first person. What the team did, third person.',
    stack: ['React', 'React Native', 'TypeScript'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2025,
  },
  {
    slug: 'plataforma-multicliente',
    title: 'Multi-client admin platform',
    tagline:
      'TODO: one line. A system that had to fit several clients without being forked.',
    context: 'TODO: sector · how many clients',
    problem: 'TODO: what hurt, and why nobody had fixed it already.',
    solution: 'TODO: how you handled modularity, and what you ruled out.',
    role: 'TODO: your contribution, separated from the team.',
    stack: ['Angular', 'TypeScript', 'REST APIs'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2024,
  },
  {
    slug: 'app-gama-baja',
    title: 'Data app for low-end devices',
    tagline: 'TODO: one line. Live data on phones that cannot spare much.',
    context: 'TODO: sector · how many users · which device tier',
    problem:
      'TODO: what "low-resource" meant concretely. What broke on those phones.',
    solution: 'TODO: what made it work there, and what you traded away.',
    role: 'TODO: your contribution, separated from the team.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    links: {},
    visibility: 'nda',
    featured: true,
    year: 2023,
  },
  {
    slug: 'lector-texto-a-voz',
    title: 'Text-to-speech reader',
    tagline: 'TODO: one line. Who it was for and what it solved.',
    context: 'Thesis project · Universidad Alejandro de Humboldt',
    problem: 'TODO: why text-to-speech. Who it helped.',
    solution: 'TODO: how you built it and what was hard.',
    role: 'Personal project, end to end.',
    stack: ['React Native', 'JavaScript', 'Text-to-Speech'],
    links: {
      repo: undefined,
    },
    visibility: 'public',
    featured: true,
    year: 2022,
  },
]
