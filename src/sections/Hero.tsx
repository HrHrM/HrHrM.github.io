import { ArrowDown } from 'lucide-react'

import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { useLocale } from '@/hooks/useLocale'

/**
 * La única apuesta visual del sitio: el display grande y nada más.
 * Un solo CTA, y todo lo demás en mono y en silencio.
 */
export function Hero() {
  const { ui } = useLocale()

  return (
    <section className="border-b border-line pt-section pb-section">
      <Container>
        <p className="animate-reveal font-mono text-meta tracking-widest text-muted uppercase">
          {ui.hero.eyebrow}
        </p>

        <h1 className="mt-6 max-w-4xl animate-reveal font-display text-hero leading-[0.95] text-ink [animation-delay:90ms]">
          {ui.hero.headline}
        </h1>

        <div className="mt-10 flex animate-reveal flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:180ms]">
          <ButtonLink to="#projects" variant="solid">
            {ui.hero.cta}
          </ButtonLink>

          <span
            aria-hidden="true"
            className="flex items-center gap-2 font-mono text-meta tracking-wide text-muted uppercase"
          >
            <ArrowDown className="size-3.5" />
            {ui.hero.scrollHint}
          </span>
        </div>
      </Container>
    </section>
  )
}
