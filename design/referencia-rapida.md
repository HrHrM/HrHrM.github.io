# Referencia rápida — fuentes y colores

Hoja de consulta. Solo valores, sin razonamiento: **el por qué de cada decisión
está en [`tokens.md`](./tokens.md)** y su aplicación en
[`direccion-visual.md`](./direccion-visual.md).

Todo esto está **implementado** en `src/styles/index.css`, que es la única
fuente de verdad. Si algo de aquí no coincide con ese fichero, gana el fichero.

Leído del código el 2026-09-07. Los contrastes y la escala están calculados, no
estimados.

---

## Colores

Seis tokens y nada más. Dos modos.

| Token     | Claro     | Oscuro    | Para qué                        |
| --------- | --------- | --------- | ------------------------------- |
| `paper`   | `#fbfdfc` | `#0d1614` | el fondo                        |
| `surface` | `#eff6f3` | `#16211e` | fondos de realce, hover, badges |
| `line`    | `#dbe8e2` | `#232f2c` | los hairlines — **decorativos** |
| `muted`   | `#5b6d66` | `#7d8f89` | metadatos, texto secundario     |
| `ink`     | `#0b1512` | `#eef4f1` | el texto                        |
| `accent`  | `#0f766e` | `#17a394` | **una vez por pantalla**        |

En Tailwind: `bg-paper`, `text-ink`, `border-line`, `text-muted`,
`text-accent`, `bg-surface`.

### Dos reglas que no se negocian

1. **Cualquier borde que signifique algo usa `muted` o `ink`, nunca `line`.**
   `line` está por debajo de 1,4:1 a propósito: es decorativo. El borde de un
   botón sí significa algo — es la afordancia de que se puede pulsar — así que
   va en `muted`.
2. **El acento aparece una vez por pantalla.** Hoy son tres en toda la página y
   nunca coinciden dos en un viewport: la palabra del titular y las barras de
   `RESULTADO` de las fichas 03 y 04.

### Contraste verificado (WCAG 2.1)

| Par                      | Claro   | Oscuro  | Mínimo | Estado     |
| ------------------------ | ------- | ------- | ------ | ---------- |
| `ink` sobre `paper`      | 18,19:1 | 16,50:1 | 4,5    | AAA        |
| `ink` sobre `surface`    | 16,94:1 | 14,83:1 | 4,5    | AAA        |
| `muted` sobre `paper`    | 5,38:1  | 5,40:1  | 4,5    | AA         |
| `muted` sobre `surface`  | 5,01:1  | 4,85:1  | 4,5    | AA         |
| `accent` sobre `paper`   | 5,36:1  | 5,87:1  | 4,5    | AA         |
| `accent` sobre `surface` | 4,99:1  | 5,28:1  | 4,5    | AA         |
| `paper` sobre `ink`      | 18,19:1 | 16,50:1 | 4,5    | AAA        |
| `paper` sobre `accent`   | 5,36:1  | 5,87:1  | 4,5    | AA         |
| `line` sobre `paper`     | 1,23:1  | 1,33:1  | —      | decorativo |
| `line` sobre `surface`   | 1,15:1  | 1,19:1  | —      | decorativo |

**El par más justo es `accent` sobre `surface` en claro: 4,99:1.** Si alguna vez
se aclara `surface` o se oscurece el acento, hay que recalcular.

`accent` sobre `ink` (3,39:1 claro / 2,81:1 oscuro) y `muted` sobre `ink`
**no están en la tabla porque no son pares reales**: `ink` es color de texto,
nunca fondo. La única excepción es el botón sólido, y ahí encima va `paper`.

### Foco de teclado

`outline: 2px solid var(--color-accent)` con `outline-offset: 3px`. Un elemento
no textual pide 3:1 y el acento da 5,36:1 sobre papel. **No se elimina nunca.**

---

## Fuentes

Dos familias y la mono. Ambas variables (400–900) y **autohospedadas** con
Fontsource, no enlazadas desde Google Fonts.

| Rol         | Familia           | Peso | Dónde                                        |
| ----------- | ----------------- | ---- | -------------------------------------------- |
| **Display** | Schibsted Grotesk | 800  | `<h1>`, títulos de sección y de tarjeta      |
| **Texto**   | Schibsted Grotesk | 400  | párrafos, resúmenes, highlights, taglines    |
| **Mono**    | JetBrains Mono    | 400  | eyebrow, fechas, números, etiquetas, botones |

En Tailwind: `font-display`, `font-sans`, `font-mono`.

**Display y texto son la misma familia en dos pesos, a propósito.** La jerarquía
sale del peso y del tamaño, no del cambio de familia. Se mantienen como dos
tokens distintos para poder volver a separarlos sin tocar todos los componentes.

Paquetes: `@fontsource-variable/schibsted-grotesk` y
`@fontsource-variable/jetbrains-mono`. **Nada de serif** — el display serif se
descartó y se volvió a descartar tras probarlo (`tokens.md` §1).

### Escala, resuelta en píxeles

| Token            | Fórmula                                  | 390 px | 768 px | 1440 px |
| ---------------- | ---------------------------------------- | ------ | ------ | ------- |
| `--text-hero`    | `clamp(2.5rem, 7.5vw, 5.25rem)`          | 40     | 58     | 84      |
| `--text-section` | `clamp(1.875rem, 2.2vw + 1rem, 2.75rem)` | 30     | 33     | 44      |
| `--text-card`    | `clamp(1.625rem, 1.5vw + 0.6rem, 2rem)`  | 26     | 26     | 31      |
| `--text-lead`    | `clamp(1rem, 0.8vw + 0.75rem, 1.25rem)`  | 16     | 18     | 20      |
| `--text-meta`    | `0.8125rem`                              | 13     | 13     | 13      |

En Tailwind: `text-hero`, `text-section`, `text-card`, `text-lead`, `text-meta`.

**El suelo del hero es 40 px y no 44 por una razón medida:** a 44 px
«arquitectura web» se desborda de los 350 px útiles de un viewport de 390.

### Tracking

Solo para el display. **En `em` y no en `px`** para que el apretón acompañe al
`clamp()`: a 84 px hacen falta unos −2,4 px, y ese mismo valor absoluto a 40 px
parte las palabras.

| Token                | Valor      | Se aplica a | Resuelto                   |
| -------------------- | ---------- | ----------- | -------------------------- |
| `--tracking-display` | `-0.028em` | `h1`, `h2`  | −2,35 px a 84 · −1,12 a 40 |
| `--tracking-card`    | `-0.02em`  | `h3`        | −0,64 px a 32 · −0,52 a 26 |

Se aplican en la capa base de `index.css`, no por componente: es una propiedad
de la fuente al display, no una decisión por sección.

**En el texto corrido va a cero.** Aplicar tracking negativo al cuerpo lo hace
ilegible.

---

## Espaciado y retícula

| Token               | Valor                         | Para qué                       |
| ------------------- | ----------------------------- | ------------------------------ |
| `--spacing-section` | `clamp(4.5rem, 10vw, 9rem)`   | aire vertical entre secciones  |
| `--spacing-gutter`  | `clamp(1.25rem, 5vw, 2.5rem)` | margen lateral del `Container` |
| `--spacing-rail`    | `7.5rem` (120 px)             | el rail, desde `lg`            |
| `--spacing-rail-md` | `7rem` (112 px)               | el rail entre `md` y `lg`      |

Resuelto: `section` 72 / 77 / 144 px y `gutter` 20 / 38 / 40 px a 390 / 768 / 1440.

**El rail se estrecha a 112 px en tablet y desaparece debajo de `md`** (el
metadato sube sobre el contenido). Los 120 px no son arbitrarios: con 96 px
«— Actualidad» se desborda en la columna de fechas.

---

## Animación

Una sola en todo el sitio, y solo en el Hero.

```
--animate-reveal: reveal-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
```

`fade + translateY(8px)`, escalonada con `[animation-delay:...]` en el eyebrow,
el titular, el CTA y el zócalo. En Tailwind: `animate-reveal`.

**Cuidado al anular con `prefers-reduced-motion`:** hay que poner a cero el
`animation-delay` **además** de la duración. Con `fill-mode: both`, anular solo
la duración deja el elemento invisible durante todo el retardo.

---

## El bloque, listo para copiar

```css
:root {
  --paper: #fbfdfc;
  --surface: #eff6f3;
  --line: #dbe8e2;
  --muted: #5b6d66;
  --ink: #0b1512;
  --accent: #0f766e;
}

.dark {
  --paper: #0d1614;
  --surface: #16211e;
  --line: #232f2c;
  --muted: #7d8f89;
  --ink: #eef4f1;
  --accent: #17a394;
}

@theme inline {
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-muted: var(--muted);
  --color-ink: var(--ink);
  --color-accent: var(--accent);

  --font-display:
    'Schibsted Grotesk Variable', ui-sans-serif, system-ui, sans-serif;
  --font-sans:
    'Schibsted Grotesk Variable', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, monospace;

  --text-hero: clamp(2.5rem, 7.5vw, 5.25rem);
  --text-section: clamp(1.875rem, 2.2vw + 1rem, 2.75rem);
  --text-card: clamp(1.625rem, 1.5vw + 0.6rem, 2rem);
  --text-lead: clamp(1rem, 0.8vw + 0.75rem, 1.25rem);
  --text-meta: 0.8125rem;

  --tracking-display: -0.028em;
  --tracking-card: -0.02em;

  --spacing-section: clamp(4.5rem, 10vw, 9rem);
  --spacing-gutter: clamp(1.25rem, 5vw, 2.5rem);
  --spacing-rail: 7.5rem;
  --spacing-rail-md: 7rem;

  --animate-reveal: reveal-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

`@theme inline` y no `@theme`: hace que Tailwind **referencie** la variable en
vez de copiar su valor, que es lo único que permite que `.dark` la sobreescriba.

Y hace falta declarar el modo oscuro a mano, porque Tailwind v4 no lo trae por
clase:

```css
@custom-variant dark (&:where(.dark, .dark *));
```
