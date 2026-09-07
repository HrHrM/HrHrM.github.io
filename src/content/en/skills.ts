import type { SkillGroup } from '../types'

/**
 * Only what the CV backs up. No levels, no percentage bars (CLAUDE.md §4).
 *
 * Groups separate real categories: languages do not sit with frameworks, and
 * Firebase — a managed service, not a library — does not sit with React.
 */
export const skills: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Dart', 'HTML', 'CSS / SASS'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & libraries',
    items: ['React', 'React Native', 'Angular', 'Flutter', 'Node.js'],
  },
  {
    id: 'services',
    label: 'Services & integration',
    items: ['Firebase', 'REST APIs'],
  },
  {
    id: 'tooling',
    label: 'Tooling & methodology',
    items: [
      'Git',
      'Claude Code (MCP, sub-agents)',
      'Playwright',
      'Maestro',
      'Figma',
      'Agile/SCRUM',
    ],
  },
  {
    id: 'spoken',
    label: 'Spoken languages',
    items: ['Spanish — native', 'English — B2 professional'],
  },
]
