# Progreso del proyecto — Teórico CR

> Memoria entre sesiones. Mantener con la skill `progreso-proyecto`. Breve y factual.

## Estado actual
Sitio estático Next.js funcionando con la división **Carro (B1)** / **Moto (A, "Próximamente")**.
Tema completo: **Intersecciones y derecho de vía** (resumen, 22 preguntas, 16 flashcards, 9 diapositivas,
6 escenas 3D interactivas) + simulacro + página de progreso. Tests unitarios y e2e en verde.

## Hecho
- [x] Proyecto Next.js 15 + React 19 + Tailwind 4 + R3F 9 / drei 10 + framer-motion + zustand + zod
- [x] Skills: `animacion-3d`, `arquitectura`, `progreso-proyecto` + hook SessionStart que muestra este archivo
- [x] Esquema de contenido con fuente obligatoria por ítem (`src/content/schema.ts`)
- [x] Lógica pura con tests: barajar, calificar, Leitner, rutas 3D (`src/lib/`)
- [x] Progreso en localStorage (sin cuentas) con protección si el navegador lo bloquea
- [x] Inicio con elección Carro / Moto; Moto muestra "Próximamente"
- [x] Tema "Intersecciones y derecho de vía" (Ley 9078 arts. 104, 105, 106, 108, 110, 121, 128 y multas 2026)
- [x] Escena 3D de intersección: 6 escenarios, clic en el carro o botones, animación del orden correcto
- [x] Simulacro (40 preguntas máx., 50 min, nota 70) con el banco verificado disponible
- [x] Workflow de GitHub Pages

## Siguiente
1. Activar GitHub Pages en el repo (Settings → Pages → Source: GitHub Actions) y verificar la URL pública.
2. Conseguir el texto oficial del **Manual del Conductor 2026 (automóvil)** y revisar el tema contra él.
3. Confirmar con la DGEV el formato 2026 del examen (nº de preguntas, minutos) → `src/content/examen.ts`.
4. Nuevo tema: **Señales de tránsito** (verticales, horizontales, semáforos) con escena 3D de señales.
5. Temas siguientes: velocidades y distancias, adelantamiento, alcohol y drogas, sistema de puntos y multas,
   primeros auxilios / accidentes, mecánica básica y conducción preventiva.
6. Cuando haya ≥ 40 preguntas verificadas, el simulacro queda con el tamaño real.
7. Licencia A (moto): contenido propio desde el manual de motociclistas; luego `disponible: true`.

## Cobertura de contenido
| Tema | Licencia | Preguntas | Flashcards | Diapositivas | Escenas 3D |
|---|---|---|---|---|---|
| Intersecciones y derecho de vía | B1 | 22 | 16 | 9 | 6 |

## Decisiones
- 2026-11-09 — Sitio 100 % estático, sin cuentas; progreso en el navegador — pedido explícito: público general sin registro.
- 2026-11-09 — Al entrar se elige Carro o Moto; por ahora solo Carro — lo usa la mayoría; desde mar-2026 los manuales son distintos.
- 2026-11-09 — Fuente primaria: texto actualizado de la Ley 9078 (copia de oct-2026 con notas de SINALEVI) — el Manual 2026 oficial no se pudo obtener en línea.
- 2026-11-09 — Etiquetas 3D como sprites con textura de canvas (no `Html` de drei) — con `frameloop="demand"` el `Html` aparecía de forma intermitente.
- 2026-11-09 — Voseo costarricense en la interfaz ("Elegí", "Practicá").

## Bitácora
- 2026-11-09 — Sesión 1: plan, skills, base del sitio, tema Intersecciones completo con 3D, tests, repo en GitHub.
