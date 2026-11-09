---
name: xlsx
description: Revisar, limpiar y editar el banco de preguntas en una hoja de Excel y volver a cargarlo al contenido del sitio con validación. Úsala cuando se pida exportar o importar preguntas, revisarlas en una hoja de cálculo, cargar preguntas nuevas desde un .xlsx, o buscar preguntas con problemas de calidad (duplicadas, pistas por largo, absolutos, sin verificar).
---

# Banco de preguntas ↔ Excel

El sitio es estático: **no hay base de datos**. El banco "oficial" son los archivos
`src/content/temas/<tema>/preguntas.ts`. La hoja de cálculo es una herramienta de revisión:
se exporta, se edita y se vuelve a importar con validación. Nunca editar la hoja y el `.ts` a la vez.

## Exportar

```bash
npm run banco:exportar
```

Crea `banco/preguntas.xlsx` (no versionado) con tres hojas:
- **Preguntas**: una fila por pregunta. Columnas `tema, id, enunciado, opcion_a…opcion_d, correcta (A–D), explicacion, fuente, detalle, verificado`.
  Filtros, encabezado fijo y lista desplegable en `correcta`.
- **Revisión**: avisos automáticos de calidad (ver abajo).
- **Instrucciones**: cómo llenar cada columna.

## Avisos de calidad (hoja "Revisión")

| Tipo | Qué significa | Cómo se corrige |
|---|---|---|
| Pista por largo | la correcta es claramente la opción más larga | alargar distractores o acortar la correcta |
| Absolutos | un distractor usa "siempre/nunca/jamás" y delata que es falso | reformular sin absoluto |
| Opción comodín | "todas/ninguna de las anteriores" | eliminar (las opciones se barajan) |
| Duplicada | mismo enunciado que otra | fusionar o borrar una |
| Fuente desconocida | `fuente` no existe en `src/content/fuentes.ts` | registrar la fuente o corregir el id |
| Sin verificar | `verificado = pendiente` | verificar contra la norma (skill `pdf-reading`) |

Los avisos no bloquean la importación; los **errores** sí.

## Importar

Primero en modo prueba (no escribe nada, muestra errores y el resumen de cambios por tema):

```bash
npm run banco:importar -- banco/preguntas.xlsx
```

Si está bien, aplicar:

```bash
npm run banco:importar -- banco/preguntas.xlsx --escribir
```

- Valida cada fila con el mismo esquema Zod del sitio, limpia espacios y saltos de línea, acepta la letra en minúscula.
- Bloquea: `correcta` fuera de A–D, ids repetidos, temas inexistentes, campos que no cumplen el esquema.
- Reescribe `preguntas.ts` de cada tema presente en la hoja (formato JSON generado; los ayudantes
  como `ley("Art. …")` se pierden, es normal). Las preguntas de un tema que se borren de la hoja se quitan.
- Después: `npm test && npm run build`, revisar `git diff` y anotar el cambio en `docs/PROGRESO.md`.

## Si el usuario trae su propia hoja

1. Abrirla con `exceljs` (ya instalado) y mapear sus columnas a las de arriba; no adivinar `correcta` ni `fuente`.
2. Las filas sin fuente verificable entran con `verificado: "pendiente"` (no aparecen en el simulacro).
3. Guardar el resultado como `banco/<nombre>.xlsx` con la hoja "Preguntas" y seguir el flujo de importación.

Código: `scripts/banco/lib.ts` (lógica pura, con tests en `tests/unit/banco.test.ts`), `excel.ts`, `exportar.ts`, `importar.ts`.
