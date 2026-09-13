import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { TextType } from '@/components/ui/TextType'
import { useLocale } from '@/hooks/useLocale'
import { useScrolledPast } from '@/hooks/useScrolledPast'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/lib/nav'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/cn'
import './Navbar.css'

/**
 * La barra tiene dos formas, y no son la misma con menos cosas.
 *
 * **En escritorio** aparece a partir de Experiencia —que es donde hay algo
 * entre lo que navegar— con el nombre, los cinco enlaces y los dos controles.
 * Sobre el Hero se atenúa entera.
 *
 * **En móvil solo existe el botón de menú, y está siempre.** Antes el idioma y
 * el tema vivían también en la barra, sin prefijo `md:`, así que sobre el Hero
 * se pintaban cuatro controles sueltos encima del texto: la barra es
 * transparente ahí, y al desplazarse el titular pasaba por debajo de un
 * «ES EN ☾ ☰» que no tenía fondo. Ahora los dos controles se han mudado dentro
 * del panel, y arriba queda un solo botón.
 *
 * Que el botón esté visible **también sobre el Hero** es consecuencia de esa
 * mudanza, no un capricho: si se ocultara, en móvil no habría forma de cambiar
 * de idioma ni de tema sin bajar primero.
 *
 * Lo que se oculta se atenúa, no se desmonta. Con `opacity-0` la maqueta no se
 * mueve al cambiar de estado, y `focus-within` lo devuelve entero en cuanto
 * entra el foco: quien navega con teclado alcanza los enlaces desde arriba sin
 * tener que hacer scroll primero.
 */
export function Navbar() {
  const { ui, home } = useLocale()
  const [open, setOpen] = useState(false)
  const active = useScrollSpy([...SECTION_IDS])

  // Los enlaces de sección son `Link` del router y **no** `<a href="#id">`, y
  // no es cosmético. Con un ancla plana el navegador cambia el hash por su
  // cuenta; el router lo ve como una navegación y `<ScrollRestoration />`
  // restaura la posición que tenía guardada para esa clave, cancelando el
  // salto al ancla. Se veía como «hay que pulsar dos veces»: en realidad el
  // primer clic saltaba y la restauración lo devolvía.
  //
  // Con `Link` la navegación la conduce el router, que al haber hash busca el
  // elemento y va a él en vez de restaurar. Es lo que ya hacía bien el CTA del
  // hero, que siempre fue un `Link`.
  const past = useScrolledPast('hero')

  /**
   * Lo que se oculta sobre el Hero se atenúa, no se desmonta: con `opacity-0`
   * la maqueta no se mueve al cambiar de estado. `pointer-events-none` va con
   * ella, porque un enlace invisible que sigue siendo clicable es una trampa.
   *
   * **La excepción es `:focus-visible`, no `:focus`.** Antes era
   * `focus-within`, que en CSS es `:focus` a secas y por tanto también salta
   * con el ratón: al pulsar el nombre, el enlace se quedaba enfocado, y aunque
   * la página volviera arriba la barra no se iba. Medido: tras el clic,
   * `scrollY=0` pero el logo seguía en `opacity: 1`, con
   * `:focus-visible = false` — el navegador ya sabía que ese foco venía del
   * ratón; era la regla la que no preguntaba.
   *
   * `:focus-visible` solo salta cuando el navegador considera que hay que
   * dibujar el anillo de foco, que en la práctica es teclado. Así el ratón deja
   * de dejarla enganchada y quien navega con teclado la sigue alcanzando desde
   * arriba sin hacer scroll primero, que es para lo que existía la excepción.
   *
   * Van dos versiones porque el elemento enfocado no siempre es el mismo: el
   * nombre es el propio enlace, y la lista es un contenedor cuyos hijos se
   * enfocan.
   */
  const hidden =
    'pointer-events-none opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100'
  const hiddenGroup =
    'pointer-events-none opacity-0 has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:opacity-100'

  // Al pasar a escritorio el panel se oculta por CSS, pero el estado seguiría
  // abierto y el bloqueo de scroll puesto: la página se quedaría sin poder
  // desplazarse y sin nada visible que explicara por qué.
  //
  // Se cierra desde el evento del `matchMedia` y no comparando un booleano en
  // el cuerpo del efecto. La diferencia no es de estilo: llamar a `setOpen`
  // ahí encadena un render extra en cada montaje, y solo hay que cerrar cuando
  // el ancho **cruza** el umbral, que es justo lo que ese evento significa.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Bloquea el scroll del fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Cerrar con Escape: el menú es un overlay y tiene que soltarse sin ratón.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const items = SECTION_IDS.map((id) => ({ id, label: ui.nav[id] }))

  return (
    <header
      className={cn(
        // El borde se mantiene declarado y solo cambia de color: quitarlo
        // movería la barra un píxel cada vez que aparece.
        'sticky top-0 z-50 border-b transition-colors duration-200',
        past || open
          ? 'border-line bg-paper/85 backdrop-blur-sm'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          to={home}
          className={cn(
            'font-display text-lg text-ink transition-opacity duration-200',
            !past && hidden,
          )}
        >
          {/* Se teclea una sola vez, cuando la barra aparece. `reserveSpace`
              es lo que evita que los enlaces de al lado tiemblen mientras se
              escribe: el ancho está reservado desde el principio. */}
          <TextType
            as="span"
            text={SITE.name}
            start={past}
            typingSpeed={38}
            loop={false}
            hideCursorWhenDone
            cursorCharacter="_"
            cursorBlinkDuration={0.45}
          />
        </Link>

        <nav
          aria-label={ui.nav.primary}
          className={cn(
            'hidden transition-opacity duration-200 md:block',
            !past && hiddenGroup,
          )}
        >
          <ul className="flex items-center gap-7">
            {items.map(({ id, label }) => (
              <li key={id}>
                <Link
                  to={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(
                    'font-mono text-meta tracking-wide uppercase transition-colors',
                    active === id ? 'text-accent' : 'text-muted hover:text-ink',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* En móvil este bloque es solo el botón: los dos controles están
            dentro del panel. En escritorio no cambia nada respecto a antes. */}
        <div className="flex items-center gap-2">
          {/* **Sin atenuar sobre el Hero, y es deliberado**: en escritorio hay
              sitio de sobra y estos dos son lo único que se ofrece antes de
              bajar. Solo cambian de caja — `bare` sin borde arriba, `bar`
              cuando la barra ya tiene fondo. Lo que se oculta ahí son los
              enlaces, que sobre el Hero no llevan a ningún sitio todavía. */}
          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitch variant={past ? 'bar' : 'bare'} />
            <ThemeToggle labels={ui.theme} variant={past ? 'bar' : 'bare'} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={ui.nav.menu}
            className={cn(
              'grid size-9 place-items-center border text-muted transition-colors md:hidden',
              past || open
                ? 'border-line text-ink'
                : 'border-transparent text-muted',
            )}
          >
            {/* Dos trazos en vez de los iconos de lucide: el aspa del
                `CardNav` necesita animar cada línea por separado, y un `<svg>`
                que se sustituye por otro no se puede interpolar. */}
            <span aria-hidden="true" className="nav-burger">
              <span className="nav-burger__line" />
              <span className="nav-burger__line" />
            </span>
          </button>
        </div>
      </div>

      {/* El panel se queda montado siempre: la altura se anima con
          `grid-template-rows`, y desmontarlo mataría también la animación de
          cierre. `inert` es lo que lo saca del foco y del árbol de
          accesibilidad mientras está plegado — sin él, tabular desde la barra
          entraría en unos enlaces que nadie ve. */}
      {/* Sin `md:hidden`: el `display` del panel —y su punto de ruptura— los
          gobierna `Navbar.css`. Mezclar los dos perdía la carrera de orden en
          la hoja y el panel acababa renderizándose en escritorio. */}
      <div id="menu-movil" data-open={open} inert={!open} className="nav-panel">
        <div className="nav-panel__clip">
          <div className="nav-panel__body">
            <nav aria-label={ui.nav.menu}>
              <ul className="flex flex-col px-gutter">
                {items.map(({ id, label }, i) => (
                  <li
                    key={id}
                    style={{ '--nav-i': i } as React.CSSProperties}
                    className="nav-panel__item border-b border-line"
                  >
                    <Link
                      to={`#${id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === id ? 'true' : undefined}
                      className={cn(
                        'block py-4 font-mono text-meta tracking-wide uppercase transition-colors',
                        active === id ? 'text-accent' : 'text-muted',
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Idioma y tema cierran la lista, con el mismo escalonado: entran
                como una fila más, después de los enlaces. */}
            <div
              style={{ '--nav-i': items.length } as React.CSSProperties}
              className="nav-panel__item flex items-center justify-between px-gutter py-4"
            >
              <LocaleSwitch variant="bar" />
              <ThemeToggle labels={ui.theme} variant="bar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
