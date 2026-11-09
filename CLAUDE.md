# Prueba Teórica CR

Web pública y gratuita (sin cuentas) para preparar la **prueba teórica de manejo de Costa Rica**
con contenido vigente a 2026: resúmenes, quizzes, flashcards, presentaciones, escenas 3D
interactivas y simulacro de examen. Al entrar, la persona elige **Carro (B1)** o **Moto (A)**.
Por ahora solo se desarrolla Carro; Moto aparece como "Próximamente".

## Usa siempre estas skills del proyecto
- `progreso-proyecto` — al empezar y al terminar cada tarea. Memoria en `docs/PROGRESO.md`.
- `arquitectura` — antes de crear/mover archivos o agregar contenido.
- `animacion-3d` — antes de tocar escenas 3D o animaciones (técnica y rendimiento).
- `frontend-design` — antes de crear o rediseñar páginas, componentes o la estética de una escena.
- `pdf-reading` — para leer la ley o el manual en PDF y generar contenido con fuente.
- `xlsx` — para revisar, limpiar o cargar el banco de preguntas desde Excel.
- `video-making` — solo para videos explicativos cortos aparte de la app.

## Comandos
```bash
npm run dev          # desarrollo en http://localhost:3000
npm run lint
npm run typecheck
npm test             # vitest: lógica + validación de todo el contenido
npm run build        # export estático en out/
npm run test:e2e     # playwright contra out/ (requiere build)
npm run banco:exportar                       # banco de preguntas → banco/preguntas.xlsx
npm run banco:importar -- banco/preguntas.xlsx [--escribir]
npm run fuentes:extraer -- <url-o-pdf> <nombre>   # PDF → fuentes/<nombre>.txt
npm run -s fuentes:articulo -- fuentes/<nombre>.txt 104
npm run video -- videos/guiones/<id>.json    # requiere build; sale en videos/salida/
```

## Reglas clave
- Sitio estático (`output: 'export'`), sin backend; progreso en `localStorage`.
- Contenido como datos tipados en `src/content/`, validado con Zod, **con fuente** (Ley 9078,
  Manual del Conductor 2026, DGEV/COSEVI). Nunca inventar normas, montos ni artículos.
- Interfaz en español de Costa Rica.
