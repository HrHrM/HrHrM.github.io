import type { Route } from './+types/Home'

import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Experience } from '@/sections/Experience'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Stack } from '@/sections/Stack'
import { content } from '@/content'
import { SITE } from '@/lib/constants'
import { localeFromPath } from '@/lib/paths'
import { seoMeta } from '@/lib/seo'

/**
 * La página solo ensambla secciones y resuelve el SEO: no tiene markup propio
 * más allá del <main> (CLAUDE.md §3, regla 3).
 *
 * Este mismo módulo sirve `/` y `/en`; el idioma se deduce del pathname.
 */
export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPath(location.pathname)
  const { ui } = content[locale]

  return seoMeta({
    locale,
    title: `${SITE.name} — ${ui.seo.titleSuffix}`,
    description: ui.seo.description,
    pathEs: '/',
    pathEn: '/en',
  })
}

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Experience />
      <About />
      <Stack />
      <Projects />
      <Contact />
    </main>
  )
}
