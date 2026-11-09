---
name: pdf-reading
description: Extraer y citar el contenido de PDFs oficiales (Ley de Tránsito 9078, Manual del Conductor 2026, reglamentos, circulares de multas) y convertirlo en resúmenes, preguntas y flashcards con fuente. Úsala cuando haya que leer un PDF, buscar qué dice un artículo, verificar un dato contra la norma o generar preguntas nuevas a partir de un documento.
---

# Leer PDFs oficiales y generar contenido a partir de ellos

## 1. Conseguir y extraer el texto

```bash
npm run fuentes:extraer -- "<url-o-ruta-del-pdf>" ley9078
```

Descarga a `fuentes/ley9078.pdf` y crea `fuentes/ley9078.txt` con `pdftotext -layout`.
La carpeta `fuentes/` **no se versiona** (los manuales tienen derechos; la ley se cita, no se copia entera).

- Fuentes preferidas, en orden: SCIJ/SINALEVI (`www.pgrweb.go.cr`), MOPT / Educación Vial (`www.mopt.go.cr`, `www.csv.go.cr`),
  COSEVI (`www.cosevi.go.cr`). Una copia de terceros (p. ej. Bufete de Costa Rica) sirve si reproduce SINALEVI y se anota así.
- Revisar `pdfinfo`: fecha del documento. Para 2026 hace falta el texto **con las reformas vigentes**.
- Si el `.txt` sale casi vacío, el PDF es escaneado: no hay OCR instalado. Decirlo al usuario y pedir
  otra versión del documento (o permiso para instalar `tesseract-ocr`); no transcribir de memoria.

## 2. Buscar y leer artículos

```bash
npm run -s fuentes:articulo -- fuentes/ley9078.txt 104 105
```

```bash
npm run -s fuentes:articulo -- fuentes/ley9078.txt --buscar "rotonda"
```

El script quita encabezados y pies de página y la tabla de contenido. Ojo:
- Las **notas de reforma** ("Así reformado…", "Nota de Sinalevi…") van dentro del artículo: leerlas, cambian lo vigente.
- Las **tablas de montos de multas** aparecen como nota después del artículo de la categoría (arts. 143–147);
  usar siempre la columna del año vigente ("RIGEN A PARTIR DE ENERO 2026"), no el monto nominal del texto.
- `--buscar` agrupa por el último encabezado de artículo visto; confirmar leyendo el artículo completo.

## 3. Convertir un artículo en contenido

Por cada dato que se vaya a usar:
1. Leer el artículo completo e incisos relacionados (y la categoría de multa que lo sanciona).
2. Escribir en `src/content/temas/<tema>/` con `ref: { fuente: "<id>", detalle: "Art. N inciso x)" }`
   y `verificado: "<fecha de hoy>"`. Si la fuente no está registrada, agregarla en `src/content/fuentes.ts`
   **y** en `docs/FUENTES.md`.
3. **No decir más que el texto.** Si la ley enumera algo sin jerarquía, no inventar un orden; si dice
   "podrá", no escribir "debe". Evitar "siempre/nunca" si la norma tiene excepciones.

### Reglas para preguntas generadas desde el texto

- Un solo dato por pregunta; la respuesta correcta se puede señalar en el artículo citado.
- 3–4 opciones; distractores **plausibles** (errores comunes, números cercanos, la regla de otra situación),
  de largo parecido a la correcta y sin absolutos que delaten la respuesta.
- Nada de "todas/ninguna de las anteriores" (las opciones se barajan).
- La explicación parafrasea el artículo en lenguaje simple y dice por qué las otras no aplican si ayuda.
- Después, correr la revisión del banco (skill `xlsx`): `npm run banco:exportar` y leer la hoja "Revisión".

## 4. Verificar

```bash
npm test
```

El test de contenido valida esquema, ids únicos y que cada `ref.fuente` exista. Anotar en `docs/PROGRESO.md`
qué artículos se cubrieron y qué quedó pendiente (skill `progreso-proyecto`).
