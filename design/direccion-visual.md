# Dirección visual — el sistema como apuesta

Plantada en `design/design.pen` el 2026-09-06, sobre los tokens ya decididos en
`tokens.md`. **Siete artboards**, listados en el §9: la página en claro y en
oscuro, los tres anchos, el menú móvil, los estados de interacción y la 404.

Esto es la propuesta a aprobar. No hay nada implementado todavía: el código
sigue con la paleta cálida y el display serif.

Si algo de aquí contradice al código, gana el código: actualiza este archivo.

---

## 1. El problema que resuelve

Al caer Instrument Serif, el portafolio se quedó **sin apuesta visual**. El §4
del CLAUDE.md la definía como «el `<h1>` del Hero en Instrument Serif a 6rem», y
añadía que la retícula de hairlines «no es la apuesta — es el sistema, y va en
silencio». Con una sola familia sans, ese h1 ya no es una apuesta: es un titular
grande y nada más.

La dirección invierte esa relación: **el sistema deja de ir en silencio y se
convierte en la apuesta.** Los tres adjetivos no cambian, cambia de qué salen.

---

## 2. El rail — la espina dorsal

El dispositivo central, y lo único realmente nuevo.

Una **columna de metadatos de 120 px** recorre la página entera, separada del
cuerpo por un hairline vertical continuo. Todas las secciones comparten esa
línea, así que la página tiene una espina visible de arriba abajo.

El rail **nunca** lleva decoración. Solo carga el metadato que corresponde a lo
que hay a su derecha:

| Dónde               | Qué lleva el rail                                       |
| ------------------- | ------------------------------------------------------- |
| Hero                | nada — la portada no es una sección                     |
| Cabecera de sección | nada — ya no van numeradas (§3)                         |
| Fila de experiencia | el rango de fechas, en dos líneas + chip `ACTUAL`       |
| Fila de formación   | el rango de fechas, igual que un puesto                 |
| Fila de stack       | la etiqueta del grupo, en mono a 11 px                  |
| Ficha de proyecto   | el índice a 38 px + el año + la etiqueta de visibilidad |
| Bloque de contacto  | la etiqueta `CANALES`                                   |

**Las fechas se parten a mano en dos líneas** (`Abr 2025` / `— Actualidad`).
El rail son 120 px menos 20 de separación, o sea 100 útiles, y «Abr 2025 —
Actualidad» en mono a 12 px mide unos 150: al wrap automático caía en tres
líneas irregulares y distintas en cada puesto. Partido a mano son siempre dos,
iguales en las cuatro filas.

Ese es el cambio que da carácter sin añadir ni un color ni una sombra: la
información que antes iba flotando en una retícula de 12 columnas ahora tiene
**un sitio fijo y visible**, y la página se lee como una ficha técnica.

**El hairline vertical va en el borde izquierdo del cuerpo, no del rail.** Es
quien define la altura de la fila, así que la línea llega siempre justo hasta
abajo. Puesto en el rail, la columna colapsa.

---

## 3. Una sola numeración: la de los proyectos

Aquí hubo dos intentos fallidos antes de dar con la regla.

El primero puso los números de sección en mono a 13 px y los índices de
proyecto en display a 38: la misma idea en dos escalas distintas, que es justo
lo que rompe una retícula «precisa». El segundo los igualó a los dos en display
800 a 38 px — y ahí apareció el problema de verdad: **la página tenía dos
secuencias `01`–`05` independientes, con el mismo peso, el mismo tamaño, el
mismo color y en la misma columna.** «04 Proyectos» y la ficha «04» no tienen
nada que ver entre sí, y se leían como si fueran lo mismo.

**Las secciones dejan de ir numeradas. Solo se numeran los proyectos.**

- Índice de ficha: display 800, 38 px (26 en móvil), `letter-spacing: -1.4px`,
  color `muted`. Es la única secuencia numerada de la página y no compite con
  nada.
- Las cabeceras de sección se quedan con el título y el hairline. El rail de la
  cabecera queda vacío, así que **no hay un frame de rail en la cabecera**: los
  120 px salen del `padding-left` del contenedor, que deja el hairline y el
  título exactamente en la misma x que en las filas de abajo.
- La Navbar también pierde sus `01`–`05`. Numeraba unas secciones que ya no
  llevan número; dejarlos ahí era numerar en un sitio y no en el otro.

`muted` y no `line` para el índice que queda: el número **informa**, y a 1,23:1
no se lee. La regla del §4 —«cualquier borde que signifique algo usa `muted` o
`ink`»— aplica igual al texto.

**Consecuencia para el código.** El `index` de `SectionHeading` deja de
pintarse, y con él se cae la regla del §5 del CLAUDE.md sobre renumerar a mano
al reordenar secciones: ya no hay nada que renumerar. Los `SECTION_IDS` y el
orden no cambian.

---

## 4. La base de datos del Hero

El Hero pasa de 592 a 718 px porque gana un zócalo: **tres celdas de datos duros**
separadas por hairlines, en mono, bajo el CTA.

```
EXPERIENCIA   4 años en producción
EMPRESAS      3 · Empresarial y multi-cliente
NÚCLEO        React · Angular · Flutter
```

Es el movimiento «seguro de sí mismo» del §4 sin subir el tamaño de nada: da
peso a la portada con hechos comprobables en lugar de aire. Y responde al mismo
argumento que adelantó Experiencia por delante de Proyectos —lo comprobable
primero—, pero ya en el primer scroll.

**`EMPRESAS` se encuadra por alcance, no por geografía.** Empezó siendo
«3 · Caracas y remoto». La ubicación ya la dice el `eyebrow` del Hero
—«Desarrollador de software · Caracas»— y repetirla gasta una de las tres
celdas en un dato que no habla de capacidad. «Empresarial y multi-cliente» sí,
y coincide con lo que dicen las fichas: «Suite empresarial», «4 clientes
corporativos», «multi-cliente».

Se escribe **«Empresarial»**, no «Enterprise»: el resto del contenido en
español no usa anglicismos para esto, y mezclar registros en la celda más
visible de la portada se nota.

**Los tres valores hay que confirmarlos antes de maquetar.** «4 años» sale de
sumar Mar 2022 → hoy; «3 empresas» sale de `experience.ts`. Si alguno no cuadra,
se cambia el dato, no el diseño.

### Lo que el Hero NO lleva

- **No lleva el nombre en grande.** El nombre vive en la esquina superior
  izquierda de la Navbar, que es donde se busca. Un nombre a 96 px y la frase
  de posicionamiento degradada a subtítulo es el patrón de portafolio de
  estudiante; abrir con la afirmación sobre capacidad técnica es lo que hace
  que se lea como una publicación técnica establecida.
- **No lleva señal de scroll.** «Seguir bajando» competía visualmente con el
  CTA teniéndolo al lado, y las señales de scroll son un artefacto de UX
  antiguo: la gente hace scroll sola, y el zócalo de tres celdas ya avisa de
  que hay más contenido debajo. Sin ella, el botón negro queda aislado y con
  el máximo contraste e intención.

  Esto arrastra código: hay que quitar `scrollHint` de `content/es/ui.ts`,
  `content/en/ui.ts` y `content/types.ts`, y el `<span>` con `ArrowDown` de
  `sections/Hero.tsx` junto con su import.

### El acento, verificado

«escalable.» usa la variable `$accent`, que resuelve a `#0f766e` en claro y a
`#17a394` en oscuro. Auditado: **en todo el documento no queda ni un color
escrito a mano**. Los seis únicos hex literales están dentro de la hoja de
tokens, que es donde tienen que estar porque su trabajo es documentarlos.

**En el código el token todavía no vale eso.** `src/styles/index.css` sigue con
`--accent: #9e3b22`, el terracota de la paleta cálida. El verde solo existe en
el lienzo hasta que se ejecute el punto 2 del §8.

---

## 5. Contacto — fiel al componente que ya existe

Esta sección **no se rediseña**: replica `sections/Contact.tsx` tal cual, con el
sistema de rail y los tokens nuevos encima.

Cuatro celdas en una rejilla de hairlines (`2 × 2` en escritorio, una columna en
móvil, igual que el `sm:grid-cols-2` del código). Cada celda lleva icono a la
izquierda, la etiqueta en mono versalitas, **el valor real debajo**, y una
flecha diagonal a la derecha:

| Etiqueta       | Valor                       |
| -------------- | --------------------------- |
| `ESCRÍBEME`    | `johnny.phosts@gmail.com`   |
| `GITHUB`       | `github.com/HrHrM`          |
| `LINKEDIN`     | `linkedin.com/in/johnnymlr` |
| `DESCARGAR CV` | `PDF`                       |

Los valores salen de `lib/constants.ts` y las etiquetas de `ui.contact.*`. El
dominio va sin protocolo ni `www.`, que es lo que hace `prettyUrl()`.

**El correo es `johnny.phosts@gmail.com`.** Es el que declara `SITE.email`, y es
el único que puede aparecer aquí: el correo corporativo no es el canal público
de contacto del portafolio.

En el rail, la etiqueta `CANALES`, en la misma posición que `PERFIL` en Sobre mí
y que las etiquetas de grupo en Stack.

### Lo que se descartó: el bloque invertido

La primera versión ponía Contacto a página completa en `ink` con el email en
display a 52 px, como clímax de la página. Se cayó al comprobar que se alejaba
del componente real —cuatro enlaces con su valor a la vista, no un email
gigante y tres etiquetas sin valor— y que el email que mostraba era el
equivocado.

La medición que salió de aquel intento **se conserva porque hace falta para el
modo oscuro**. Sobre `ink`, la mitad de la paleta deja de servir para texto:

| Sobre `ink` | Ratio   | Sirve para                |
| ----------- | ------- | ------------------------- |
| `paper`     | 18,19:1 | texto principal           |
| `surface`   | 16,94:1 | texto principal           |
| `line`      | 14,73:1 | **texto secundario**      |
| `muted`     | 3,38:1  | **nada** — falla AA       |
| `accent`    | 3,39:1  | solo ≥ 24 px o decoración |

Dos consecuencias, que ahora aplican al **modo oscuro** en vez de a Contacto:

1. **`line` cambia de papel sobre fondo oscuro.** En claro es decorativo y se le
   permite fallar (1,23:1); sobre `ink` es el único secundario legible. El token
   es el mismo, el rol no.
2. **`muted` no sirve sobre `ink`**, y `accent` tampoco como texto normal. Los
   dos tokens hay que aclararlos al derivar la paleta oscura, o sustituirlos.

Y el hairline sobre fondo oscuro no puede ser `line` (14,73:1, demasiado fuerte
para algo decorativo): sale de **`paper` al 18% (`#fbfdfc2e`)**, que no es un
séptimo color sino un token existente con alfa.

Con Contacto ya en claro, **el lienzo no contiene ningún bloque oscuro**, así
que el modo oscuro sigue entero por definir en `tokens.md` §4. Lo que queda de
este apartado son los números, no una maqueta.

---

## 6. Otras decisiones del lienzo

- **Stack como tabla de datos, no como nube de badges.** Cada grupo es una fila
  con hairline superior; los items van en mono a 14 px separados por divisores
  verticales de 1 px. Un badge por tecnología convierte la sección en una nube de
  pastillas, que es exactamente el aspecto genérico que el §1 prohíbe.
- **`MI ROL` es la única caja de la página**, en `surface`. Se sostiene porque es
  el contenido que separa un caso de estudio de una demo, y porque es literalmente
  lo que un reclutador busca en la tarjeta. Todo lo demás se ordena con hairlines
  y aire.
- **`RESULTADO` lleva una barra de acento de 3 px a la izquierda.** Solo aparece
  cuando el proyecto tiene `outcome`, así que no todas las fichas la llevan — y
  eso es correcto: la barra marca que hay un número detrás.
- **Problema y Solución van en dos columnas de 456 px.** En una sola columna a
  1088 px la línea pasa de 100 caracteres y deja de leerse.
- **El acento aparece tres veces en 7045 px**: «escalable.» en el Hero, y las
  barras de `RESULTADO` de las fichas 03 y 04. Sigue siendo «una vez por
  pantalla» en el sentido del §4, porque nunca coinciden dos en un viewport.
- **La ficha sigue sin ser un enlace.** No hay hover que insinúe que se puede
  entrar; los únicos enlaces son los de salida.
- **Formación cierra la sección 01**, debajo de APPS2GO y antes de Sobre mí,
  con la misma retícula de fecha + contenido que un puesto: título en display
  a 27, universidad en mono versalitas y la nota de tesis en texto corrido. La
  precede una fila con el rótulo `FORMACIÓN` en mono. Es lo que ya hace
  `Experience.tsx`, y sigue sin ser sección propia: una carrera no compite en
  importancia con tres puestos.
- **`RESULTADO` solo aparece en las fichas 03 y 04**, que son las dos que
  definen `outcome` en `projects.ts`. Las fichas 01, 02 y 05 no lo llevan
  porque no lo tienen — la 01 tiene un `TODO` pendiente en el contenido. No es
  un olvido de la maqueta.

### Los controles de la Navbar

Orden, igual que en el código: marca a la izquierda; a la derecha los cinco
enlaces, `ES / en`, y el conmutador de tema. En móvil desaparecen los enlaces y
quedan `ES / en`, tema y menú.

El conmutador es una caja de 36 × 36 con el icono de sol a 16 px, y el botón de
menú en móvil es igual. Coincide con `ThemeToggle.tsx` (`size-9`, `size-4`)
salvo en un punto:

**El borde va en `muted`, no en `line`.** Hoy `ThemeToggle.tsx` usa
`border-line`, y eso contradice la regla del §4 del CLAUDE.md: «cualquier borde
que signifique algo usa `muted` o `ink`, nunca `line`». El borde de un botón
significa algo —es la afordancia de que se puede pulsar— y a 1,23:1 no se ve.
Con `muted` (5,38:1) se lee como el control que es.

**Cuidado con lo que promete este botón.** Ahora mismo conmuta a un modo oscuro
que no está definido: el bloque `.dark` de `index.css` sigue con la paleta
cálida vieja. El botón se dibuja en la maqueta porque existe en el producto,
pero **no debe entrar en producción con menta clínico hasta que se deriven los
seis tokens oscuros** (`tokens.md` §4). Si no, pulsarlo lleva a una página con
dos paletas distintas.

---

## 7. Cómo colapsa en móvil

El artboard de 390 existe porque el §4 exige mobile-first y **un rail de 120 px no
cabe en 390**. No es una reducción proporcional, es otra regla:

- **El rail desaparece.** Su contenido sube a una fila de metadatos horizontal
  sobre el título: `03 │ 2024 │ BAJO NDA`.
- **El número de sección se pone en línea con el título**, a 26 px junto a un
  título de 30. El hairline vertical desaparece; solo quedan los horizontales.
- **Titular del Hero a 40 px, no 44.** A 44 «arquitectura web» se desborda de los
  350 px útiles. Verificado en el lienzo, no estimado.
- **El zócalo de datos pasa de tres columnas a tres filas** con la clave a la
  izquierda y el valor a la derecha.
- **Problema y Solución se apilan**; las dos columnas de 456 no tienen sentido.
- **Las cuatro celdas de Contacto pasan a una sola columna**, igual que hace el
  `sm:grid-cols-2` del componente real.
- **El CTA pasa a ancho completo.**

---

## 8. Lo que esta dirección obliga a cambiar en el código

En orden de dependencia. Los puntos 1, 2, 8 y 9 están **hechos**; el resto no.

1. [x] Lo que ya listaba `tokens.md` §1: quitar `@fontsource/instrument-serif`,
       el `@font-face` de reserva con `size-adjust`, la regla `font-weight: 400` en
       `h1,h2,h3`, y las cuatro líneas de `root.tsx`.
2. [x] Los seis tokens de color de `:root`, a los valores de `tokens.md` §3.

   Con ellos entró lo que no estaba previsto y el lienzo destapó al medir:
   **la escala tipográfica había que recalibrarla.** El suelo de `--text-hero`
   baja de `2.75rem` a `2.5rem` (a 44 px «arquitectura web» se desborda en un
   viewport de 390) y el tope de `6rem` a `5.25rem`. `--text-section` y
   `--text-lead` se ajustan igual, a los valores medidos.

   Y hacían falta **tokens que no existían**: `--tracking-display` /
   `--tracking-card`, en `em` y no en `px` para que el apretón acompañe al
   `clamp()` — a 84 px hacen falta −2.4 px, y ese mismo valor a 40 px parte las
   palabras. Se aplican en la capa base a `h1,h2` y `h3`, no por componente:
   es una propiedad de la fuente al display, no una decisión por sección.
   También `--spacing-rail` y `--spacing-rail-md`, para los 120/112 px del §10.

3. **`SectionHeading` cambia de estructura**: hoy es un flex con el número en mono
   a 13 px. Pasa a título + hairline, con los 120 px del rail en el
   `padding-left`, y **deja de pintar `index`** (§3). Quitar también los
   `01`–`05` de la Navbar.
4. **Un primitivo nuevo, `RailRow`** (rail 120 px + cuerpo con hairline
   izquierdo), que usan Experiencia, Stack y ProjectCard. Sin él, las tres
   secciones repiten la misma retícula a mano.
5. [x] El zócalo de datos del Hero, con sus tres valores en
       `content/{es,en}/ui.ts` — son texto traducible, igual que el `eyebrow`.

   El acento del titular también salió a contenido, como `headlineAccent`, y el
   Hero parte `headline` por esa subcadena: así el `<h1>` sigue siendo una sola
   cadena traducible y lo que ve Google es la frase entera. **Se declara por
   idioma y no se deduce como «última palabra»** porque no cae en el mismo
   sitio: en español cierra la frase («escalable.») y en inglés va en medio
   («scalable»).

   El Hero no tiene rail pero se alinea con él, con
   `md:pl-[calc(gutter+rail-md)]` y su `lg:` — así el titular arranca en la
   misma columna que todo el contenido de abajo.

6. Contacto: solo cambia el envoltorio (rail + etiqueta `CANALES`). La rejilla
   de cuatro celdas, los valores y `prettyUrl()` se quedan como están.
7. `ThemeToggle.tsx`: `border-line` → `border-muted`, y el mismo tratamiento
   para el botón de menú de la Navbar.
8. [x] Quitar `scrollHint` de los dos `ui.ts`, de `types.ts` y de `Hero.tsx`
       (§4).
9. [x] **El bloque `.dark` de `index.css`**, con los seis tokens oscuros de
       `tokens.md` §5. Con esto el conmutador de tema ya puede salir a producción:
       la advertencia de que llevaba a la paleta cálida vieja queda resuelta.
10. **Un breakpoint `lg` (1024)** además del `md` que ya hay, para las dos
    columnas de Problema/Solución y los divisores del Stack (§10).
11. `NotFound.tsx` y `SkipLink.tsx`, que ya existen y ahora tienen diseño.

**Lo que NO cambia:** el orden de las secciones, `SECTION_IDS`, el modelo de
datos, la decisión de una sola página por idioma, y la única animación del Hero.

---

## 9. Los siete artboards

`design.pen` contiene, además de la hoja de tokens:

| Artboard                         | Medida    | Qué prueba                                 |
| -------------------------------- | --------- | ------------------------------------------ |
| `Home · rail + masa tipográfica` | 1440×7364 | la página completa en claro                |
| `Home · modo oscuro`             | 1440×7364 | la misma página con `theme: {mode:"dark"}` |
| `Tablet 768 · rail estrecho`     | 768×3035  | el estado intermedio del rail              |
| `Movil 390 · rail colapsado`     | 390×4031  | la página completa en móvil                |
| `Móvil · menú abierto`           | 390×520   | el panel de navegación desplegado          |
| `Estados de interacción`         | 1260×893  | reposo / hover / foco de todo lo pulsable  |
| `404 · escritorio`               | 1440×845  | `NotFound.tsx`                             |

El artboard oscuro **no es una copia con colores a mano**: las seis variables de
color del documento son variables con tema (`mode: light | dark`) y el artboard
solo declara el tema. Cambiar un token cambia los dos a la vez, que es
exactamente la relación que tendrán `:root` y `.dark` en el CSS.

---

## 10. Los tres anchos

El rail de 120 px es la pieza nueva, y es la que decide los cortes. **Hacen falta
dos breakpoints, no uno.** El código hoy usa un solo `md:` (768).

| Ancho      | Rail       | Problema/Solución | Stack                    |
| ---------- | ---------- | ----------------- | ------------------------ |
| `< 768`    | colapsado  | apilados          | lista envuelta, sin rail |
| `768–1023` | **112 px** | apilados          | envuelta, con rail       |
| `≥ 1024`   | 120 px     | dos columnas 456  | una línea con divisores  |

- **El rail aparece en `md` (768) y se estrecha a 112 px**, no a 120. Con 96 px
  «— Actualidad» se desbordaba; medido, no estimado.
- **Las dos columnas de Problema/Solución necesitan un `lg` (1024) nuevo.** A
  768 quedan unos 544 px de cuerpo y dos columnas de 456 no caben ni de lejos.
- **Los divisores verticales del Stack solo existen en escritorio.** Debajo de
  `lg` los items se envuelven en varias líneas, y un divisor colgando al final
  de una línea queda huérfano. Envueltos van con separación y sin divisor.
- **El Hero no tiene rail** pero se alinea con él: su `padding-left` es
  `rail + 32`, así el titular arranca en la misma columna que todo lo demás.

---

## 11. Estados de interacción

Están en el artboard `Estados de interacción`, en tres columnas —reposo, hover,
foco— para cada elemento pulsable.

| Elemento             | Reposo                     | Hover               |
| -------------------- | -------------------------- | ------------------- |
| Enlace de navegación | `muted`                    | `ink`               |
| Sección activa       | `ink` + subrayado          | sin cambio          |
| Botón sólido (CTA)   | fondo `ink`                | fondo `accent`      |
| Conmutador / menú    | borde y icono `muted`      | borde e icono `ink` |
| Celda de contacto    | fondo `paper`              | fondo `surface`     |
| Enlace de salida     | `ink` + subrayado          | `accent`            |
| Selector de idioma   | activo `ink`, otro `muted` | los dos `ink`       |

**El foco es el mismo en todos: `outline: 2px solid var(--color-accent)` con
`offset: 3px`**, que es lo que ya hay en `index.css`. Pasa de sobra: el acento da
5,36:1 sobre `paper` y 4,99:1 sobre `surface`, frente al 3:1 que pide un elemento
no textual. **No se elimina nunca** — es suelo de accesibilidad, no decoración.

El `SkipLink` es el único elemento cuyo estado de reposo es _no existir_: vive
fuera de pantalla y solo aparece al recibir foco, como un botón sólido.

Nada de esto necesita diseñarse otra vez: se implementa leyendo la tabla.

---

## 12. Lo que sigue sin resolverse

Ya no hay nada que bloquee la implementación. Queda esto:

- **El campo `cover` de `Project` no tiene sitio en el diseño.** Ningún proyecto
  lo usa. O se le hace hueco en la ficha, o se quita del tipo.
- **Pendientes de contenido**, heredados del CLAUDE.md §8: `public/cv.pdf` no
  existe y el enlace de Contacto va a un 404; `SITE.url` sigue en
  `https://example.com`, así que las canónicas y los hreflang apuntan fuera; y
  la ficha 01 tiene un `TODO` de `outcome` sin resolver.
- **La longitud.** La página mide 7364 px y Proyectos se lleva 3305 — el 45%.
  Es coherente con la página única y con el §5 del CLAUDE.md («3 o 5, no doce»),
  pero es el dato de partida si algún día se cuestiona el formato.
