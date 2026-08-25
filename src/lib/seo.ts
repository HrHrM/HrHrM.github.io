import type { MetaDescriptor } from 'react-router'

import { SITE, type Locale } from './constants'
import { absoluteUrl } from './paths'

type SeoInput = {
  locale: Locale
  title: string
  description: string
  /** Ruta de esta misma página en español. */
  pathEs: string
  /** Ruta de esta misma página en inglés. */
  pathEn: string
}

/**
 * Construye title, description, canónica, hreflang y Open Graph.
 *
 * Los tres `alternate` (es / en / x-default) son obligatorios: sin ellos el SEO
 * multiidioma no sirve de nada (CLAUDE.md §3). React Router acepta descriptores
 * de <link> dentro de `meta` usando `tagName`, así que salen todos de aquí.
 */
export function seoMeta({
  locale,
  title,
  description,
  pathEs,
  pathEn,
}: SeoInput): MetaDescriptor[] {
  const urlEs = absoluteUrl(SITE.url, pathEs)
  const urlEn = absoluteUrl(SITE.url, pathEn)
  const canonical = locale === 'es' ? urlEs : urlEn

  /**
   * `og:image` tiene que ser una URL absoluta: con una ruta relativa, ni
   * WhatsApp ni LinkedIn resuelven la imagen. Sale de `SITE.url`, así que se
   * corrige sola en cuanto haya dominio — igual que las canónicas.
   */
  const ogImage = absoluteUrl(SITE.url, `/og-${locale}.png`)

  return [
    { title },
    { name: 'description', content: description },

    { tagName: 'link', rel: 'canonical', href: canonical },
    { tagName: 'link', rel: 'alternate', hrefLang: 'es', href: urlEs },
    { tagName: 'link', rel: 'alternate', hrefLang: 'en', href: urlEn },
    // x-default apunta al español porque es el idioma sin prefijo.
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: urlEs },

    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:locale', content: locale === 'es' ? 'es_ES' : 'en_US' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    // La imagen es una tarjeta tipográfica: el alt describe lo que se lee en ella.
    { property: 'og:image:alt', content: title },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]
}
