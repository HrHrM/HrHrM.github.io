import type { SkillGroup } from '../types'

/** Only what the CV backs up. No levels, no percentage bars (CLAUDE.md §4). */
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
    label: 'Backend & integration',
    items: ['Node.js', 'REST APIs', 'Firebase'],
  },
  {
    id: 'tooling',
    label: 'Tooling',
    items: ['Git', 'JIRA', 'Slack', 'SCRUM', 'Figma'],
  },
]
