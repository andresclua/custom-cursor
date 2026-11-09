# Custom Cursor: nueva web showcase

## Intención

La web actual (`src/index.html`, 478 líneas) es un hero oscuro con banda roja y 8 bloques "demo a la izquierda, código a la derecha". Enseña la API pero no sorprende. El objetivo es que quien la abra sienta que **esto no es el típico efecto de cursor que se ve en otras webs, que es mucho más que "cambiar algo" y que tiene muchas posibilidades**. La documentación debe explicarse con demos vivas y controles, no solo con tablas y código.

Referencia de método: la web de PerlinDOM (`../PerlinDOM`, spec `docs/superpowers/specs/2026-11-05-perlindom-showcase-design.md`): landing con scroll, páginas separadas de API y ejemplos, GSAP + ScrollTrigger solo para la web.

## Objetivos

- Una landing con guion de scroll por capítulos (abajo) en la que el cursor cambia de comportamiento y el fondo cambia de color con el scroll.
- Una página de API y una de Ejemplos, con controles en vivo (por ejemplo un slider que cambia `data-lerp` mientras se ve el efecto) en lugar de tablas estáticas.
- Hover, scroll y estados del cursor visibles en cada capítulo, no solo descritos.
- Identidad visual propia, distinta del degradado etéreo morado-azul de PerlinDOM (decisión del autor).

## No objetivos y anti-objetivos

- No romper la API actual de `new CustomCursor({...})`. Todo lo nuevo en la librería es opcional.
- Sin dependencias nuevas en la librería: sigue siendo cero dependencias. `gsap` (con `ScrollTrigger`) solo es dependencia de la web.
- No usar Pagefold ni transiciones entre páginas (decisión del autor): las tres páginas son enlaces normales.
- Fracaso aunque técnicamente funcione: que parezca una "demo de librería" genérica o una plantilla, o que el cursor sea el efecto típico de punto con anillo sin más.

## Guion de la landing (decidido por el autor)

La estructura son capítulos de scroll. La lista de capítulos la propuso Claude y el autor la aprobó.

| # | Capítulo | Cursor | Fondo |
|---|---|---|---|
| 0 | **Muro de estados** (apertura, pantalla completa) | Cuadrícula de zonas; cada zona convierte el cursor en punto, anillo, blend, texto, estela, grow, label... | Oscuro |
| 1 | **Lerp** | Estela de 3 piezas con retraso distinto. Un slider cambia `data-lerp` en vivo. | Violeta |
| 2 | **Focus** | Crece, cambia de color o forma al pasar por enlaces y tarjetas. | Azul |
| 3 | **Texto** | Muestra "View", "Drag" o "Play" según la tarjeta. | Coral |
| 4 | **Magnético** | Se pega al centro de los botones y los deforma. | Lima |
| 5 | **Blend** | Invierte lo que hay debajo (`mix-blend-mode`). | Claro |
| 6 | **Final** | `npm install` con copiar al portapapeles, enlaces a API y Ejemplos. | Oscuro |

Los colores de fondo son orientativos (calidez y contraste a criterio del builder, dentro de una paleta propia y nítida/editorial).

## Comportamiento de scroll y cursor (decidido por el autor)

- **ScrollTrigger** hace `scrub` del color de fondo entre capítulos: degradado continuo, sin cortes.
- **El cursor se oculta entre secciones**, como un respiro deliberado: se disuelve mientras hay scroll activo entre capítulos y reaparece ya transformado en el siguiente. (La forma exacta es llamada de Claude, rechazable: ocultarlo **solo mientras hay scroll** y devolverlo cuando el scroll se detiene o el ratón se mueve, para que el usuario no se quede sin puntero con `hideTrueCursor`.)
- Cada capítulo tiene elementos que entran con scroll (títulos por letras, tarjetas con parallax) y un "campo de pruebas" con elementos que reaccionan al hover.
- Se puede hacer con la API actual: `disable()` / `enable()`, `update()` y los callbacks `mouseenter` / `mouseleave` con GSAP, como en el README.

## Cambios de librería (opcionales, retrocompatibles; autor dijo sí)

Propuestos por Claude, no confirmados uno a uno:

1. **Mostrar el cursor desde el primer evento** y evitar el hueco inicial en el que no se ve hasta el primer `mousemove` (con `hideTrueCursor` tampoco se ve el nativo). Es lo único que Claude echa en falta de verdad.
2. Los efectos magnético y blend **no** requieren cambios: se hacen con GSAP dentro de los callbacks. Solo se tocará la librería si un capítulo lo pide.
3. Ya hechos en esta sesión: arreglo del listener `mouseup` y entradas de `CHANGELOG.md`. Pendiente aparte, si el autor quiere: que `destroy()` limpie `transform`, `focusClass` y `clickingClass`.

## Restricciones

- Accesibilidad: respetar `prefers-reduced-motion` (sin ocultar/animar el cursor ni scrub de fondo, sin efectos de scroll). Contenido legible y navegable por teclado.
- Táctil: la librería no se inicializa (`disableTouch`); la web degrada a una página de lectura con los mismos capítulos y sin cursor.
- Contraste de texto suficiente sobre cada fondo del scrub (WCAG AA como mínimo).
- Textos de la web en inglés, como la librería y el README (llamada de Claude, rechazable).

## Cómo se construye (llamadas de Claude, el autor puede rechazarlas)

- Mantener Vite 5 + SCSS, sin framework JS. Build multipágina (landing, API, ejemplos) con `base` relativa.
- Añadir `gsap` con `ScrollTrigger` solo para la web.
- Convenciones de la casa: BEM con prefijo `c--` y estructura Terra/Punky, como en el resto del repo.
- Netlify publica la web; el `demo/` compilado deja de commitearse si el build corre en Netlify (como PerlinDOM: `command = "npm run build:site"`, `publish = "dist-site"`). Se añade script `build:site` y se separa de `build` (librería).

## Contenido de las páginas

- **Landing:** guion de arriba.
- **API:** opciones, `focusElements`, métodos y clases, escritas a partir de `readme.md`, con demos y controles en vivo en lugar de tablas estáticas.
- **Ejemplos:** los 8 ejemplos actuales (Setup, Basic Focus, Custom Focus Class, Callbacks, Disable/Enable, Update Options, Generic Focus, Dynamic Content) rediseñados con la nueva identidad, cada uno con su código copiable.

## A criterio del builder

Paleta y tipografías exactas (identidad propia), número y forma de las zonas del muro de estados, cómo se implementa cada comportamiento (magnético, blend, estela), estructura de archivos y nombres, orden de implementación, y cómo se encaja el ocultado del cursor con ScrollTrigger.

## Aclaraciones tras la revisión (llamadas de Claude, rechazables)

- **Ocultar el cursor:** se aplica la versión de Claude. Se oculta solo mientras hay scroll activo entre capítulos y vuelve cuando el scroll se detiene o el ratón se mueve. Con `disable()` el cursor nativo sigue oculto si `hideTrueCursor` está activo, así que es el cursor custom el que debe reaparecer rápido; nunca se deja al usuario sin puntero más allá de ese respiro.
- **Estela y piezas múltiples:** no requiere cambios de librería. Un `CustomCursor` ya gestiona N hijos con `data-lerp` dentro del mismo elemento, así que la estela de 3 piezas son 3 hijos con lerp distinto. Forma, color y blend por zona se cambian con clases (`focusClass`) y CSS.
- **Una sola instancia en la landing**, global a la página. Los capítulos cambian su estado con `update()` y los callbacks. Los controles de la API (`lerp`, `focusClass`, `hideTrueCursor`, `disable`/`enable`) actúan sobre esa instancia; si una demo necesita aislamiento, el builder puede usar una instancia aparte acotada a su zona.
- **Controles en vivo de la página API (mínimo):** `data-lerp` (slider), `focusClass` (selector), `hideTrueCursor`, `disable`/`enable` y `update({})` tras inyectar contenido. El resto de opciones se documentan con ejemplo copiable.
- **Primer evento (cambio 1):** el cursor se muestra con fade-in en el primer `mousemove`, sin posición inventada. No afecta a táctil (sigue sin inicializarse). Comportamiento anterior intacto salvo por la ausencia del hueco.
- **`prefers-reduced-motion`:** el cursor sigue al ratón (lerp efectivo 1, sin estela), sin ocultarse ni animarse entre capítulos. Sin scrub de fondo ni efectos de scroll.
- **Migración:** se conservan el dominio `cursor.andresclua.com` y las reglas de redirección existentes en `netlify.toml`. La librería (`npm run build`, `dist/`, `main`/`exports`) no cambia. El `demo/` commiteado se elimina cuando el build del sitio corra en Netlify.
- **URLs:** `/` (landing), `/api.html` y `/examples.html`, con la página activa marcada en la navegación.
