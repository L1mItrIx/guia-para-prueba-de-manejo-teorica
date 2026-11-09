# Prueba Teórica CR

Web pública y gratuita (sin cuentas) para preparar la **prueba teórica de manejo de Costa Rica**
con contenido vigente a 2026: resúmenes, quizzes, flashcards, presentaciones, escenas 3D
interactivas y simulacro de examen. Al entrar, la persona elige **Carro (B1)** o **Moto (A)**.
Por ahora solo se desarrolla Carro; Moto aparece como "Próximamente".

## Usa siempre estas skills del proyecto
- `progreso-proyecto` — al empezar y al terminar cada tarea. Memoria en `docs/PROGRESO.md`.
- `arquitectura` — antes de crear/mover archivos o agregar contenido.
- `animacion-3d` — antes de tocar escenas 3D o animaciones.

## Comandos
```bash
npm run dev          # desarrollo en http://localhost:3000
npm run lint
npm run typecheck
npm test             # vitest: lógica + validación de todo el contenido
npm run build        # export estático en out/
npm run test:e2e     # playwright contra out/ (requiere build)
```

## Reglas clave
- Sitio estático (`output: 'export'`), sin backend; progreso en `localStorage`.
- Contenido como datos tipados en `src/content/`, validado con Zod, **con fuente** (Ley 9078,
  Manual del Conductor 2026, DGEV/COSEVI). Nunca inventar normas, montos ni artículos.
- Interfaz en español de Costa Rica.
