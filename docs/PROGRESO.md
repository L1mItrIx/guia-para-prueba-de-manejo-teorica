# Progreso del proyecto — Teórico CR

> Memoria entre sesiones. Mantener con la skill `progreso-proyecto`. Breve y factual.

## Estado actual
Sitio estático Next.js funcionando con la división **Carro (B1)** / **Moto (A, "Próximamente")**.
Tema completo: **Intersecciones y derecho de vía**. Al entrar al tema se elige cómo estudiar (resumen, quiz o
flashcards) y los tres modos incluyen 13 animaciones 3D (cruces, semáforos, peatones, noche, rotonda).
Simulacro de práctica y página de progreso. Textos neutrales e impersonales. Tests unitarios y e2e en verde.

## Hecho
- [x] Proyecto Next.js 15 + React 19 + Tailwind 4 + R3F 9 / drei 10 + framer-motion + zustand + zod
- [x] Skills: `animacion-3d`, `arquitectura`, `progreso-proyecto` + hook SessionStart que muestra este archivo
- [x] Esquema de contenido con fuente obligatoria por ítem (`src/content/schema.ts`)
- [x] Lógica pura con tests: barajar, calificar, Leitner, rutas 3D (`src/lib/`)
- [x] Progreso en localStorage (sin cuentas) con protección si el navegador lo bloquea
- [x] Inicio con elección Carro / Moto; Moto muestra "Próximamente"
- [x] Tema "Intersecciones y derecho de vía" (Ley 9078 arts. 104, 105, 106, 108, 110, 121, 128 y multas 2026)
- [x] Animaciones 3D dentro de resumen, quiz y flashcards: 13 escenas (tipos cruce y rotonda), línea de tiempo
      declarativa, máximo 2 canvas vivos; se quitaron la presentación y el modo 3D aparte
- [x] Simulacro (40 preguntas máx., 50 min, nota 70) con el banco verificado disponible
- [x] Workflow de GitHub Pages
- [x] Repo público: https://github.com/L1mItrIx/guia-para-prueba-de-manejo-teorica (CI en verde)
- [x] Sitio publicado en GitHub Pages: https://l1mitrix.github.io/guia-para-prueba-de-manejo-teorica/ (se actualiza con cada push a `main`)
- [x] Skills `frontend-design`, `pdf-reading`, `xlsx`, `video-making` con sus herramientas:
      `banco:exportar/importar` (exceljs), `fuentes:extraer/articulo` (pdftotext), `video` (Playwright + ffmpeg)
- [x] Revisión de todos los textos: tono neutral e impersonal; el simulacro es "de práctica", con aviso de que
      la prueba oficial la aplica Educación Vial; test que bloquea voseo, tuteo, "usted" y promesas
- [x] Las 22 preguntas de Intersecciones reescritas: distractores con errores reales, largos parejos,
      sin absolutos; revisión de calidad más estricta y obligatoria en `npm test`
- [x] Primer video de ejemplo: `videos/guiones/ceda-vs-alto.json` (vertical 1080×1920, 16 s)

## Siguiente
1. Conseguir el texto oficial del **Manual del Conductor 2026 (automóvil)** y revisar el tema contra él.
2. Confirmar con la DGEV el formato 2026 del examen (nº de preguntas, minutos) → `src/content/examen.ts`.
3. Nuevo tema: **Señales de tránsito** (verticales, horizontales, semáforos) con escena 3D de señales.
4. Temas siguientes: velocidades y distancias, adelantamiento, alcohol y drogas, sistema de puntos y multas,
   primeros auxilios / accidentes, mecánica básica y conducción preventiva.
5. Cuando haya ≥ 40 preguntas verificadas, el simulacro queda con el tamaño real.
6. Licencia A (moto): contenido propio desde el manual de motociclistas; luego `disponible: true`.

## Cobertura de contenido
| Tema | Licencia | Preguntas (con animación) | Flashcards (con animación) | Secciones del resumen | Escenas 3D |
|---|---|---|---|---|---|
| Intersecciones y derecho de vía | B1 | 22 (13) | 16 (12) | 9 (9 con animación) | 13 |

## Decisiones
- 2026-11-09 — Sitio 100 % estático, sin cuentas; progreso en el navegador — pedido explícito: público general sin registro.
- 2026-11-09 — Al entrar se elige Carro o Moto; por ahora solo Carro — lo usa la mayoría; desde mar-2026 los manuales son distintos.
- 2026-11-09 — Fuente primaria: texto actualizado de la Ley 9078 (copia de oct-2026 con notas de SINALEVI) — el Manual 2026 oficial no se pudo obtener en línea.
- 2026-11-09 — Etiquetas 3D como sprites con textura de canvas (no `Html` de drei) — con `frameloop="demand"` el `Html` aparecía de forma intermitente.
- 2026-11-09 — Texto neutral e impersonal en todo el sitio (reemplaza el voseo inicial), por pedido del usuario: natural, sin parecer de un país ni robótico.
- 2026-11-09 — Sin modo 3D aparte ni presentación: se elige resumen, quiz o flashcards y las animaciones van dentro de cada uno.
- 2026-11-09 — Máximo 2 canvas WebGL a la vez; la escena que entra en pantalla toma el turno de la más antigua.
- 2026-11-09 — Excel con `exceljs` (MIT) y no con el paquete `xlsx` de npm, que tiene vulnerabilidades sin corregir.
- 2026-11-09 — No hay base de datos: el banco vive en `preguntas.ts`; Excel es solo para revisar e importar con validación.
- 2026-11-09 — Calidad de preguntas obligatoria: `npm test` falla con pistas de largo, eco, absolutos, comodines o duplicadas — para que ninguna respuesta se adivine sin saber la regla.
- 2026-11-09 — Videos generados grabando el sitio real (Playwright) + ffmpeg con subtítulos quemados; sin audio de terceros.

## Bitácora
- 2026-11-09 — Escena "cruce congestionado" rehecha (la fila quedaba detenida y salía de cámara; ahora el rojo llega, espera y entra cuando avanza la fila). Escena nueva "Ambulancia en el mismo carril" (campo `desvio` en vehículos de cruce: el rojo se corre a la derecha, la ambulancia pasa por la izquierda), en la sección Emergencias del resumen.
- 2026-11-09 — Textos neutrales; animaciones en los tres modos (6 escenas nuevas: amarillo, noche, peatones, cruce bloqueado, primaria/secundaria, rotonda).
- 2026-11-09 — GitHub Pages activado y verificado (todas las rutas 200, escena 3D y quiz funcionando).
- 2026-11-09 — Repo creado en GitHub por el usuario y código subido a `main`.
- 2026-11-09 — Sesión 1 (cont.): preguntas menos obvias + test de calidad del banco.
- 2026-11-09 — Sesión 1 (cont.): skills frontend-design, pdf-reading, xlsx y video-making + scripts y tests.
- 2026-11-09 — Sesión 1: plan, skills, base del sitio, tema Intersecciones completo con 3D, tests, repo en GitHub.
