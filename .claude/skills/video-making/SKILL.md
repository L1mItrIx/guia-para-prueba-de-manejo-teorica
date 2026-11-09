---
name: video-making
description: Crear videos explicativos cortos (para redes o para compartir), APARTE de la app, grabando las escenas reales del sitio con Playwright y montándolos con ffmpeg (subtítulos quemados). Úsala solo cuando se pida un video, reel, short o clip explicativo. NO es para animaciones dentro de la app (eso es animacion-3d).
---

# Videos explicativos cortos

Los videos **no se publican dentro del sitio**: son material aparte para redes o para compartir.
Se generan desde el sitio real, así muestran exactamente lo mismo que la app y no hay que dibujar nada nuevo.

## Herramientas (ya instaladas en el entorno)

- `scripts/video/grabar.mjs` — lee un guion JSON, abre el export estático con Playwright, ejecuta los pasos,
  graba la pantalla y genera `videos/salida/<id>.mp4` (H.264, 30 fps) + `<id>.srt`.
- `ffmpeg` (con libass para los subtítulos) y la fuente DejaVu Sans.

```bash
npm run build
```

```bash
npm run video -- videos/guiones/ceda-vs-alto.json
```

`videos/guiones/` se versiona; `videos/salida/` no (los MP4 son pesados y se regeneran).

## Formato del guion (`videos/guiones/<id>.json`)

```json
{
  "id": "ceda-vs-alto",
  "titulo": "¿Quién pasa primero: CEDA o ALTO?",
  "formato": "vertical",
  "tema": "light",
  "ruta": "/carro/intersecciones/resumen/#ceda",
  "fuente": "Ley de Tránsito 9078, art. 105 inciso g)",
  "pasos": [
    { "accion": "esperarElemento", "selector": "[data-escena=ceda-vs-alto] canvas", "ms": 300 },
    { "accion": "centrar", "selector": "[data-escena=ceda-vs-alto]", "texto": "El rojo tiene ALTO. El verde tiene CEDA.", "ms": 2800 },
    { "accion": "clic", "selector": "[data-escena=ceda-vs-alto] [data-accion=reproducir]", "texto": "El rojo se detiene por completo en su ALTO.", "ms": 1300 }
  ]
}
```

- `formato`: `vertical` (1080×1920, reels/shorts/TikTok) u `horizontal` (1920×1080).
- Acciones: `esperar`, `clic`, `centrar` (hace scroll al elemento), `esperarElemento`.
  Cada animación está en `[data-escena=<id>]` y su botón en `[data-escena=<id>] [data-accion=reproducir]`.
  Elegir el elemento con `rol` + `nombre` (como en los tests e2e) o con `selector`.
- `texto`: subtítulo que aparece al empezar el paso y dura hasta el siguiente paso con texto.
- `ms`: pausa después del paso. Los carros avanzan a ~7,5 m/s (un cruce completo tarda 2–5 s); medir la duración de la escena antes de cuadrar los subtítulos.
- Por defecto se ocultan encabezado, pie, migas y `h1` (`"ocultarInterfaz": false` para mostrarlos).

## Reglas de contenido

1. **Un video = una regla.** 15–40 segundos. Estructura: situación (3 s) → pregunta (2 s) → respuesta animada → porqué → fuente.
2. **Todo dato sale del contenido verificado** (`src/content/`); el video no dice nada que la app no diga.
3. **Último subtítulo con la fuente** (ley y artículo) y "Teórico CR". Si el dato es una multa, decir que es el monto 2026.
4. **Subtítulos siempre** (la mayoría ve videos sin sonido): frases cortas, máximo ~2 líneas, tono neutral e impersonal.
5. El texto debe coincidir con lo que se ve en ese momento: revisar el `.srt` contra la animación.
6. Sin música ni audio de terceros. Si en el futuro se agrega voz, que sea propia o con licencia, y siempre con subtítulos.
7. No usar logos del MOPT, COSEVI ni de Educación Vial: el sitio no está afiliado.

## Revisión antes de entregar

```bash
ffprobe -v error -show_entries stream=width,height -show_entries format=duration -of compact videos/salida/<id>.mp4
```

```bash
ffmpeg -y -loglevel error -i videos/salida/<id>.mp4 -vf "select='eq(n\,90)+eq(n\,250)+eq(n\,400)',scale=360:-1,tile=3x1" -frames:v 1 /ruta/de/trabajo/fotogramas.png
```

Mirar los fotogramas: ¿el subtítulo coincide con lo que pasa en la escena? ¿Se lee? ¿Se ve la escena completa?
Entregar el MP4 al usuario (no subirlo a ningún lado sin que lo pida) y anotar el video en `docs/PROGRESO.md`.
