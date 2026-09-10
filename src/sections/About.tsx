import { Container } from '@/components/ui/Container'
import { InfiniteSpiral } from '@/components/ui/InfiniteSpiral'
import type { SpiralItem } from '@/components/ui/InfiniteSpiral'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'

/**
 * **Provisional.** Stock de Lorem Picsum, un servicio de marcadores de
 * posición: las semillas fijan la foto, así que el HTML prerenderizado y el
 * cliente piden la misma URL y no hay salto al hidratar. Son seis peticiones a
 * un tercero y no salen de `src/assets/`, o sea que **no pueden llegar al
 * lanzamiento** tal cual (CLAUDE.md §8).
 *
 * En el ámbito del módulo a propósito: `items` entra en las dependencias del
 * efecto de `InfiniteSpiral`, y un array literal dentro del JSX cambiaría de
 * identidad en cada render y remontaría el bucle.
 */
const PLACEHOLDER_IMAGES: readonly SpiralItem[] = [
  { id: 'ph-a', src: 'https://picsum.photos/seed/portafolio-a/320/320' },
  { id: 'ph-b', src: 'https://picsum.photos/seed/portafolio-b/320/320' },
  { id: 'ph-c', src: 'https://picsum.photos/seed/portafolio-c/320/320' },
  { id: 'ph-d', src: 'https://picsum.photos/seed/portafolio-d/320/320' },
  { id: 'ph-e', src: 'https://picsum.photos/seed/portafolio-e/320/320' },
  { id: 'ph-f', src: 'https://picsum.photos/seed/portafolio-f/320/320' },
  { id: 'ph-g', src: 'https://picsum.photos/seed/portafolio-g/320/320' },
  { id: 'ph-h', src: 'https://picsum.photos/seed/portafolio-h/320/320' },
  { id: 'ph-i', src: 'https://picsum.photos/seed/portafolio-i/320/320' },
  { id: 'ph-j', src: 'https://picsum.photos/seed/portafolio-j/320/320' },
]

/**
 * El texto vive en `content/{es,en}/ui.ts`, no aquí: añadir o cambiar un
 * párrafo no debería tocar un componente (CLAUDE.md §3, regla 2).
 *
 * El primer párrafo va en `text-lead` y los siguientes en cuerpo: con un
 * display de un solo peso, la entrada a la sección la marca el tamaño.
 *
 * **Dos columnas desde `lg`.** Debajo baja a una sola y la espiral queda
 * **después** del texto: en móvil abrir la sección con un bloque decorativo de
 * 380px de alto empuja fuera de pantalla lo que el visitante vino a leer.
 */
export function About() {
  const { ui } = useLocale()

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-line py-section"
    >
      <SectionHeading id="about" index="01" title={ui.sections.about.title} />
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 lg:col-start-1">
            {ui.about.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph.slice(0, 32)}
                className={cn(
                  i === 0 ? 'text-lead text-ink' : 'mt-6',
                  'max-w-prose',
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* `aria-hidden` mientras sean fotos de stock: no dicen nada que no
              esté en el texto, y anunciar siete imágenes sin contenido a un
              lector de pantalla es ruido. Cuando lleven imágenes reales hay
              que quitarlo y darles `alt`. */}
          {/* `self-stretch` y sin alto en `lg`: la fila la mide la columna de
              texto, así que las dos acaban a la misma altura sea cual sea el
              idioma. Debajo de `lg` no hay con qué igualarse y el alto es
              explícito. */}
          <div
            aria-hidden="true"
            className="h-[350px] lg:col-span-5 lg:col-start-8 lg:h-auto lg:self-stretch"
          >
            <InfiniteSpiral
              items={PLACEHOLDER_IMAGES}
              animationMode="all"
              speed={0.4}
              radius={118}
              cardWidth={84}
              cardHeight={84}
              verticalSpacing={28}
              cardsPerTurn={6}
              cardRadius={0}
              centerScale={1.18}
              edgeBlur={5}
              grayscale={1}
              pauseOnHover
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
