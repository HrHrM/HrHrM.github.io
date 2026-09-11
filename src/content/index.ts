import type { ContentBundle } from './types'

import { projects as projectsEs } from './es/projects'
import {
  education as educationEs,
  experience as experienceEs,
} from './es/experience'
import { skills as skillsEs } from './es/skills'
import { ui as uiEs } from './es/ui'

import { projects as projectsEn } from './en/projects'
import {
  education as educationEn,
  experience as experienceEn,
} from './en/experience'
import { skills as skillsEn } from './en/skills'
import { ui as uiEn } from './en/ui'

import type { Locale } from '@/lib/constants'

export const content: Record<Locale, ContentBundle> = {
  es: {
    projects: projectsEs,
    experience: experienceEs,
    education: educationEs,
    skills: skillsEs,
    ui: uiEs,
  },
  en: {
    projects: projectsEn,
    experience: experienceEn,
    education: educationEn,
    skills: skillsEn,
    ui: uiEn,
  },
}

/** Los destacados, más recientes primero. Lo que pinta la Home. */
export function featuredProjects(locale: Locale) {
  return content[locale].projects
    .filter((p) => p.featured)
    .sort((a, b) => b.year - a.year)
}

export function projectBySlug(locale: Locale, slug: string) {
  return content[locale].projects.find((p) => p.slug === slug)
}

export * from './types'
