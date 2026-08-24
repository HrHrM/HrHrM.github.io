import { ArrowUpRight, Download, Mail } from 'lucide-react'

import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcon'

import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { LINKS, SITE } from '@/lib/constants'

/**
 * Email, GitHub, LinkedIn y CV. Sin formulario: cuatro enlaces convierten igual
 * y no hay nada que pueda fallar en silencio.
 */
export function Contact() {
  const { ui } = useLocale()

  const items = [
    {
      key: 'email',
      label: ui.contact.email,
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      icon: Mail,
      external: false,
    },
    {
      key: 'github',
      label: ui.contact.github,
      value: LINKS.github.replace(/^https?:\/\//, ''),
      href: LINKS.github,
      icon: GithubIcon,
      external: true,
    },
    {
      key: 'linkedin',
      label: ui.contact.linkedin,
      value: LINKS.linkedin.replace(/^https?:\/\//, ''),
      href: LINKS.linkedin,
      icon: LinkedinIcon,
      external: true,
    },
    {
      key: 'cv',
      label: ui.contact.cv,
      value: 'PDF',
      href: LINKS.cv,
      icon: Download,
      external: false,
    },
  ] as const

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-t border-line py-section"
    >
      <SectionHeading
        id="contact"
        index="05"
        title={ui.sections.contact.title}
        lead={ui.sections.contact.lead}
      />
      <Container>
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {items.map(({ key, label, value, href, icon: Icon, external }) => (
            <li key={key} className="bg-paper">
              <a
                href={href}
                {...(external
                  ? { target: '_blank', rel: 'noreferrer noopener' }
                  : {})}
                className="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-surface"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted transition-colors group-hover:text-accent"
                  />
                  <span>
                    <span className="block font-mono text-meta tracking-wide text-muted uppercase">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-ink">{value}</span>
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
