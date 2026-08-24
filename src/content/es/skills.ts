import type { SkillGroup } from '../types'

/**
 * Solo lo que está en el CV y se sostendría en una entrevista técnica.
 * Agrupado, sin niveles ni barras de porcentaje (CLAUDE.md §4).
 */
export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      'React',
      'React Native',
      'Angular',
      'Flutter',
      'TypeScript',
      'JavaScript',
      'Dart',
      'HTML',
      'CSS / SASS',
    ],
  },
  {
    id: 'backend',
    label: 'Backend e integración',
    items: ['Node.js', 'APIs REST', 'Firebase'],
  },
  {
    id: 'tooling',
    label: 'Herramientas',
    items: ['Git', 'JIRA', 'Slack', 'SCRUM', 'Figma'],
  },
]
