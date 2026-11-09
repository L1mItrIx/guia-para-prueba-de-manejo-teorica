---
name: animacion-3d
description: Reglas y plantilla para crear escenas 3D interactivas y animaciones (React Three Fiber, drei, Framer Motion) en la web de la prueba teórica de Costa Rica. Úsala SIEMPRE antes de crear o modificar cualquier escena 3D, modelo, animación de interfaz, flashcard con volteo o transición, y cuando una escena se vea mal, vaya lenta o falle en móvil.
---

# Animación 3D e interactividad

La web enseña normas de tránsito. Cada escena 3D existe para **explicar una regla**, no para decorar.
Si una animación no ayuda a entender algo, no se agrega.

## 1. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Lienzo base reutilizable (luces, cámara, fallback) | `src/components/three/Canvas3D.tsx` |
| Piezas reutilizables (calle, carro, señal, semáforo) | `src/components/three/piezas/*.tsx` |
| Componente que dibuja y anima cualquier escena | `src/components/three/escenas/EscenaAnimada.tsx` |
| Envoltorio para usarla en una página (carga diferida, en pantalla, turnos) | `src/components/three/escenas/EscenaEmbebida.tsx` |
| Datos de cada escena (vehículos, señales, línea de tiempo, explicación) | `src/content/temas/<slug>/escenas.ts` (NUNCA dentro del componente) |
| Lógica pura: recorridos, rotonda, línea de tiempo, modelo | `src/lib/rutas.ts`, `rutas-rotonda.ts`, `lineaTiempo.ts`, `modeloEscena.ts` (con tests) |
| Modelos GLB (si de verdad hacen falta) | `public/models/*.glb` comprimidos (Draco/Meshopt) |

Plantilla de escena nueva (son **datos**): `references/plantilla-escena.ts`.

### Escenas dentro de los modos de estudio

No hay una sección 3D aparte: las animaciones viven dentro del **resumen** (modo `demostracion`, con botón
Reproducir/Repetir), del **quiz** (modo `pregunta`: muestra la situación sin revelar nada y anima la solución al
responder) y de las **flashcards** (al voltear, modo `demostracion` con `auto`). Siempre con `EscenaEmbebida`.

- Tipos: `cruce` (señales, semáforos con luz que cambia, peatones, vía primaria/secundaria, noche) y `rotonda`.
- Línea de tiempo: `mover` (hasta `parada` o `fin`), `peatones`, `semaforo`, `pausa`; o el atajo `orden`.
- Los vehículos que empiezan atrás (`inicio` negativo) deben quedar dentro de cámara: entre -10 y 0 m.
- **Máximo 2 canvas WebGL vivos** (`useTurnoCanvas`): la escena que entra en pantalla toma el turno de la más
  antigua; las demás muestran un póster. Una sección con varias escenas muestra una a la vez (pestañas).

## 2. Reglas obligatorias

1. **Solo en el cliente.** Toda escena se importa con `next/dynamic` y `ssr: false`, porque el sitio es
   export estático. El archivo que usa `@react-three/fiber` empieza con `'use client'`.
2. **Siempre hay fallback.** Mientras carga: `<Suspense>` con un esqueleto del mismo tamaño
   (sin saltos de layout). Si WebGL no existe o falla: el componente `Canvas3D` muestra el texto
   alternativo del escenario. **La información nunca depende solo del 3D.**
3. **Rendimiento móvil primero.**
   - `dpr={[1, 1.75]}` (nunca más de 2).
   - `frameloop="demand"` si la escena está quieta; llama `invalidate()` al cambiar algo.
     Usa `frameloop="always"` solo mientras corre una animación.
   - Geometrías **procedurales** (`boxGeometry`, `cylinderGeometry`, `planeGeometry`) antes que GLB.
   - Reutiliza geometrías/materiales (decláralos una vez, compártelos); no crees objetos nuevos dentro de `useFrame`.
   - Sombras: como máximo una luz con `castShadow`, `shadow-mapSize` 1024. Prefiere `ContactShadows` de drei.
   - Objetivo: 60 fps en un teléfono de gama media; menos de ~150 draw calls por escena.
4. **Animar con tiempo, no con frames.** En `useFrame((state, delta) => ...)` multiplica por `delta`
   o interpola (`THREE.MathUtils.damp`). Nunca `x += 0.1` fijo.
5. **Las animaciones narran pasos.** Una escena interactiva sigue el ciclo:
   `pregunta → el usuario elige → se anima lo correcto → se explica el porqué (con fuente)`.
   El estado del ciclo vive en React (`useState`/`useReducer`), no en refs sueltas.
6. **Interacción accesible.**
   - Cada objeto clicable también tiene un botón HTML equivalente fuera del canvas (teclado y lector de pantalla).
   - `cursor: pointer` al pasar sobre objetos interactivos (`onPointerOver/Out`).
   - Respeta `prefers-reduced-motion`: usa el hook `useReducedMotion` (`src/lib/useReducedMotion.ts`).
     Con movimiento reducido, salta al estado final sin animar.
   - Colores con contraste suficiente; no transmitir información solo por color (agregar texto/ícono).
7. **Cámara controlada.** `OrbitControls` con límites (`minDistance`, `maxDistance`,
   `maxPolarAngle < Math.PI / 2` para no ir bajo el suelo) y `enablePan={false}` por defecto.
   En móvil el gesto de una mano debe seguir permitiendo hacer scroll de la página
   (la escena no ocupa más del ~70 % del alto de la pantalla).
8. **Coherencia visual.** Escala 1 unidad = 1 metro. Carros ~4,5 × 1,8 × 1,5. Carriles de 3,5 m.
   Se circula por la **derecha** (Costa Rica). Señales con los colores y formas del manual
   (ALTO: octágono rojo; CEDA: triángulo invertido blanco con borde rojo).
9. **Liberar recursos.** R3F libera lo que monta; si creas texturas/geometrías a mano fuera del JSX,
   llama `.dispose()` en el cleanup del `useEffect`.

## 3. Animaciones de interfaz (Framer Motion)

- Transiciones cortas: 150–300 ms; volteo de flashcard ~450 ms con `rotateY` y `backfaceVisibility: hidden`.
- Usa `useReducedMotion()` de Framer Motion o el hook propio y reemplaza movimiento por un fundido.
- Nada de animaciones en bucle que distraigan durante quizzes o el simulacro.

## 4. Checklist antes de dar por terminada una escena

- [ ] Se importa con `dynamic(..., { ssr: false })` y tiene `Suspense` + fallback.
- [ ] Funciona sin WebGL (texto alternativo visible).
- [ ] Hay botones HTML para todas las acciones; se puede usar solo con teclado.
- [ ] `prefers-reduced-motion` probado (DevTools → Rendering → Emulate).
- [ ] Datos de la escena en `content/`, con `fuente` y explicación, y enlazada desde al menos un modo.
- [ ] Capturas de inicio, mitad y final de la animación revisadas (que se vea quién espera y quién pasa).
- [ ] Probada en viewport de móvil (390×844) sin scroll horizontal.
- [ ] `npm run build` pasa y el smoke test e2e monta el canvas.
- [ ] Anotado en `docs/PROGRESO.md` (skill `progreso-proyecto`).
