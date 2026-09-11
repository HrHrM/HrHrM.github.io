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
      'Desarrollo de la plataforma web principal y un ecosistema de aplicaciones web y móviles corporativas.',
    highlights: [
      'Ecosistema multiplataforma: Construcción de aplicaciones en React y React Native orientadas a diferentes roles, incluyendo clientes móviles con geolocalización para ventas, módulos de supervisión en tiempo real y dashboards analíticos (BI) para directivos.',
      'Optimización y escalabilidad: Ejecución de refactorizaciones críticas en la plataforma web central, eliminando deuda técnica y maximizando la reutilización de componentes y lógica de negocio entre los distintos productos.',
      'Orquestación de IA y automatización: Integración de sub-agentes mediante Claude Code y spec-kit utilizando MCP (Model Context Protocol) en el flujo de desarrollo local para acelerar la arquitectura, con validación automatizada multiplataforma en Playwright y Maestro.',
    ],
    stack: [
      'React',
      'React Native',
      'Claude Code',
      'spec-kit',
      'MCP',
      'Playwright',
      'Maestro',
      'pen.dev',
      'Figma',
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
    stack: ['Angular', 'APIs REST'],
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
    stack: ['Flutter', 'Firebase', 'Figma'],
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
