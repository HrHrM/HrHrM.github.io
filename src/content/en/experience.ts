import type { EducationItem, ExperienceItem } from '../types'

/**
 * Written, not translated — tighter and more direct than the Spanish.
 *
 * What this says has to match what the project pages say: if one section reads
 * "designed" and the other "integrated", the contradiction shows.
 */
export const experience: ExperienceItem[] = [
  {
    company: 'Galilei Smart Solutions',
    role: 'Frontend Developer · React',
    start: '2025-04',
    end: null,
    summary:
      'Development of the core web platform and an ecosystem of enterprise web and mobile applications.',
    highlights: [
      'Cross-platform ecosystem: Built React and React Native applications tailored to distinct user roles, including location-aware mobile clients for field sales, real-time supervision modules, and analytical BI dashboards for executives.',
      'Optimization and scalability: Executed critical refactoring across the central web platform, eliminating technical debt and maximizing the reuse of components and shared business logic across multiple products.',
      'AI orchestration and automation: Integrated sub-agents via Claude Code and spec-kit using MCP (Model Context Protocol) into the local development workflow to accelerate architecture, backed by cross-platform automated testing with Playwright and Maestro.',
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
    role: 'Frontend Developer · Angular',
    start: '2023-11',
    end: '2024-11',
    summary:
      'Admin architectures for enterprise systems serving multiple corporate tenants without code forks.',
    highlights: [
      'Built modular admin features in Angular, enabling multi-tenant adaptation across distinct clients from a single codebase.',
      'Integrated REST APIs across frontend views, defining clear data contracts alongside backend teams.',
      'Refactored legacy modules to decrease component complexity, improving testability and code reuse.',
    ],
    stack: ['Angular', 'REST APIs'],
  },
  {
    company: 'APPS2GO',
    role: 'Frontend Developer · Flutter',
    start: '2022-03',
    end: '2023-06',
    summary:
      'Mobile architectural foundation for resource-constrained Android POS terminals handling live transaction data.',
    highlights: [
      'Architected the core Flutter application, tuned for reliable data processing on low-spec POS hardware.',
      'Integrated Firebase services for authentication, secure storage, and real-time database synchronization.',
      "Translated Figma design systems into responsive mobile interfaces using Flutter's widget architecture.",
    ],
    stack: ['Flutter', 'Firebase', 'Figma'],
  },
]

export const education: EducationItem[] = [
  {
    institution: 'Universidad Alejandro de Humboldt',
    degree: 'B.Sc. in Computer Engineering',
    start: '2016-09',
    end: '2022-02',
    note: 'Thesis: Developed a cross-platform React Native AAC application converting text and iconography into synthesized speech.',
  },
]
