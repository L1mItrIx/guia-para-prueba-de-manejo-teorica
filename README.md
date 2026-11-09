# Teórico CR

Web gratuita y sin cuentas para preparar la **prueba teórica de manejo de Costa Rica** (2026):
resúmenes, quizzes, flashcards, presentaciones, **escenas 3D interactivas** y simulacro de examen.
Al entrar se elige **Carro (B1)** o **Moto (A)** — moto está en preparación.

Todo el contenido cita su fuente (Ley de Tránsito N.º 9078 y multas vigentes desde enero de 2026).
Ver [`docs/FUENTES.md`](docs/FUENTES.md). El estado del proyecto está en [`docs/PROGRESO.md`](docs/PROGRESO.md).

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

```bash
npm run test:e2e
```

## Estructura
- `src/content/` — contenido como datos tipados (Zod), un directorio por tema.
- `src/components/three/` — escenas 3D (React Three Fiber).
- `src/lib/` — lógica pura con tests.
- `.claude/skills/` — skills del proyecto para Claude Code: `animacion-3d`, `arquitectura`, `progreso-proyecto`.

## Publicación
El workflow `.github/workflows/pages.yml` publica el export estático en GitHub Pages en cada push a `main`
(activar en Settings → Pages → Source: GitHub Actions).

Sitio independiente; no está afiliado al MOPT, al COSEVI ni a la Dirección General de Educación Vial.
