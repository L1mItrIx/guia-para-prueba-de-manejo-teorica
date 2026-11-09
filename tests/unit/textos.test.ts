import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tono del sitio: español neutral, natural e impersonal (ver skill frontend-design).
 * Lista explícita de formas que no deben aparecer en textos visibles ni en el contenido.
 */
const PROHIBIDAS: [RegExp, string][] = [
  // voseo
  [/\b(Elegí|Practicá|Tocá|Arrastrá|pellizcá|Usá|usá|Repasá|Volvé|Pasá|poné|Confirmalo|sabés|fallás|empezás|borrás|tenés|podés|querés)\b/, "voseo"],
  // tuteo
  [/\b(Prepárate|Elige|Estudia gratis|Practica con|Empieza|Repasa las|tu progreso|Tu progreso|tu navegador|Tu navegador|tus datos|Tus datos|te sirve|verás|acertaste|fallaste)\b/, "tuteo"],
  // usted
  [/\b(usted|Usted|cederle el paso)\b/, "usted"],
  // promesas que el sitio no puede hacer
  [/igual que (en )?el examen real/i, "promesa falsa"],
  [/examen oficial(?! la aplica)/i, "promesa falsa"],
  [/(pasar|aprobar|pasá)[^.]{0,30}a la primera\b/i, "frase de marketing"],
];

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : /\.(tsx?|mdx?)$/.test(n) ? [p] : [];
  });
}

describe("textos neutrales", () => {
  it("no hay voseo, tuteo, usted ni promesas sobre la prueba oficial", () => {
    const hallazgos: string[] = [];
    for (const f of archivos("src")) {
      readFileSync(f, "utf8")
        .split("\n")
        .forEach((linea, i) => {
          if (/^\s*(\/\/|\*|\/\*)/.test(linea)) return; // comentarios de código
          for (const [re, tipo] of PROHIBIDAS) {
            const m = linea.match(re);
            if (m) hallazgos.push(`${f}:${i + 1} (${tipo}) «${m[0]}»`);
          }
        });
    }
    expect(hallazgos, hallazgos.join("\n")).toEqual([]);
  });
});
