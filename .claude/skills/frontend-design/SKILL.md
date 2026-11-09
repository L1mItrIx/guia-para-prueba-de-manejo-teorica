---
name: frontend-design
description: Dirección de arte e interfaz de Teórico CR para que las páginas y las escenas 3D tengan identidad propia y no se vean genéricas. Úsala SIEMPRE antes de crear o rediseñar una página, componente, tarjeta, ícono, ilustración o la estética de una escena 3D, y al revisar capturas de la interfaz. Complementa a animacion-3d (que cubre rendimiento y técnica del 3D).
---

# Diseño de interfaz — Teórico CR

## La idea visual: "señalética vial tica"

El sitio habla el idioma de la calle: formas de señales (octágono, triángulo, rombo, círculo),
asfalto, líneas de carril, el amarillo de demarcación y los colores de la bandera.
Cada decisión visual debe poder justificarse con esa idea. Si algo podría estar en cualquier
plantilla SaaS (degradado morado, tarjetas con sombra difusa y emoji, ilustraciones 3D de stock), no va.

**Tono:** cercano y tico (voseo: "Elegí", "Practicá"), directo, sin infantilizar. Las personas
que estudian para el teórico están nerviosas: la interfaz da calma y claridad, no ruido.

## Tokens (fuente de verdad: `src/app/globals.css`)

| Token | Uso |
|---|---|
| `primario` (#0b3d91 azul bandera) | acciones principales, foco, progreso |
| `acento` (#ce1126 rojo bandera) | solo para ALTO, alertas, multas. Nunca para botones normales |
| `exito` / `error` (+ `-fondo`) | respuesta correcta / incorrecta. Siempre acompañados de texto o ✔/✘ |
| `aviso-fondo` | datos pendientes de verificar, avisos |
| Amarillo de demarcación `#f2c230` | detalles gráficos (líneas, subrayados), nunca texto sobre blanco |
| `superficie`, `superficie-2`, `borde`, `suave` | estructura |

- No agregar colores sueltos en componentes (`bg-[#...]`): si hace falta uno nuevo, se crea el token en
  `globals.css` con su versión oscura y se anota la decisión en `docs/PROGRESO.md`.
- Modo oscuro obligatorio: todo componente se revisa en claro y oscuro.
- Contraste AA mínimo (4.5:1 texto normal). El amarillo y el verde claro no se usan para texto.

## Tipografía

- Hoy: pila del sistema (`--font-sans`). Si se agrega una fuente de marca, autoalojarla con
  `@fontsource-variable/*` (el build no debe depender de Google Fonts) y usarla solo para titulares.
  Candidatas con carácter vial: una grotesca condensada para titulares (recuerda la rotulación de carreteras).
- Jerarquía: `h1` 3xl–5xl extrabold con `tracking-tight`; cuerpo 16–18 px con `leading-relaxed`.
- Números grandes (notas, montos, cronómetro) en `font-extrabold` y, cuando cambian, `tabular-nums`.
- Montos siempre con el formato de la ley: `¢245 195,06` (espacio fino de miles, coma decimal).

## Iconografía e ilustración

- **Sin emoji como íconos** en la interfaz final. Usar SVG propios en `src/components/ui/` (como `Senal.tsx`),
  trazo de 2 px o formas llenas, `aria-hidden` y siempre con texto al lado.
- Las ilustraciones de señales siguen las formas y colores reales (ALTO octágono rojo con borde blanco,
  CEDA triángulo invertido rojo/blanco). No inventar señales que no existen en Costa Rica.
- Nada de fotos de stock ni ilustraciones de personas genéricas. Si hace falta una persona, silueta simple tipo pictograma vial.

## Patrones de componentes

- **Tarjeta de tema / modo de estudio:** borde de 1 px, radio `2xl`, título en negrita, una línea de texto
  y el progreso real (no números decorativos).
- **Botones:** `Boton` / `BotonLink` (`src/components/ui/Boton.tsx`). Altura mínima 44 px (táctil).
  Un solo botón primario por zona de la pantalla.
- **Respuestas de quiz:** letra en círculo + texto; al responder se marca correcto/incorrecto con color **y** símbolo.
- **Retroalimentación:** caja con fondo `exito-fondo`/`error-fondo`, explicación y `RefFuente` debajo.
- **Multas:** caja `error-fondo` con el monto destacado.
- **Pendiente de verificar:** insignia `aviso-fondo`, nunca se oculta.

## Escenas 3D: dirección de arte

- Estilo **low-poly limpio**: geometrías simples, colores planos, sin texturas fotográficas.
  Paleta: asfalto `#3d4048`, zacate `#7fb069`, acera `#c9c4b8`, cielo `#bfe3f5` (oscuro: `#1b2b40`).
- Carros con colores saturados y distintos entre sí (rojo, azul, verde, amarillo) **y** su nombre en la etiqueta:
  el color nunca es la única pista.
- Cámara en vista ¾ desde arriba (la que usa `Canvas3D`), que se lea como un diagrama del manual.
- La animación cuenta la regla: el carro que debe esperar se queda quieto en su línea de parada;
  el que tiene prioridad se resalta mientras pasa.
- Coherencia: mismas piezas (`src/components/three/piezas/`) en todas las escenas; no mezclar estilos.

## Layout y responsive

- Diseñar primero para 390 px de ancho; probar también 1280 px. Sin scroll horizontal (el e2e lo revisa en móvil).
- Ancho de lectura: `max-w-3xl` para texto y quizzes; `max-w-4xl/5xl` para escenas y presentaciones.
- Margen lateral de 16 px en móvil (`px-4`).

## Checklist de revisión visual (antes de dar por terminado)

1. `npm run build`, servir `out/` y tomar capturas con Playwright a 390×844 y 1280×860, en claro y en oscuro
   (`colorScheme: "dark"`). Mirarlas de verdad.
2. ¿Hay algo que parezca de plantilla genérica? ¿Algún emoji como ícono? ¿Algún color fuera de los tokens?
3. ¿Se entiende cada estado (cargando, vacío, correcto, incorrecto, sin WebGL)?
4. Navegar solo con teclado: foco visible en todo.
5. Anotar en `docs/PROGRESO.md` lo cambiado y cualquier deuda visual pendiente.
