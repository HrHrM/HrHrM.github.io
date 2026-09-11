# Lista de lanzamiento

**Publicado el 2026-09-11 en https://hrhrm.github.io** (GitHub Pages, _user
page_, desplegado por Actions).

Lo que queda abajo está comprobado contra el sitio en producción, no supuesto
ni leído del código. Cuando algo dice «medido», el número sale de ejecutarlo.

---

## 1. Bloqueantes — ✅ los cinco cerrados

### 1.1 ~~El dominio, y `SITE.url`~~ ✅ HECHO

`SITE.url` es ahora `https://hrhrm.github.io`. Verificado en producción: la
canónica, los tres `hreflang`, el `og:url`, el `og:image` y las dos entradas
del sitemap apuntan al sitio real.

Lo que sigue valiendo de esta sección: el día que haya dominio propio, migrar
es **editar esta constante y regenerar las OG**. Nada más, porque el sitio
cuelga de la raíz.

<details><summary>Cómo estaba</summary>

`src/lib/constants.ts:10` decía `url: 'https://example.com'`.

No es cosmético. De ahí salen **las canónicas, los `hreflang` y la URL
absoluta de `og:image`**. Publicar así le está diciendo a Google que la
versión canónica de tu portafolio vive en `example.com`, y que la imagen para
compartir está en un dominio que no es tuyo.

**Era el primer bloqueante porque desbloqueaba los demás.**

</details>

### 1.2 ~~Decidir dónde se publica~~ ✅ HECHO

GitHub Pages como _user page_, desplegado desde `.github/workflows/deploy.yml`.
El repositorio pasó a público y se renombró a `HrHrM.github.io`, que es lo que
hace que el sitio cuelgue de la raíz.

Verificado en producción: `/` y `/en` responden 200, `http://` redirige a
HTTPS con 301, una ruta inexistente da 404 —el `404.html` funciona— y el
prerender trae el nombre y las seis secciones.

<details><summary>Por qué user page y no project page</summary>

El `buildEnd` ya deja `404.html` y `.nojekyll`. Pero hay una trampa:

- **Dominio propio o _user page_** (`usuario.github.io`) → no hay nada que
  tocar.
- _**Project page**_ (`usuario.github.io/portfolio/`) → **se rompe todo lo
  que sea ruta absoluta**. Haría falta `base` en `vite.config.ts` y `basename`
  en el router. Es un cambio que se propaga.

Y esa trampa habría que **deshacerla** el día que llegue un dominio propio.

</details>

### 1.3 ~~El favicon está en la paleta vieja~~ ✅ HECHO

Es un **cometa**, dibujado como vector con los tokens actuales: cuadrado de
tinta, núcleo en papel y cola en el acento. Nace de `design/comet-referencia.png`
pero no es un trazado de esa imagen — ver el comentario del propio SVG para el
porqué.

Van tres ficheros, y cada uno cubre un hueco: `favicon.svg` para navegadores
modernos, `favicon.ico` (16/32/48) para Safari, que sigue sin leer favicons en
SVG, y `apple-touch-icon.png` (180×180, sin esquinas redondeadas) para la
pantalla de inicio de iOS. Los tres suman 12 KB.

### 1.4 ~~Las OG están desactualizadas~~ ✅ HECHO

Regeneradas con la paleta teal, Schibsted Grotesk y el titular de hoy. 1200×630,
~50 KB cada una.

El generador **existe ahora en el repo**, que antes no: `scratchpad/og.html` más
`scratchpad/og.mjs`, y se lanza con `npm run og`. El CLAUDE.md lo mencionaba pero
el fichero no estaba versionado, así que no había forma de regenerarlas.

Dos medidas que decidieron el diseño: el nombre va a 96px porque a 104 mide
933px y solo hay 928 útiles —partía en dos líneas—, y los datos van a 15px
porque a 17 «3 · Empresarial y multi-cliente» pedía 306px en una columna de 282.

### 1.5 ~~Peso muerto en `public/`~~ ✅ HECHO

`public/GPTW momento.jpg` borrado — 422 KB que se publicaban sin que nadie los
referenciara. `public/` baja de 675 KB a 175 KB.

`comet.png` tampoco se queda en `public/`: era la referencia del favicon, ya no
hace falta servirla, y se movió a `design/comet-referencia.png`.

**Sigue ahí `src/assets/johnny.webp`** (109 KB). No lo importa ningún componente
desde que se quitó la foto, pero al estar en `src/assets/` Vite no lo incluye en
el build si nadie lo importa, así que no pesa en lo publicado. Borrarlo o no es
indiferente para el sitio.

---

## 2. Contenido pendiente

### 2.1 El enlace de Play Store es de la tienda de Venezuela

`https://play.google.com/store/apps/details?id=com.galisales.app`

Desde fuera del país puede responder «no disponible en tu región». Es el único
proyecto que se anuncia como publicado, así que un reclutador de fuera pulsa
la única prueba comprobable que hay y se encuentra un error.

Opciones: dejarlo y añadir una nota, o quitar el enlace y describirlo sin él.

### 2.2 La app POS sigue marcada como NDA

Confirmado por ti. Solo queda anotado aquí para que no se cuele en una
revisión futura como si fuera un olvido.

### 2.3 Limpiar el GitHub público

El sitio enlaza a `github.com/HrHrM`, que fija repos de práctica
(`*_practice001`, `ReactN-Tesis`) y tiene una bio que dice «currently
learning». Es el primer sitio al que va un reclutador técnico después del
portafolio, y ahora mismo resta.

### 2.4 Un resultado con números para la ficha 01

`suite-administrativa` es el único caso fuerte sin `outcome`. Hay un TODO en
el propio fichero con la forma que debería tener: clics o pantallas de **un**
flujo, antes y después.

---

## 3. SEO — casi todo hecho

Lo único que estaba roto era `SITE.url`, y se arregló al publicar. Comprobado
en producción:

|                                                    |     |
| -------------------------------------------------- | --- |
| `robots.txt` permite todo y apunta al sitemap      | ✅  |
| Sin `noindex` ni cabecera `X-Robots-Tag`           | ✅  |
| `lang` y `<title>` correctos por idioma            | ✅  |
| Canónica y los tres `hreflang` en las dos páginas  | ✅  |
| `og:title`, `og:description`, `og:url`, `og:image` | ✅  |
| `sitemap.xml` con las dos rutas                    | ✅  |

**Queda una sola tarea activa: Google Search Console.** Verificar la propiedad
y enviar el sitemap. Es gratis y son cinco minutos. Sin eso Google acabará
encontrando el sitio igual, pero tarda más y no ves si algo falla.

~~Y un detalle menor: `/en` responde 301 hacia `/en/`, y la canónica declaraba
la versión sin barra.~~ **Arreglado.** `absoluteUrl()` añade ahora la barra a
las rutas de página —no a los ficheros, que con barra darían 404— y el sitemap
usa esa misma función en vez de concatenar a mano, que es como las dos formas
habían divergido. Hay una prueba que exige que toda canónica y todo `<loc>`
respondan 200 sin redirigir.

Lo que **no** hace falta: ni schema.org, ni blog, ni keywords.

---

## 4. Pruebas — ✅ HECHO

**104 pruebas en Chromium y Firefox, todas en verde.** Corren en el despliegue,
entre el lint y la publicación.

```bash
npm test           # construye y prueba
npm run test:fast  # reutiliza el build anterior
npm run test:ui    # el visor interactivo
npm run test:links # los enlaces de salida, aparte
```

Corren contra el **build**, servido por `tests/server.mjs`, que imita a Pages:
redirige `/en` a `/en/` con 301 y devuelve el `404.html` con estado 404 real.
Probar contra `react-router dev` no valdría — ese servidor inyecta el CSS por JS
y no aplica el prerender.

| Fichero              | Qué protege                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `prerender.spec.ts`  | El HTML **sin ejecutar JS** trae nombre, seis secciones y texto real. Canónicas, `hreflang`, sitemap y 404 |
| `navigation.spec.ts` | Los cinco enlaces llegan **al primer clic**. Hash compartido, cambio de idioma, salto al contenido         |
| `theme.spec.ts`      | Persiste, sigue al sistema y **no parpadea** — el fondo se mide en el primer fotograma                     |
| `layout.spec.ts`     | Cero scroll horizontal a 390/768/1024/1440/1920 × 2 idiomas. Cero errores de consola. Menú móvil           |
| `motion.spec.ts`     | Con `prefers-reduced-motion`, que **el texto se vea**                                                      |
| `a11y.spec.ts`       | axe en 2 rutas × 2 temas. Foco visible. Jerarquía de encabezados                                           |
| `links.spec.ts`      | Los enlaces de salida (fuera de CI: dependen de terceros)                                                  |

### Lo que encontraron

- **Sin WebGL, el portafolio entero se caía a la página de error.** El fallo más
  grave de los tres, y solo lo destapó Firefox en el runner de CI, que no tiene
  GPU: en local Chromium cae a SwiftShader por software y consigue contexto, así
  que era invisible en las dos máquinas donde se desarrolla.

  La cadena: `ogl` **no lanza** al quedarse sin contexto — hace `console.error`
  y sigue con `gl` a `null` (`Renderer.js:46`), así que reventaba la primera
  línea que lo usaba con un `TypeError` que subía hasta el ErrorBoundary de
  `root.tsx`. El visitante veía «Un error inesperado. Vuelve a intentarlo.» en
  lugar del portafolio, por culpa de un adorno del hero.

  Y no es un caso de laboratorio: pasa con la aceleración por hardware
  desactivada —frecuente en portátiles corporativos—, en máquinas virtuales y
  escritorios remotos, y en navegadores endurecidos por privacidad.

  Arreglado sondeando WebGL antes de tocar `ogl`: si no hay contexto, el efecto
  se retira en silencio y el `ParticlesStatic` que ya está pintado debajo se
  queda visible. Se sondea en vez de capturar la excepción para no dejar el
  `console.error` de ogl a la vista. Tiene prueba propia en
  `degradation.spec.ts`, que bloquea WebGL desde JavaScript para correr igual en
  los dos motores.

- **La canónica de `/en` apuntaba a una URL que redirige.** Arreglado (§3).
- **El inglés no puede anclar Contacto a 80px.** Es la última sección y al
  documento le faltan 15px de recorrido: el inglés ocupa un 15-25% menos
  (CLAUDE.md §4) y su página es 420px más corta. Medido:

  | ruta   | documento | hace falta | máximo | margen |
  | ------ | --------- | ---------- | ------ | ------ |
  | `/`    | 8663      | 7928       | 7943   | +15    |
  | `/en/` | 8243      | 7538       | 7523   | −15    |

  **No es un defecto.** El navegador hace todo lo que puede, la sección se ve
  entera y la diferencia son 15px que nadie percibe. Queda anotado porque es
  real y porque la prueba tuvo que aprenderlo.

Tres fallos más fueron **del arnés, no del sitio**, y están documentados en los
propios ficheros porque volverían a morder: `locator.click()` desplaza la página
antes de pulsar y con una cabecera `sticky` acaba en scrollY 0; `scrollY` no se
mueve durante los primeros fotogramas de un desplazamiento suave, así que
«todavía no ha empezado» se confunde con «ya terminó»; y React serializa
`hrefLang` en camelCase, que es válido pero rompe una comparación literal.

### Lo que sigue pendiente aquí

- **Lighthouse.** Sin ejecutar todavía. Referencia del build: ~130 KB de JS gzip
  (`entry.client` 57 + `jsx-runtime` 42 + `Home` 32).
- **Capturas de responsive.** Las pruebas garantizan que no hay desbordamiento a
  cinco anchos, que es el fallo objetivo; una pasada visual a 20 combinaciones
  (5 anchos × 2 temas × 2 idiomas) sigue siendo útil para juzgar el diseño, que
  eso no lo puede afirmar una aserción.

---

## 5. Qué puede hacer un visitante hoy

Inventario, para decidir si falta algo:

| Acción                                               | Estado                                       |
| ---------------------------------------------------- | -------------------------------------------- |
| Leer los cinco casos, experiencia, stack y formación | ✅                                           |
| Cambiar tema y que se recuerde                       | ✅                                           |
| Cambiar idioma conservando la ruta                   | ✅                                           |
| Descargar el CV en su idioma                         | ✅                                           |
| Escribir un correo (`mailto:`)                       | ✅                                           |
| Ir a GitHub y LinkedIn                               | ✅                                           |
| Ver el sitio corporativo en vivo                     | ✅                                           |
| Ver el repositorio de la tesis                       | ✅ (ficha no destacada)                      |
| Ver la app en Play Store                             | ⚠️ geobloqueada                              |
| **Escribir sin salir del sitio**                     | ➖ sin formulario, y es una decisión (abajo) |

### Contacto: se queda con enlaces. Decidido.

Sin formulario. Es una desviación consciente del §2 del CLAUDE.md, que
contemplaba `react-hook-form` + `zod` + Formspree, y ahora es una decisión
tomada en vez de un pendiente.

Los tres motivos, en orden de peso:

1. **El spam es real y llega al mismo sitio.** Un formulario público sin captcha
   recoge bots en semanas, y esos mensajes acaban en tu bandeja igual que los
   buenos, solo que mezclados. Formspree tiene filtro en el plan gratuito, pero
   ese plan son **50 envíos al mes contando el spam**: si te llegan 200 de bot,
   te quedas sin cupo y los reales se pierden en silencio.
2. **Un formulario añade un intermediario que puede fallar callado.** Con
   `mailto:`, si algo va mal lo ve la persona en su pantalla. Con un formulario,
   pulsa «enviar», lee «gracias» y el mensaje puede no haber salido nunca.
3. **Quien contrata escribe por LinkedIn o por correo**, y las dos están ahí.

Lo que sí valía del argumento contrario: un `mailto:` no hace nada en un
portátil sin cliente de correo configurado. **Eso se cubre poniendo la dirección
visible y copiable**, no con un formulario — quien no tenga cliente la pega en
Gmail. Merece la pena comprobar que la dirección se lee como texto en la sección
de Contacto y no solo como destino del enlace.

---

## 6. Después de publicar

### Analytics: no, por ahora. Decidido.

Con dos matices, porque Lighthouse y analytics miden cosas distintas y conviene
no confundirlas.

**Lighthouse mide cómo de bien está hecha la página. Analytics mide si alguien
la visita.** Un 100/100 no te dice si te encontró un reclutador ni por dónde
entró; y a la inversa, analytics no detecta una regresión de rendimiento.

Dicho eso, **para este sitio analytics aporta poco**: es un portafolio que se
comparte a mano —en una candidatura, en LinkedIn, en un correo— así que ya sabes
por qué vías llega la gente. No hay contenido que optimizar por embudo ni tráfico
orgánico que analizar. Lo único que darían las visitas es saber que alguien
abrió el enlace, y eso no cambia ninguna decisión.

**Si algún día interesa**, Plausible o Umami: sin cookies, sin banner de
consentimiento y unos 1 KB de script. Umami es gratis autohospedado; Plausible
son unos 9 $/mes.

Lo que **sí** merece la pena y no depende de nadie: **Google Search Console**
(§3), que no es analytics — dice si Google puede indexar el sitio y con qué
consultas aparece.

### Lighthouse

Sigue sin ejecutarse. Si ya te da 100 en todo, perfecto — pero conviene
comprobarlo sobre `https://hrhrm.github.io` y no en local: el hosting, la
compresión y la latencia cuentan, y en local siempre sale mejor.

### Verificado en producción

- `sitemap.xml`, `robots.txt`, el CV y los iconos responden 200.
- Un refresco en `/en/` no da el 404 del host.
- `http://` redirige a HTTPS con 301; una ruta desconocida da 404 de verdad.

Queda por hacer a mano: **pegar el enlace en WhatsApp y en LinkedIn** para ver
la OG nueva, y **abrir el enlace de Play Store desde fuera de Venezuela**,
aunque sea con una VPN, para saber qué ve un reclutador de fuera. La prueba
`test:links` lo comprueba automáticamente desde donde se ejecute.

---

## 7. ~~Deuda del propio CLAUDE.md~~ ✅ HECHO

- **§7, la comprobación del prerender.** El `grep` devolvía vacío desde que el
  `<h1>` abre con un `<span>` del efecto de pliegue. Sustituido por `npm test`,
  con el comando viejo conservado en un `<details>` que explica por qué falló —
  es justo el modo en que una comprobación se vuelve ruido y acaba ignorada.
- **§4, «una sola animación, y solo en el Hero».** Reescrito. Lo que queda no es
  la prohibición sino lo que la motivaba, más la trampa de
  `prefers-reduced-motion` que ahora tiene prueba propia.
- **`AccordionGallery`** borrado del repo. Está en la historia de git si vuelve.
- Añadidas a la tabla del §2 las filas de **Pruebas** y **Deploy**, y marcados
  como hechos el CV y el dominio en el §8.

---

## 8. Lo que queda, en una línea cada uno

|                                                           |                                              |
| --------------------------------------------------------- | -------------------------------------------- |
| **Google Search Console** — verificar y enviar el sitemap | 5 min, y es lo único activo de SEO           |
| **Lighthouse contra producción**                          | por confirmar el 100                         |
| **Limpiar el GitHub público**                             | bio y repos fijados (§2.3)                   |
| **`outcome` con números en la ficha 01**                  | §2.4                                         |
| **Ver la OG pegando el enlace** en WhatsApp y LinkedIn    | 2 min                                        |
| **Probar Play Store desde fuera de Venezuela**            | §2.1                                         |
| Capturas de responsive para juzgar el diseño              | opcional; el desbordamiento ya está cubierto |

---

## 9. Si algún día hay dominio propio

No hay que rehacer nada. El sitio es una _user page_, así que ya cuelga de la
raíz y no hay `base` ni `basename` que deshacer.

**Dónde comprarlo.** Un `.com` son 10-15 $/año. Cloudflare Registrar lo vende a
precio de coste, sin margen ni promoción de primer año que se dispara al
renovar — es lo que recomendaría. Porkbun y Namecheap están bien y son algo más
baratos el primer año. Evita el `.dev` si buscas lo más barato: cuesta más y
obliga a HTTPS (que aquí da igual, porque ya lo tienes).

**Cómo se conecta**, en cuatro pasos:

1. En el DNS del registrador, cuatro registros `A` para el dominio raíz
   apuntando a `185.199.108.153`, `.109.153`, `.110.153` y `.111.153`, y un
   `CNAME` de `www` a `hrhrm.github.io`.
2. En el repo, **Settings → Pages → Custom domain**, escribir el dominio. Eso
   crea un fichero `CNAME` en la rama publicada.

   ⚠️ Con despliegue por Actions ese fichero **se pierde en el siguiente
   build**, porque el artefacto se genera desde cero. Hay que emitirlo desde el
   `buildEnd` de `react-router.config.ts`, junto al `.nojekyll`:
   `writeFile(path.join(outDir, 'CNAME'), 'tudominio.com')`.

3. Esperar a que GitHub emita el certificado (unos minutos) y marcar
   **Enforce HTTPS**.
4. En el repo: cambiar `SITE.url` en `src/lib/constants.ts`, actualizar el
   dominio que se pinta en `scratchpad/og.html`, y `npm run og`.

El paso 4 es literalmente el trabajo entero del cambio, y las pruebas lo
verifican solas: `prerender.spec.ts` exige que ninguna canónica redirija.
