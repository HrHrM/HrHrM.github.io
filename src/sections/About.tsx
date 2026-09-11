import { Container } from '@/components/ui/Container'
import { InfiniteSpiral } from '@/components/ui/InfiniteSpiral'
import type { SpiralItem } from '@/components/ui/InfiniteSpiral'
import { TECH_ICONS } from '@/lib/techIcons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'

/**
 * Los diez logos de la espiral, en el orden en que entran.
 *
 * Salen de `content/es/skills.ts`, que es el stack de verdad: los cinco
 * frameworks y lenguajes que sostienen el CV, el servicio gestionado y las
 * dos herramientas que tienen icono. No están todos —React Native, Claude
 * Code, spec-kit, Maestro y Pencil no tienen logo en la librería—, y eso hay
 * que tenerlo presente: la espiral no es la lista del stack, esa es la
 * sección Stack. Aquí es un adorno reconocible, no un inventario.
 *
 * En el ámbito del módulo a propósito: `items` entra en las dependencias del
 * efecto de `InfiniteSpiral`, y un array literal dentro del JSX cambiaría de
 * identidad en cada render y remontaría el bucle.
 */
const STACK_SPIRAL: readonly SpiralItem[] = TECH_ICONS.map(
  ({ title, path }) => ({ id: title, label: title, path }),
)

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

          {/* Sigue con `aria-hidden`: el stack ya está escrito en la sección
              Stack, en los chips de cada puesto y en los de cada proyecto —20
              menciones de «React» en la página—, así que anunciarlo una quinta
              vez a un lector de pantalla es repetición, no información. */}
          {/* `self-stretch` y sin alto en `lg`: la fila la mide la columna de
              texto, así que las dos acaban a la misma altura sea cual sea el
              idioma. Debajo de `lg` no hay con qué igualarse y el alto es
              explícito. */}
          <div
            aria-hidden="true"
            className="h-[350px] lg:col-span-5 lg:col-start-8 lg:h-auto lg:self-stretch"
          >
            <InfiniteSpiral
              items={STACK_SPIRAL}
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
              pauseOnHover
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
