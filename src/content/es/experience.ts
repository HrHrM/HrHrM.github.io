import type { EducationItem, ExperienceItem } from '../types'

/**
 * Fechas en ISO parcial: las formatea `lib/dates.ts` según el idioma, para que
 * las dos versiones no puedan desincronizarse.
 *
 * Registro nominal, igual que el `role` de las fichas de proyecto: describe
 * ámbito de responsabilidad, no narración. Y lo que se dice aquí tiene que
 * coincidir con lo que dicen las fichas: si una sección dice «diseñé» y la
 * otra «integré», la contradicción se nota.
 */
export const experience: ExperienceItem[] = [
  {
    company: 'Galilei Smart Solutions',
    role: 'Desarrollador Frontend · React',
    start: '2025-04',
    end: null,
    summary:
      'Desarrollo de la plataforma web principal y entrega de extremo a extremo de aplicaciones web y móviles multi-cliente.',
    highlights: [
      'Ejecución de refactorización de código en la plataforma web central para mejorar significativamente la escalabilidad y el rendimiento general del sistema.',
      'Gestión del desarrollo de extremo a extremo de aplicaciones web y móviles utilizando React y React Native, impulsando funcionalidades hasta su despliegue en producción.',
      'Integración de Claude Code y flujos basados en spec-kit para acelerar ciclos de desarrollo, utilizando Playwright y Maestro en pruebas automatizadas multiplataforma.',
    ],
  },
  {
    company: 'Pegaso Consulting',
    role: 'Desarrollador Frontend · Angular',
    start: '2023-11',
    end: '2024-11',
    summary:
      'Arquitectura de características administrativas para sistemas empresariales que atienden a múltiples clientes corporativos sin bifurcar el código.',
    highlights: [
      'Desarrollo de características administrativas modulares en Angular, permitiendo una adaptación multi-inquilino (multi-tenant) eficiente para diversos clientes desde un solo código base.',
      'Arquitectura e integración de APIs REST robustas en las vistas del frontend, garantizando contratos de datos claros y confiables con los equipos de backend.',
      'Optimización del rendimiento del sistema refactorizando bases de código heredadas, reduciendo la complejidad de los componentes y mejorando la reutilización del código.',
    ],
  },
  {
    company: 'APPS2GO',
    role: 'Desarrollador Frontend · Flutter',
    start: '2022-03',
    end: '2023-06',
    summary:
      'Base arquitectónica móvil para terminales POS Android de bajos recursos, gestionando datos de transacciones con respuesta en tiempo real.',
    highlights: [
      'Construcción de la base de la aplicación en Flutter, optimizada específicamente para el procesamiento confiable de datos en hardware POS de bajas especificaciones.',
      'Integración de servicios de Firebase como arquitectura de backend para autenticación, almacenamiento seguro y sincronización de base de datos en tiempo real.',
      'Traducción de prototipos complejos de Figma en interfaces móviles receptivas e intuitivas utilizando el conjunto completo de widgets de Flutter.',
    ],
  },
]

export const education: EducationItem[] = [
  {
    institution: 'Universidad Alejandro de Humboldt',
    degree: 'Ing. en Informática',
    start: '2016-09',
    end: '2022-02',
    note: 'Proyecto de Tesis: Desarrollo de una aplicación móvil multiplataforma en React Native con funcionalidad avanzada de Texto a Voz (Text-to-Speech).',
  },
]
