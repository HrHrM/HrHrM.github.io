import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'

/**
 * La portada. No es una sección: no va numerada, no entra en la navegación y
 * no lleva rail propio — pero se alinea con él, así que el titular arranca en
 * la misma columna que todo el contenido de abajo.
 *
 * Tres decisiones que parecen omisiones y no lo son:
 *
 * - **El nombre no está aquí.** Vive en la esquina de la Navbar, que es donde
 *   se busca. Un nombre gigante con la frase de posicionamiento degradada a
 *   subtítulo es el patrón de portafolio de estudiante; abrir con la
 *   afirmación sobre capacidad técnica se lee como una publicación técnica.
 * - **No hay señal de scroll.** Competía visualmente con el CTA teniéndolo al
 *   lado, y el zócalo de datos ya avisa de que hay más contenido debajo. Sin
 *   ella el botón queda aislado, con el máximo contraste e intención.
 * - **Una sola animación en todo el sitio, y está aquí.** Repartir entradas
 *   por toda la página es lo que hace que un portafolio se vea genérico.
 */
export function Hero() {
  const { ui } = useLocale()
  const { headline, headlineAccent } = ui.hero

  // El acento se resalta partiendo el titular por el trozo declarado, en vez
  // de guardar el <h1> troceado en el contenido: así el texto sigue siendo una
  // sola cadena traducible y el HTML que ve Google es la frase completa.
  const accentAt = headlineAccent ? headline.indexOf(headlineAccent) : -1
  const [before, accent, after] =
    accentAt === -1
      ? [headline, '', '']
      : [
          headline.slice(0, accentAt),
          headlineAccent,
          headline.slice(accentAt + headlineAccent.length),
        ]

  return (
    <section className="border-b border-line pt-section pb-section">
      <Container className="md:pl-[calc(var(--spacing-gutter)+var(--spacing-rail-md))] lg:pl-[calc(var(--spacing-gutter)+var(--spacing-rail))]">
        <p className="animate-reveal font-mono text-meta tracking-widest text-muted uppercase">
          {ui.hero.eyebrow}
        </p>

        <h1 className="mt-6 max-w-4xl animate-reveal font-display text-hero leading-[0.98] text-ink [animation-delay:90ms]">
          {before}
          {accent ? <span className="text-accent">{accent}</span> : null}
          {after}
        </h1>

        <div className="mt-10 animate-reveal [animation-delay:180ms]">
          <ButtonLink to="#experience" variant="solid">
            {ui.hero.cta}
          </ButtonLink>
        </div>

        {/* El zócalo: hechos comprobables, no adjetivos. Es el mismo argumento
            que adelantó Experiencia por delante de Proyectos —lo comprobable
            primero— pero ya en el primer scroll. */}
        <dl className="mt-16 animate-reveal border-t border-line [animation-delay:270ms] md:grid md:grid-cols-3">
          {ui.hero.facts.map((fact, i) => (
            <div
              key={fact.label}
              className={cn(
                'flex items-center justify-between gap-4 border-b border-line py-3.5 md:block md:border-b-0 md:py-0 md:pt-5',
                // El hairline vertical solo separa, así que no lo lleva la
                // primera celda. En móvil no hay columnas y sobra entero.
                i > 0 && 'md:border-l md:border-line md:pl-8',
              )}
            >
              <dt className="font-mono text-[0.625rem] tracking-widest text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="font-mono text-[0.8125rem] text-ink md:mt-2.5">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
