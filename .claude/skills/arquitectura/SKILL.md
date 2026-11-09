---
name: arquitectura
description: Mapa de la arquitectura de la web de la prueba teórica de manejo de Costa Rica — dónde va cada archivo, convenciones, reglas duras y la receta para agregar un tema, una pregunta, una escena o una licencia nueva (carro B1 / moto A). Úsala SIEMPRE antes de crear archivos o carpetas, mover código, agregar contenido o una ruta, o cuando dudes de dónde poner algo.
---

# Arquitectura del proyecto

## Reglas duras (no se negocian)

1. **Sitio 100 % estático** (`output: 'export'`). Nada de API routes, server actions, base de datos ni cuentas.
   Todo el público usa la web sin registrarse.
2. **El progreso del estudiante vive solo en su navegador** (`localStorage` vía `src/store/progreso.ts`).
   Todo acceso a `localStorage` está protegido (try/catch); la web funciona aunque esté bloqueado.
3. **El contenido es dato tipado**, no JSX. Vive en `src/content/` y se valida con Zod (`src/content/schema.ts`).
   Un test (`tests/unit/contenido.test.ts`) valida TODO el contenido: si un dato no cumple el esquema, falla el build de CI.
4. **Cada pregunta, tarjeta y regla cita su fuente** (`fuente`: documento + artículo) y la fecha en que se verificó.
   Nada se inventa. Lo no confirmado lleva `verificado: 'pendiente'` y no entra al simulacro.
5. **Separación por licencia desde el inicio**: `'B1'` (automóvil) y `'A'` (motocicleta). Los temas declaran
   `licencias: ['B1']`, `['A']` o ambas. La licencia elegida se guarda en el store y filtra todo.
6. **Lógica pura en `src/lib/`** (sin React, sin `window`) y con tests unitarios.
7. **Componentes sin contenido "quemado"**: reciben datos por props.
8. Idioma de la interfaz y del código de dominio: **español** (`preguntas`, `tema`, `licencia`).
   Nombres de componentes en PascalCase, hooks `useAlgo`, archivos de datos en kebab-case.

## Mapa de carpetas

```
src/
  app/                                rutas (App Router, export estático)
    layout.tsx                        shell: encabezado, selector de licencia, pie
    page.tsx                          inicio: elegir Carro (B1) o Moto (A)
    [licencia]/                       'carro' | 'moto' (generateStaticParams)
      page.tsx                        lista de temas de esa licencia
      simulacro/page.tsx              examen: 40 preguntas, 50 min, aprueba con 70
      [tema]/page.tsx                 resumen del tema + accesos a los modos
      [tema]/quiz/page.tsx
      [tema]/flashcards/page.tsx
      [tema]/presentacion/page.tsx
      [tema]/escena/page.tsx          escena 3D interactiva (si el tema tiene)
    progreso/page.tsx                 progreso guardado en el navegador
    fuentes/page.tsx                  fuentes oficiales y fecha de verificación
  components/
    ui/                               piezas genéricas (Boton, Tarjeta, BarraProgreso, Insignia)
    estudio/                          Quiz, Flashcards, Presentacion, Resumen, Simulacro
    three/                            Canvas3D, piezas/, escenas/  (ver skill animacion-3d)
  content/
    schema.ts                         esquemas Zod + tipos inferidos
    licencias.ts                      definición de B1 y A (nombre, slug, disponible)
    examen.ts                         formato del examen (preguntas, minutos, nota) + fuente
    temas/
      index.ts                        registro: exporta TODOS los temas
      <slug-del-tema>/
        index.ts                      export default del Tema (une lo de abajo)
        resumen.ts                    secciones del resumen
        preguntas.ts                  banco de preguntas
        flashcards.ts
        diapositivas.ts
        escenarios.ts                 (opcional) escenarios de la escena 3D
  lib/                                lógica pura: barajar, calificar, leitner, tiempo
  store/progreso.ts                   zustand + persist
tests/
  unit/                               vitest (lib/ + validación de contenido)
  e2e/                                playwright (smoke de rutas principales)
docs/
  PROGRESO.md                         memoria del proyecto (skill progreso-proyecto)
  FUENTES.md                          fuentes y verificación 2026
```

## Receta: agregar un tema nuevo

1. Crear `src/content/temas/<slug>/` copiando la estructura de `intersecciones/`.
2. Rellenar los datos con fuentes reales (Ley 9078, Manual del Conductor 2026). Anotar cada fuente en `docs/FUENTES.md`.
3. Registrar el tema en `src/content/temas/index.ts`.
4. `npm test` → el test de contenido valida esquema, ids únicos y que la respuesta correcta exista.
5. Si lleva escena 3D: seguir la skill `animacion-3d` y añadir `escenarios.ts`.
6. `npm run build` → la ruta se genera sola gracias a `generateStaticParams`.
7. Actualizar `docs/PROGRESO.md` (skill `progreso-proyecto`).

## Receta: habilitar la licencia de moto (A)

1. En `src/content/licencias.ts` poner `disponible: true` para `A`.
2. Crear temas con `licencias: ['A']` (o agregar `'A'` a los temas comunes que apliquen igual).
3. Revisar que el simulacro tenga suficientes preguntas verificadas de esa licencia.

## Checklist antes de commit

```bash
npm run lint && npm run typecheck && npm test && npm run build
```
Y, si cambió la UI, `npm run test:e2e`.
