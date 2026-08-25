import type { UIStrings } from '../types'

/** Written, not translated. Keep it shorter and blunter than the Spanish. */
export const ui: UIStrings = {
  nav: {
    projects: 'Work',
    about: 'About',
    stack: 'Stack',
    experience: 'Experience',
    contact: 'Contact',
    menu: 'Open menu',
    primary: 'Main navigation',
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Software Developer · Caracas',
    headline: 'I build interfaces that hold up in production.',
    cta: 'See the work',
    scrollHint: 'Keep scrolling',
  },
  seo: {
    titleSuffix: 'Software Developer',
    description:
      'Software developer in Caracas. I build web and mobile apps with React, Angular, Flutter and Node.js. Case studies from real client work, not tutorials.',
  },
  about: {
    paragraphs: [
      'I work on web and mobile apps: React and Angular in the browser, Flutter and React Native on the phone, and the REST APIs and Firebase behind them. Most of what I have built belongs to clients or employers, so a lot of it cannot be shown from the inside — which is why this page is case studies rather than screenshots.',
      'What actually interests me is what happens after something ships and has to change: migrating without stopping sales, touching a form nobody has opened in years, leaving code the next person will not have to guess at. In a code review I look at naming and module boundaries first.',
      'Outside work I am much the same, only more stubborn about it. I learn slowly and by repetition, and I do not mind it taking a while — what bothers me is ending a month where I started it.',
    ],
  },
  sections: {
    projects: {
      title: 'Work',
      lead: 'Four cases. The problem, what I built, what changed.',
    },
    about: { title: 'About' },
    stack: {
      title: 'Stack',
      lead: "What I use daily and would defend in a code review.",
    },
    experience: { title: 'Experience', education: 'Education' },
    contact: {
      title: 'Contact',
      lead: 'If any of this fits what you need, get in touch.',
    },
  },
  project: {
    context: 'Context',
    problem: 'Problem',
    solution: 'Solution',
    role: 'My role',
    outcome: 'Outcome',
    stack: 'Stack',
    codePrivate: 'Private code',
    underNda: 'Under NDA',
    viewLive: 'View live',
    viewRepo: 'View repo',
    readCase: 'Read the case',
    present: 'Present',
  },
  contact: {
    email: 'Email me',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Download CV',
  },
  footer: {
    builtWith: 'Built with React, Tailwind and static prerendering.',
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
    title: 'This page does not exist',
    body: 'The link may be wrong, or the page moved.',
    back: 'Back to home',
  },
}
