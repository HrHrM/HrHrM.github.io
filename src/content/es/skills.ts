import type { SkillGroup } from '../types'

/**
 * Solo lo que está en el CV y se sostendría en una entrevista técnica.
 * Sin niveles ni barras de porcentaje (CLAUDE.md §4).
 *
 * Los grupos separan categorías reales: los lenguajes no van con los
 * frameworks, y Firebase —que es un servicio gestionado, no una librería—
 * tampoco va con React.
 */
export const skills: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Lenguajes',
    items: ['TypeScript', 'JavaScript', 'Dart', 'HTML', 'CSS / SASS'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks y librerías',
    items: ['React', 'React Native', 'Angular', 'Flutter', 'Node.js'],
  },
  {
    id: 'services',
    label: 'Servicios e integración',
    items: ['Firebase', 'APIs REST'],
  },
  {
    id: 'tooling',
    label: 'Herramientas y metodología',
    // El orden importa: la retícula los reparte en filas de cinco, así que
    // esto decide qué cae en cada columna.
    items: [
      'Git',
      'Claude Code (MCP, sub-agentes)',
      'spec-kit',
      'Playwright',
      'Maestro',
      'Figma',
      'Agile/SCRUM',
      'Pencil',
    ],
  },
  {
    id: 'spoken',
    label: 'Idiomas',
    items: ['Español — nativo', 'Inglés — B2 profesional'],
  },
]
