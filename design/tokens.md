# Tokens de diseño — decididos

Tipografía y color elegidos el 2026-09-06 sobre el lienzo de `design/design.pen`.
Esto **no** es una propuesta: es lo que se aplica. Lo que queda abierto va
marcado como pendiente al final.

Si algo de aquí contradice al código, gana el código: actualiza este archivo.

---

## 1. Tipografía — sin serif

Se descarta el display serif. Dos familias y nada más:

| Rol         | Familia               | Pesos            | Dónde se usa                                                   |
| ----------- | --------------------- | ---------------- | -------------------------------------------------------------- |
| **Display** | Schibsted Grotesk 800 | variable 400–900 | `<h1>` del Hero, títulos de sección, títulos de tarjeta        |
| **Texto**   | Schibsted Grotesk 400 | variable 400–900 | texto corrido: resúmenes, highlights, párrafos, taglines       |
| **Mono**    | JetBrains Mono        | variable 400–900 | eyebrow, números, fechas, etiquetas de bloque, badges, botones |

El display y el texto son **la misma familia en dos pesos**. La jerarquía sale
del peso y del tamaño, no del cambio de familia.

### Probado otra vez, y descartado otra vez

El 2026-09-06 se montó un artboard de prueba con Instrument Serif aplicado a los
23 elementos display de la maqueta, a peso 400 (el único que tiene) y con el
tracking reducido al 30%, que es lo que pide un serif a ese peso. Se descartó, y
el motivo conviene tenerlo escrito:

- **El Hero gana aire editorial**, es cierto. A igualdad de píxeles se lee más
  ligero por la altura de x menor, pero a 84 px eso todavía se sostiene.
- **Las cabeceras de sección se caen.** «Experiencia» a 44 px en serif 400 no
  pesa lo suficiente junto al hairline y a la mono en versalitas: deja de
  funcionar como marcador de sección.
- **Los títulos de ficha quedan en tierra de nadie**, con muy poco contraste
  contra su propio tagline, que va en grotesk 400 justo debajo.

La conclusión: el serif funciona donde sobra tamaño y falla donde la jerarquía
depende del peso. Con una familia variable eso se arregla subiendo a 800; con
Instrument Serif esa palanca no existe.

**Queda abierta una tercera vía por si algún día se retoma**: serif solo en el
`<h1>` del Hero y grotesk 800 en secciones y tarjetas. Rompe la regla de «máximo
dos familias + la mono» del CLAUDE.md §4, así que habría que cambiarla a
conciencia, no de refilón.

### Tracking negativo en el display

Schibsted Grotesk a peso 800 y tamaño grande necesita apretarse o las palabras
se separan. Valores usados en el lienzo, verificados a la vista:

| Tamaño             | `letter-spacing`  |
| ------------------ | ----------------- |
| Hero (72–84 px)    | `-2.4px`          |
| Sección (38–48 px) | `-1` a `-1.2px`   |
| Tarjeta (24–30 px) | `-0.5` a `-0.6px` |
| Texto corrido      | `0` (sin tocar)   |

El tracking negativo es **solo para el display**. Aplicarlo al cuerpo lo hace
ilegible.

### Lo que se cae al quitar Instrument Serif

Tres cosas del sistema actual dejan de tener sentido, y hay que quitarlas:

1. **El `@font-face` de reserva `Instrument Serif Fallback`** en
   `src/styles/index.css`, con su `size-adjust: 76.7%`. Esa medición existía
   porque Georgia es un 30% más ancha que Instrument Serif. Sin serif no hace
   falta: Schibsted Grotesk ya tiene reserva razonable en cualquier
   `system-ui`.
2. **El suelo de `--text-card` en `1.5rem`.** Estaba puesto porque Instrument
   Serif tiene la altura de x mucho menor que Schibsted Grotesk y el título de
   tarjeta se veía por debajo de su propio tagline en móvil. Con una sola
   familia ese desajuste desaparece y el suelo se puede revisar a la baja.
3. **La regla `font-weight: 400` en `h1, h2, h3`**, y el comentario que la
   justifica («Instrument Serif es estática: peso 400 y nada más»). Es
   justo al revés: ahora el peso **sí** es un recurso de jerarquía, y el
   display vive en 800.

### Paquetes

`@fontsource/instrument-serif` se desinstala. En `src/root.tsx` sobran cuatro
líneas: el `import` del `.woff2` de precarga y los tres `import` de CSS
(`latin-400`, `latin-ext-400`, `latin-400-italic`).

Se quedan `@fontsource-variable/schibsted-grotesk` y
`@fontsource-variable/jetbrains-mono`, que ya están instalados.

---

## 2. Color — menta clínico

Seis tokens, como hasta ahora. Verde azulado, frío, de producto más que de
imprenta.

| Token     | Hex       | Para qué                        |
| --------- | --------- | ------------------------------- |
| `paper`   | `#fbfdfc` | el fondo                        |
| `surface` | `#eff6f3` | fondos de realce, hover, badges |
| `line`    | `#dbe8e2` | los hairlines — **decorativos** |
| `muted`   | `#5b6d66` | metadatos, texto secundario     |
| `ink`     | `#0b1512` | el texto                        |
| `accent`  | `#0f766e` | **una vez por pantalla**        |

### Ojo con el acento: no es el que se eligió en el lienzo

El acento que se vio y se aprobó en el lienzo era `#0d9488`. **No se puede
usar**: da 3,67:1 sobre el papel, y el proyecto exige AA (4,5:1) en todo par de
texto. Falla en los dos sitios donde más se nota — el texto del acento sobre el
fondo, y el texto claro dentro de un botón relleno de acento.

`#0f766e` es el mismo menta un escalón más oscuro, conserva el carácter y pasa
AA en todo con 5,36:1. Es el que va en el token.

Si en algún momento se quiere recuperar el `#0d9488` original, solo vale para
**texto grande** (≥ 24 px o ≥ 19 px en negrita) o para elementos decorativos
que no comuniquen nada por sí solos.

### Contraste verificado

Calculado con la fórmula WCAG 2.1, no a ojo:

| Par                      | Ratio   | Resultado       |
| ------------------------ | ------- | --------------- |
| `ink` sobre `paper`      | 18,19:1 | AAA             |
| `ink` sobre `surface`    | 16,94:1 | AAA             |
| `paper` sobre `ink`      | 18,19:1 | AAA             |
| `muted` sobre `paper`    | 5,38:1  | AA              |
| `muted` sobre `surface`  | 5,01:1  | AA              |
| `accent` sobre `paper`   | 5,36:1  | AA              |
| `accent` sobre `surface` | 4,99:1  | AA              |
| `paper` sobre `accent`   | 5,36:1  | AA              |
| `line` sobre `paper`     | 1,23:1  | **a propósito** |

`line` es decorativo y por eso se le permite fallar. **Cualquier borde que
signifique algo usa `muted` o `ink`, nunca `line`.** Es la misma regla que ya
había con la paleta cálida.

El par más justo es `accent` sobre `surface` con 4,99:1. Margen suficiente,
pero si alguna vez se aclara `surface`, hay que recalcular.

---

## 3. Cómo queda en `src/styles/index.css`

```css
:root {
  --paper: #fbfdfc;
  --surface: #eff6f3;
  --line: #dbe8e2;
  --muted: #5b6d66;
  --ink: #0b1512;
  --accent: #0f766e;
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
}
```

`--font-display` y `--font-sans` apuntan a la misma familia **a propósito**. Se
mantienen como dos tokens distintos para que el día que se quiera volver a
separar display y texto no haya que tocar todos los componentes.

---

## 4. Pendiente

- [x] **Modo oscuro — derivado y verificado el 2026-09-06.** Ver §5 más abajo.
- [ ] **Revisar el suelo de `--text-card`** ahora que ya no hay desajuste de
      altura de x entre familias.
- [x] **Dirección visual.** Plantada el 2026-09-06 en `design.pen` como dos
      artboards completos —escritorio 1440 y móvil 390—, y escrita en
      `direccion-visual.md`. Es «el sistema como apuesta»: el rail de
      metadatos de 120 px sustituye al display serif como elemento que da
      carácter. Pendiente de aprobación; nada implementado todavía.

---

## 5. Modo oscuro — menta clínico nocturno

Derivado el 2026-09-06 y verificado con la fórmula WCAG 2.1, no a ojo. Está
aplicado en el artboard **`Home · modo oscuro`** de `design.pen`, que no es una
copia con colores a mano: las seis variables del lienzo son **variables con
tema** (`mode: light | dark`) y el artboard solo declara `theme: {mode: "dark"}`.

| Token     | Claro     | Oscuro    |
| --------- | --------- | --------- |
| `paper`   | `#fbfdfc` | `#0d1614` |
| `surface` | `#eff6f3` | `#16211e` |
| `line`    | `#dbe8e2` | `#232f2c` |
| `muted`   | `#5b6d66` | `#7d8f89` |
| `ink`     | `#0b1512` | `#eef4f1` |
| `accent`  | `#0f766e` | `#17a394` |

### Contraste verificado, los dos modos

| Par                      | Claro   | Oscuro  |
| ------------------------ | ------- | ------- |
| `ink` sobre `paper`      | 18,19:1 | 16,50:1 |
| `ink` sobre `surface`    | 16,94:1 | 14,83:1 |
| `muted` sobre `paper`    | 5,38:1  | 5,40:1  |
| `muted` sobre `surface`  | 5,01:1  | 4,85:1  |
| `accent` sobre `paper`   | 5,36:1  | 5,87:1  |
| `accent` sobre `surface` | 4,99:1  | 5,28:1  |
| `paper` sobre `ink`      | 18,19:1 | 16,50:1 |
| `paper` sobre `accent`   | 5,36:1  | 5,87:1  |
| `line` sobre `paper`     | 1,23:1  | 1,33:1  |

Los diez pares de texto pasan AA en los dos modos. `line` sigue siendo
decorativo y se le permite fallar.

**`accent` sobre `ink` (2,81:1) y `muted` sobre `ink` (3,06:1) no aparecen en la
tabla porque no son pares reales:** `ink` es color de texto, nunca fondo. La
única excepción es el botón sólido, y ahí encima va `paper` — 16,50:1.

### El criterio no fue «que apruebe», fue «que pese igual»

Es lo que más tiempo llevó. Media docena de candidatos pasaban AA con holgura y
aun así estaban mal:

- **El acento no se puede reutilizar.** `#0f766e`, el acento claro, da 4,91:1
  sobre el papel oscuro pero **4,41:1 sobre `surface`: falla AA**. Hay que
  aclararlo sí o sí.
- **Y no se puede aclarar de más.** Los tealcandidatos obvios (`#2dd4bf`,
  `#4fd1c5`, `#14b8a6`) daban entre 7,4:1 y 9,9:1. Aprueban de sobra, pero en
  claro el acento vive en 5,36:1: a 9,9 el acento **brilla** y rompe la regla
  de «aparece una vez por pantalla» sin aparecer más veces. `#17a394` (5,87:1)
  es el que conserva la misma presencia relativa.
- **Lo mismo con `muted`:** 5,40:1 frente a los 5,38:1 del claro. Los
  candidatos más claros llegaban a 6,98:1 y volvían gris el texto secundario.
- **El hairline sube un poco a propósito**, de 1,23:1 a 1,33:1. A igual ratio,
  una línea de un pelo sobre fondo oscuro se pierde más que sobre papel.
