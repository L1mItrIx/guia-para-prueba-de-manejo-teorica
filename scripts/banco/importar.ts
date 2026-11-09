/**
 * npm run banco:importar -- banco/preguntas.xlsx [--escribir]
 * Sin --escribir solo valida y muestra el resumen (modo prueba). Con --escribir reescribe
 * src/content/temas/<tema>/preguntas.ts de cada tema presente en la hoja.
 */
import { existsSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { TEMAS } from "../../src/content/temas";
import { FUENTES } from "../../src/content/fuentes";
import { generarArchivoPreguntas, preguntasDesdeFilas, revisarCalidad } from "./lib";
import { leerFilas } from "./excel";

async function main() {
  const args = process.argv.slice(2);
  const archivo = args.find((a) => !a.startsWith("--")) ?? "banco/preguntas.xlsx";
  const escribir = args.includes("--escribir");

  const { porTema, errores } = preguntasDesdeFilas(await leerFilas(archivo));
  for (const tema of porTema.keys()) {
    if (!TEMAS.some((t) => t.slug === tema)) errores.push({ fila: 0, id: "-", mensaje: `El tema "${tema}" no existe (créalo primero, ver skill arquitectura)` });
  }
  if (errores.length) {
    console.error(`✘ ${errores.length} errores; no se escribió nada:`);
    for (const e of errores) console.error(`  fila ${e.fila} (${e.id}): ${e.mensaje}`);
    process.exit(1);
  }

  const todas = [...porTema].flatMap(([tema, ps]) => ps.map((p) => ({ tema, p })));
  const avisos = revisarCalidad(todas, new Set(FUENTES.map((f) => f.id)));
  for (const [tema, ps] of porTema) {
    const antes = TEMAS.find((t) => t.slug === tema)!.preguntas.map((p) => p.id);
    const despues = ps.map((p) => p.id);
    const nuevas = despues.filter((id) => !antes.includes(id));
    const quitadas = antes.filter((id) => !despues.includes(id));
    console.log(`• ${tema}: ${ps.length} preguntas (${nuevas.length} nuevas${nuevas.length ? `: ${nuevas.join(", ")}` : ""}; ${quitadas.length} quitadas${quitadas.length ? `: ${quitadas.join(", ")}` : ""})`);
  }
  if (avisos.length) console.log(`⚠ ${avisos.length} avisos de calidad (no bloquean): ${[...new Set(avisos.map((a) => a.tipo))].join(", ")}`);

  if (!escribir) {
    console.log("Modo prueba: no se escribió nada. Repetí con --escribir para aplicar.");
  } else {
    for (const [tema, ps] of porTema) {
      const destino = `src/content/temas/${tema}/preguntas.ts`;
      if (!existsSync(destino)) throw new Error(`No existe ${destino}`);
      writeFileSync(destino, generarArchivoPreguntas(ps, basename(archivo)));
      console.log(`✔ Escrito ${destino}`);
    }
    console.log("Siguiente: npm test && npm run build, y revisá el diff antes de hacer commit.");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
