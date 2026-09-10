import type { UIStrings } from '../types'

/** Written, not translated. Tighter and blunter than the Spanish. */
export const ui: UIStrings = {
  nav: {
    projects: 'Work',
    about: 'About Me',
    stack: 'Stack',
    experience: 'Experience',
    contact: 'Contact',
    menu: 'Open menu',
    primary: 'Main navigation',
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Software Developer · Caracas, Venezuela',
    tagline: 'Developing scalable web and mobile applications.',
    taglineAccent: 'scalable',
    cta: 'View experience',
    facts: [
      { label: 'Experience', value: '+4 years in the industry' },
      { label: 'Companies', value: '3 · Enterprise and multi-client' },
      { label: 'Core', value: 'React · Angular · Flutter' },
    ],
  },
  seo: {
    titleSuffix: 'Software Developer',
    description:
      'Software developer building scalable web and mobile apps with React, Angular, and Flutter. Case studies focused on architecture, trade-offs, and performance.',
  },
  about: {
    paragraphs: [
      'I build web and mobile interfaces: React and Angular in the browser, Flutter and React Native on devices, backed by REST APIs and Firebase. Because most of my work belongs to private clients, this site documents architecture and trade-offs rather than production screenshots.',
      'My focus centers on maintainability after launch: redesigning active workflows without breaking user habits, decoupling shared business logic, and stabilizing apps on constrained hardware. In code reviews, I prioritize explicit naming and clean module boundaries.',
      'I work iteratively and value systematic progress. My measure of growth is steady architectural discipline over short-term shortcuts.',
    ],
  },
  sections: {
    projects: {
      title: 'Work',
      lead: 'Five engineering case studies: constraints, architecture, and outcomes.',
    },
    about: { title: 'About Me' },
    stack: {
      title: 'Stack',
      lead: 'Core technologies used in production and defended in code reviews.',
    },
    experience: { title: 'Experience', education: 'Education' },
    contact: {
      title: 'Contact',
      lead: 'Available for full-time frontend roles. Reach out directly below.',
    },
  },
  project: {
    problem: 'Problem',
    solution: 'Solution',
    role: 'My role',
    outcome: 'Outcome',
    codePrivate: 'Private code',
    underNda: 'Under NDA',
    viewLive: 'View live',
    viewRepo: 'View repo',
    present: 'Present',
  },
  contact: {
    email: 'Email me',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Download CV',
  },
  footer: {
    builtWith: 'Built with React, Tailwind, and static prerendering.',
    rights: 'All rights reserved.',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  locale: {
    label: 'Language',
    es: 'ES',
    en: 'EN',
  },
  notFound: {
    title: 'This page does not exist.',
    body: 'The link might be broken, or the page has moved.',
    back: 'Back to home',
  },
  error: {
    notFound: 'This page does not exist.',
    unexpected: 'An unexpected error occurred. Please try again.',
    backHome: 'Back to home',
  },
}
