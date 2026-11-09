---
name: progreso-proyecto
description: Memoria del proyecto de la web de la prueba teórica de Costa Rica. Úsala al INICIAR cualquier sesión o tarea (para saber dónde quedamos), al TERMINAR una tarea o antes de un commit (para registrar lo hecho), cuando se tome una decisión de diseño, y cuando el usuario pregunte "¿en qué vamos?", "¿qué falta?" o "¿qué sigue?".
---

# Progreso del proyecto (memoria entre sesiones)

Las sesiones de Claude empiezan sin recuerdos. La memoria del proyecto es **`docs/PROGRESO.md`**,
versionado en git. Un hook `SessionStart` (`.claude/settings.json`) lo muestra al abrir cada sesión.

## Al empezar

1. Leer `docs/PROGRESO.md` completo (si el hook ya lo mostró, basta con ese texto).
2. Contrastar con la realidad: `git log --oneline -10` y `git status`. Si no coinciden, gana el código;
   corrige `PROGRESO.md`.
3. Si el usuario no dio una tarea, proponer el primer punto de **Siguiente**.

## Al terminar una tarea (antes del commit)

Editar `docs/PROGRESO.md`, sin borrar historia:

- **Estado actual**: 1–3 líneas, qué funciona hoy.
- **Hecho**: marcar `[x]` lo completado.
- **Siguiente**: lista ordenada y concreta (lo que haría la próxima sesión). Quitar lo terminado.
- **Decisiones**: agregar una línea `AAAA-MM-DD — decisión — por qué` si se decidió algo que no
  se deduce leyendo el código (stack, alcance, convenciones, algo descartado).
- **Bitácora**: agregar arriba una línea `AAAA-MM-DD — resumen de la sesión`.
- **Contenido**: actualizar la tabla de cobertura (tema × licencia × nº de preguntas/tarjetas).

Si se usó o verificó una fuente, anotarla en `docs/FUENTES.md` con la fecha de verificación.

## Reglas

- Breve y factual: es una lista de control, no un diario. Máximo ~150 líneas; si crece, resumir la bitácora antigua.
- Nunca escribir en `PROGRESO.md` cosas que no se hicieron o no se verificaron.
- Incluir el archivo actualizado en el mismo commit que el trabajo.
- Contenido 2026: si una norma, monto de multa o formato del examen cambia, registrar el cambio
  en Decisiones y en `docs/FUENTES.md`, y marcar los temas afectados en **Siguiente**.
