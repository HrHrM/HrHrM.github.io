import { useCallback, useState } from 'react'

import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { StarBorder } from '@/components/ui/StarBorder'
import { Particles } from '@/components/ui/Particles'
import { ParticlesStatic } from '@/components/ui/ParticlesStatic'
import { WireframeBall } from '@/components/ui/WireframeBall'
import { WireframeBallStatic } from '@/components/ui/WireframeBallStatic'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { SITE } from '@/lib/constants'

/**
 * La portada. No es una sección: no va numerada, no entra en la navegación y
 * **no comparte retícula con el resto de la página**. Va a sangre, de gutter a
 * gutter, mientras que todo lo de abajo vive en la columna centrada de
 * `Container`. Antes se alineaba con el rail; se cambió al pasarla a ancho
 * completo, y el porqué está junto al `Container` de más abajo.
 *
 * **El nombre es el `<h1>`, y esto es un cambio de criterio.** Antes el
 * titular era la frase de posicionamiento y el nombre vivía solo en la esquina
 * de la Navbar, con el argumento de que un nombre grande sobre un subtítulo
 * pequeño es el patrón del portafolio de estudiante. Lo que rompió ese
 * argumento fue esconder la barra sobre la portada: el nombre dejó de aparecer
 * en el primer pantallazo, y un portafolio en el que no se ve de quién es
 * falla en algo más básico que el tono.
 *
 * El patrón que se quería evitar sigue evitado, pero por tipografía y no por
 * omisión: la frase no baja a tamaño de pie de foto, se queda a 34px contra
 * los 72 del nombre — 2,1× de caída. Ver el comentario del `<p>` más abajo.
 *
 * Dos decisiones que parecen omisiones y no lo son:
 *
 * - **No hay señal de scroll.** Competía visualmente con el CTA teniéndolo al
 *   lado, y el zócalo de datos ya avisa de que hay más contenido debajo. Sin
 *   ella el botón queda aislado, con el máximo contraste e intención.
 * - **Una sola animación en todo el sitio, y está aquí.** Repartir entradas
 *   por toda la página es lo que hace que un portafolio se vea genérico.
 */
export function Hero() {
  const { ui } = useLocale()
  const { tagline, taglineAccent } = ui.hero

  // Los dos adornos se montan por consulta de medios y no con `hidden md:block`.
  // Con la clase el componente igual se monta y `display:none` solo lo tapa: en
  // un móvil se acababa creando un contexto WebGL que nunca pinta un fotograma.
  // Los breakpoints son los de Tailwind — md 48rem, xl 80rem — escritos aquí
  // porque quien decide ahora es JS, y tenerlos en dos sitios se desincroniza.
  const showParticles = useMediaQuery('(min-width: 48rem)')
  const showBall = useMediaQuery('(min-width: 80rem)')

  // El relevo entre el placeholder y el efecto de verdad. El `useCallback` es
  // higiene, no un requisito: los componentes animados guardan el callback en
  // un ref precisamente para no depender de que el padre lo estabilice.
  const [particlesLive, setParticlesLive] = useState(false)
  const [ballLive, setBallLive] = useState(false)
  const onParticlesFrame = useCallback(() => setParticlesLive(true), [])
  const onBallFrame = useCallback(() => setBallLive(true), [])

  // El acento se resalta partiendo la frase por el trozo declarado, en vez de
  // guardarla troceada en el contenido: así el texto sigue siendo una sola
  // cadena traducible y el HTML que ve Google es la frase completa.
  const accentAt = taglineAccent ? tagline.indexOf(taglineAccent) : -1
  const [before, accent, after] =
    accentAt === -1
      ? [tagline, '', '']
      : [
          tagline.slice(0, accentAt),
          taglineAccent,
          tagline.slice(accentAt + taglineAccent.length),
        ]

  return (
    // El `id` no es un ancla de navegación: no está en `SECTION_IDS` ni sale
    // en la Navbar. Lo observa `useScrolledPast` para saber cuándo la portada
    // ha terminado de pasar y la barra tiene que aparecer.
    // `min-h` en `svh` y contenido centrado: es lo que hace que la portada
    // guarde la misma proporción en un portátil y en un monitor grande. Antes
    // medía 762px fijos —el padding salía de `10vw`, anchura— y eso era el 97%
    // de una pantalla de 768 y el 53% de una de 1440.
    //
    // `svh` y no `vh` por el móvil: `vh` cuenta con la barra del navegador
    // retraída, así que al aparecer recorta el hero y el contenido salta.
    //
    // Es `min-h` y no `h`: si el contenido crece —en móvil son cinco líneas
    // más el zócalo— la sección se estira en vez de recortarlo.
    <section
      id="hero"
      className="relative flex min-h-[78svh] flex-col justify-center overflow-hidden py-hero-y"
    >
      {/* El orden en el DOM es el orden de pintado: partículas al fondo,
          geodésica encima, y el Container —que lleva `relative`— por delante
          de las dos. Nadie necesita `z-index`.

          Las partículas sí van a sangre y no solo a la derecha: son la capa
          de textura sobre la que se apoya la geodésica, y recortarlas a media
          portada dejaría un canto visible en mitad del titular. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-reveal [animation-delay:300ms]"
      >
        {/* El SVG quieto sí viaja en el HTML prerenderizado, así que se ve
            antes de que exista una sola línea de JS. Se retira solo cuando el
            canvas confirma que ya pintó — nunca al montar, o quedaría un
            hueco entre los dos. Debajo de `md` no hay ninguno de los dos. */}
        <div
          className={cn(
            'absolute inset-0 hidden transition-opacity duration-500 md:block',
            particlesLive && 'opacity-0',
          )}
        >
          <ParticlesStatic />
        </div>
        {showParticles ? (
          <div className="absolute inset-0">
            <Particles onFirstFrame={onParticlesFrame} />
          </div>
        ) : null}
      </div>

      {/* La geodésica ocupa la mitad derecha, que es la que el titular deja
          vacía. Tres cosas que la mantienen en su sitio:

          - `aria-hidden` y `pointer-events-none`: es decoración, no contenido,
            y no debe interceptar el cursor sobre el CTA.
          - La máscara la desvanece hacia la izquierda, así que nunca llega a
            competir con el texto por mucho que crezca el viewport.
          - Debajo de `xl` desaparece entera. El corte está en 1280 y no en
            `md` porque el titular en español ocupa el ancho completo mucho
            más arriba de lo que parece: a 820 la figura le cruzaba por
            encima, y a 1024 la cara delantera caía justo detrás de
            «escalable», que es la palabra con el acento y la que tiene que
            estar más limpia. Medido en el build servido, no estimado. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[52%] animate-reveal mask-[linear-gradient(to_right,transparent,black_42%)] [animation-delay:360ms]"
      >
        <div
          className={cn(
            'absolute inset-0 hidden transition-opacity duration-500 xl:block',
            ballLive && 'opacity-0',
          )}
        >
          <WireframeBallStatic />
        </div>
        {showBall ? (
          <div className="absolute inset-0">
            <WireframeBall onFirstFrame={onBallFrame} />
          </div>
        ) : null}
      </div>

      {/* `max-w-none` levanta el tope de 72rem de Container: el hero es el
          único sitio donde el contenido va a sangre, y abajo cada sección
          sigue en su columna centrada.

          Con la sangre se cae también el sangrado del rail que había aquí.
          No es un descuido: manteniéndolo, el contenido del hero arrancaba en
          160px y el de las secciones en 176px. Dieciséis píxeles de diferencia
          no se leen como dos retículas distintas, se leen como una mal
          cuadrada. A sangre entera —40px, el gutter— la diferencia es de 136 y
          la intención se entiende. */}
      {/* `max-w-[100rem]` en vez de `max-w-none`: a sangre pura, en un monitor
          de 2560 el zócalo se estiraba 2400px y el titular quedaba varado en
          una esquina. Con el tope, a partir de ~1600 el bloque deja de crecer
          y se centra.

          En móvil manda `px-gutter` —los mismos 20px de siempre— y solo desde
          `md` entra el margen ancho. */}
      <Container className="relative max-w-[100rem] px-gutter md:px-gutter-wide">
        <p className="animate-reveal font-mono text-meta tracking-widest text-muted uppercase">
          {ui.hero.eyebrow}
        </p>

        {/* El nombre sale de `SITE.name` y no del bundle de idioma: un nombre
            propio no se traduce, y tenerlo en los dos ui.ts sería la clase de
            dato duplicado que acaba divergiendo. */}
        <h1 className="mt-6 animate-reveal font-display text-hero leading-[0.98] text-ink [animation-delay:90ms]">
          {SITE.name}
        </h1>

        {/* La frase tiene su propio token y no usa `text-lead`: con el nombre a
            72px, bajarla a 20px deja una caída de 3,6× que es exactamente el
            patrón de portafolio de estudiante —nombre gigante, mensaje en letra
            pequeña— que el resto de la página evita. A 34px la proporción es de
            2,1× y las dos líneas se leen como una sola unidad.

            Tampoco usa `text-section`, que es lo que llevaba antes: ese token
            lo comparten los cinco títulos de sección, así que ajustar el
            subtítulo los habría encogido a todos.

            Peso 400 sobre un `<p>`: el tamaño lo acerca al titular, y es el
            peso el que deja claro cuál manda. */}
        <p className="mt-5 max-w-4xl animate-reveal font-sans text-hero-lead leading-tight text-muted [animation-delay:135ms]">
          {before}
          {accent ? <span className="text-accent">{accent}</span> : null}
          {after}
        </p>

        {/* Un CTA y solo uno (CLAUDE.md §4). Llegó a haber tres —Contacto y
            Descargar CV al lado— y se quitaron los dos: ambos destinos están
            ya en la Navbar en cuanto la portada termina de pasar, y tres
            botones seguidos dejan de leerse como una jerarquía para leerse
            como un menú. */}
        <div className="mt-10 animate-reveal [animation-delay:180ms]">
          {/* El destello envuelve al botón en vez de sustituirlo: la
              apariencia del CTA sigue viviendo en `Button.tsx`, con su
              variante y su hover, y aquí solo se le añade el borde animado. */}
          <StarBorder speed="7s" thickness={3}>
            <ButtonLink to="#experience" variant="solid">
              {ui.hero.cta}
            </ButtonLink>
          </StarBorder>
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
