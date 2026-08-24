import type { SkillGroup } from '../types'

/**
 * Agrupado, sin niveles ni barras de porcentaje (CLAUDE.md §4).
 * TODO(contenido): dejar solo lo que se sostendría en una entrevista técnica.
 */
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
      'Accesibilidad (WCAG AA)',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'PostgreSQL', 'REST', 'Supabase', 'Autenticación'],
  },
  {
    id: 'tooling',
    label: 'Herramientas',
    items: ['Git', 'Docker', 'CI/CD', 'Vitest', 'Playwright', 'Figma'],
  },
]
