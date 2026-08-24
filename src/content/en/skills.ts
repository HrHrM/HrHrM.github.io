import type { SkillGroup } from '../types'

/** No levels, no percentage bars (CLAUDE.md §4). */
export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'React Router',
      'Vite',
      'Accessibility (WCAG AA)',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'PostgreSQL', 'REST', 'Supabase', 'Auth'],
  },
  {
    id: 'tooling',
    label: 'Tooling',
    items: ['Git', 'Docker', 'CI/CD', 'Vitest', 'Playwright', 'Figma'],
  },
]
