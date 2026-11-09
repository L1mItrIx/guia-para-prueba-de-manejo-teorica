#!/usr/bin/env node
/**
 * Imprime el texto limpio de uno o más artículos de un texto extraído con pdftotext.
 *   node scripts/fuentes/articulo.mjs fuentes/ley9078.txt 104 105
 *   node scripts/fuentes/articulo.mjs fuentes/ley9078.txt --buscar "rotonda"
 * Quita encabezados/pies de página repetidos y números de página. Incluye las notas de
 * reforma ("Así reformado…", "Nota de Sinalevi…") porque cambian lo vigente.
 */
import { readFileSync } from "node:fs";

const [archivo, ...resto] = process.argv.slice(2);
if (!archivo || resto.length === 0) {
  console.error('Uso: articulo.mjs <archivo.txt> <número...> | --buscar "texto"');
  process.exit(1);
}

const crudo = readFileSync(archivo, "utf8").split("\n");

// Líneas que se repiten muchas veces (encabezados y pies de página) se consideran ruido.
const frecuencia = new Map();
for (const l of crudo) {
  const t = l.trim();
  if (t) frecuencia.set(t, (frecuencia.get(t) ?? 0) + 1);
}
const umbral = Math.max(20, crudo.length / 400);
const limpio = crudo.filter((l) => {
  const t = l.trim();
  if (/^_{5,}|_{5,}$/.test(t)) return false;
  if (/^\d{1,4}$/.test(t)) return false; // número de página
  return !t || (frecuencia.get(t) ?? 0) < umbral || /^ART[ÍI]CULO \d+/i.test(t);
});

// Ignora la tabla de contenido (líneas con puntos guía "......").
const esInicio = (l, n) => new RegExp(`^\\s*ART[ÍI]CULO ${n}\\s*$`, "i").test(l);
const esCualquierInicio = (l) => /^\s*(ART[ÍI]CULO \d+[A-Z]?|T[ÍI]TULO [IVXLC]+|CAP[ÍI]TULO [IVXLC]+|TRANSITORIO [IVXLC]+)\s*$/i.test(l);

function articulo(n) {
  const i = limpio.findIndex((l) => esInicio(l, n));
  if (i < 0) return null;
  let j = i + 1;
  while (j < limpio.length && !esCualquierInicio(limpio[j])) j++;
  return limpio
    .slice(i, j)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

if (resto[0] === "--buscar") {
  const texto = resto.slice(1).join(" ").toLowerCase();
  let actual = "(antes del primer artículo)";
  const hallazgos = new Map();
  for (const l of limpio) {
    const m = l.match(/^\s*ART[ÍI]CULO (\d+[A-Z]?)\s*$/i);
    if (m) actual = `Art. ${m[1]}`;
    else if (l.toLowerCase().includes(texto)) hallazgos.set(actual, [...(hallazgos.get(actual) ?? []), l.trim()]);
  }
  for (const [art, lineas] of hallazgos) console.log(`${art}:\n  ${lineas.slice(0, 3).join("\n  ")}${lineas.length > 3 ? `\n  … (${lineas.length} coincidencias)` : ""}`);
  if (!hallazgos.size) console.log("Sin coincidencias.");
} else {
  for (const n of resto) {
    const t = articulo(n);
    console.log(t ?? `✘ No encontré el ARTÍCULO ${n}`);
    console.log("\n" + "─".repeat(60) + "\n");
  }
}
