import { ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/cn'
import { STACK_LINKS } from '@/lib/constants'

/**
 * Las celdas enlazadas y las que no comparten estas clases **exactas**, y esa
 * es la razón de que exista la constante.
 *
 * Al principio el `<a>` era `flex items-center` y el `<span>` un `block`: en
 * una fila alta —«Claude Code (MCP, sub-agentes)» ocupa tres líneas— los
 * enlaces quedaban centrados a media altura mientras Git y Playwright se
 * pegaban arriba, con 24px de desfase entre vecinos. Con `items-start` todas
 * las primeras líneas caen en la misma horizontal, que es lo que hace que la
 * cuadrícula se lea como una tabla.
 */
const cell = 'flex h-full items-start gap-2 px-4 py-3.5 text-ink'

/**
 * Misma retícula que Experiencia y las fichas: etiqueta en mono a la izquierda,
 * contenido a la derecha. Escala a cualquier número de grupos, al contrario que
 * una rejilla de tres columnas — con cinco grupos dejaba un 3+2 descompensado.
 *
 * **Los items van en cuadrícula, no en badges sueltos.** Envueltos en píldoras
 * la sección era una bolsa de etiquetas de anchos distintos, y no se podía
 * comparar nada de un vistazo. En columnas alineadas con hairlines, el ojo
 * recorre la lista y el bloque se lee como una tabla de datos, que es lo que
 * es. Es el mismo argumento «preciso» del resto de la página.
 *
 * **Sin logos.** Se probó con los iconos de tech-stack-icons y se descartó por
 * dos motivos: el paquete pesa 2,6 MB gzip —dieciséis veces el sitio entero— y
 * su API resuelve por nombre en tiempo de ejecución, así que no hay
 * tree-shaking que valga; y diecinueve logos de marca a color rompían la
 * paleta de seis colores del §4.
 *
 * Sin niveles ni barras de porcentaje (CLAUDE.md §4).
 */
export function Stack() {
  const { ui, skills } = useLocale()

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="border-t border-line py-section"
    >
      <SectionHeading
        id="stack"
        index="04"
        title={ui.sections.stack.title}
        lead={ui.sections.stack.lead}
      />
      <Container>
        <dl>
          {skills.map((group) => (
            <div
              key={group.id}
              className="grid gap-3 border-b border-line py-8 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <dt className="font-mono text-meta tracking-widest text-muted uppercase md:col-span-3">
                {group.label}
              </dt>
              <dd className="md:col-span-9">
                {/* Los hairlines los ponen las celdas, no el contenedor: cada
                    una lleva borde arriba y a la izquierda, y los márgenes
                    negativos del `<ul>` hacen que la primera fila y la primera
                    columna caigan justo sobre el borde del bloque en vez de
                    dibujar una línea de más. Al envolver, la primera celda de
                    cada fila apoya su borde izquierdo en la misma x, así que
                    nunca se duplica. */}
                <ul className="-mt-px -ml-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                  {group.items.map((item) => {
                    const href = STACK_LINKS[item]
                    return (
                      <li key={item} className="border-t border-l border-line">
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={cn(
                              cell,
                              'group transition-colors hover:text-accent',
                            )}
                          >
                            {item}
                            {/* La flecha va desde el reposo, no solo en hover:
                                si solo tres de veintiún items reaccionan al
                                cursor y nada lo anuncia, se lee como un fallo
                                y no como una decisión.

                                `mt-1` la baja hasta el centro óptico de la
                                primera línea: con `items-start` quedaría
                                pegada al borde superior de la caja. */}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="mt-1 size-3.5 shrink-0 text-muted transition-colors group-hover:text-accent"
                            />
                          </a>
                        ) : (
                          <span className={cell}>{item}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
