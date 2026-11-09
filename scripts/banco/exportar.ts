/** npm run banco:exportar [-- salida.xlsx]  →  banco/preguntas.xlsx con las hojas Preguntas, Revisión e Instrucciones. */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { TEMAS } from "../../src/content/temas";
import { FUENTES } from "../../src/content/fuentes";
import { filaDesdePregunta, revisarCalidad } from "./lib";
import { crearLibro } from "./excel";

async function main() {
  const salida = process.argv[2] ?? "banco/preguntas.xlsx";
  const filas = TEMAS.flatMap((t) => t.preguntas.map((p) => filaDesdePregunta(t.slug, p)));
  const avisos = revisarCalidad(
    TEMAS.flatMap((t) => t.preguntas.map((p) => ({ tema: t.slug, p }))),
    new Set(FUENTES.map((f) => f.id)),
  );
  mkdirSync(dirname(salida), { recursive: true });
  const libro = await crearLibro(filas, avisos);
  await libro.xlsx.writeFile(salida);
  console.log(`✔ ${filas.length} preguntas exportadas a ${salida}`);
  console.log(avisos.length ? `⚠ ${avisos.length} avisos de calidad (hoja "Revisión")` : "✔ Sin avisos de calidad");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
