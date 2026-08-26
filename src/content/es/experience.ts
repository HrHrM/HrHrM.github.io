import type { EducationItem, ExperienceItem } from '../types'

/**
 * Fechas en ISO parcial: las formatea `lib/dates.ts` según el idioma, para que
 * las dos versiones no puedan desincronizarse.
 *
 * El aporte propio va en primera persona; el contexto de la empresa, en tercera
 * (CLAUDE.md §5). Y lo que se dice aquí tiene que coincidir con lo que dicen
 * las fichas de proyecto: si una sección dice «diseñé» y la otra «integré»,
 * la contradicción se nota.
 */
export const experience: ExperienceItem[] = [
  {
    company: 'Galilei Smart Solutions',
    role: 'Desarrollador Frontend · React',
    start: '2025-04',
    end: null,
    summary:
      'Soporte y evolución del proyecto principal de la empresa, y desarrollo de proyectos web y móviles de principio a fin.',
    highlights: [
      'Refactoricé código e implementé funcionalidades nuevas para mejorar el rendimiento y la escalabilidad del proyecto principal.',
      'Participé en proyectos web y móviles con React y React Native de principio a fin: diseño, implementación y puesta en producción.',
      'Integré herramientas de IA en mi flujo de trabajo para acelerar la escritura de código, la depuración y la resolución de problemas.',
    ],
  },
  {
    company: 'Pegaso Consulting',
    role: 'Desarrollador Frontend · Angular',
    start: '2023-11',
    end: '2024-11',
    summary:
      'Funcionalidades administrativas del proyecto web principal, un sistema que había que adaptar a varios clientes sin duplicarlo.',
    highlights: [
      'Desarrollé funcionalidades administrativas con Angular, mejorando la modularidad y facilitando la adaptación del sistema a múltiples clientes.',
      'Integré las APIs REST del ecosistema web principal, acordando en reuniones con el equipo de backend qué necesitábamos que expusieran.',
      'Optimicé el rendimiento refactorizando el código: menos complejidad por componente, y más legibilidad y reutilización.',
    ],
  },
  {
    company: 'APPS2GO',
    role: 'Desarrollador Frontend · Flutter',
    start: '2022-03',
    end: '2023-06',
    summary:
      'La base de una aplicación móvil para terminales POS Android, con datos en tiempo real y muy poco margen de recursos.',
    highlights: [
      'Desarrollé la base de la aplicación en Flutter, optimizada para gestionar información en equipos POS de gama baja con respuesta en tiempo real.',
      'Implementé Firebase como backend: autenticación, almacenamiento y datos de usuario.',
      'Transformé los diseños de Figma en interfaces funcionales con la suite completa de widgets de Flutter.',
    ],
  },
]

export const education: EducationItem[] = [
  {
    institution: 'Universidad Alejandro de Humboldt',
    degree: 'Ingeniero en Informática',
    start: '2016-09',
    end: '2022-02',
    note: 'Tesis: comunicador móvil en React Native para personas con discapacidad del habla, con síntesis de voz a partir de iconos o texto.',
  },
]
