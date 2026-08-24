import type { EducationItem, ExperienceItem } from '../types'

/**
 * Written, not translated — tighter and more direct than the Spanish, which is
 * how English reads naturally here.
 */
export const experience: ExperienceItem[] = [
  {
    company: 'Galilei Smart Solutions',
    role: 'Frontend Developer · React',
    start: '2025-04',
    end: null,
    summary:
      "Maintaining and extending the company's main product, plus web and mobile projects taken end to end.",
    highlights: [
      'Refactored existing code and shipped new features to improve the performance and scalability of the main product.',
      'Worked end to end on web and mobile projects in React and React Native — design, implementation, production release.',
      'Folded AI tooling into my own workflow to move faster on writing, debugging and problem-solving.',
    ],
  },
  {
    company: 'Pegaso Consulting',
    role: 'Frontend Developer · Angular',
    start: '2023-11',
    end: '2024-11',
    summary:
      'Admin features for the main web product — a system that had to fit several clients without being forked for each one.',
    highlights: [
      'Built admin features in Angular, improving modularity so the system could be adapted per client.',
      'Designed and integrated REST APIs across the main web ecosystem for faster, more reliable data exchange.',
      'Cut component complexity through refactoring, which made the code more readable and more reusable.',
    ],
  },
  {
    company: 'APPS2GO',
    role: 'Frontend Developer · Flutter',
    start: '2022-03',
    end: '2023-06',
    summary:
      'The foundation of a mobile app built to run on low-resource devices with live data.',
    highlights: [
      'Built the app foundation in Flutter, tuned for handling data on low-resource devices with real-time response.',
      'Set up Firebase as the backend: authentication, storage and user data.',
      "Turned Figma designs into working interfaces using Flutter's widget set.",
    ],
  },
]

export const education: EducationItem[] = [
  {
    institution: 'Universidad Alejandro de Humboldt',
    degree: 'Computer Engineering',
    start: '2016-09',
    end: '2022-02',
    note: 'Thesis: a React Native mobile app with text-to-speech functionality.',
  },
]
