import { describe, expect, it } from "vitest";
import { TEMAS } from "@/content/temas";
import { buscarFuente } from "@/content/fuentes";
import { LICENCIAS } from "@/content/licencias";
import { FUENTES } from "@/content/fuentes";
import { AVISOS_BLOQUEANTES, revisarCalidad } from "../../scripts/banco/lib";

describe("contenido", () => {
  it("todos los temas cumplen el esquema (TEMAS ya hace parse)", () => {
    expect(TEMAS.length).toBeGreaterThan(0);
  });

  it("slugs únicos", () => {
    const slugs = TEMAS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ids únicos dentro de todo el sitio", () => {
    const ids = TEMAS.flatMap((t) => [
      ...t.preguntas.map((p) => `p:${p.id}`),
      ...t.flashcards.map((f) => `f:${f.id}`),
      ...t.escenarios.map((e) => `e:${e.id}`),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada referencia apunta a una fuente registrada", () => {
    for (const t of TEMAS) {
      const refs = [
        ...t.resumen.map((r) => r.ref),
        ...t.preguntas.map((p) => p.ref),
        ...t.flashcards.map((f) => f.ref),
        ...t.escenarios.map((e) => e.ref),
      ];
      for (const r of refs) expect(buscarFuente(r.fuente), `${t.slug}: ${r.fuente}`).toBeDefined();
    }
  });

  it("las opciones de cada pregunta no se repiten", () => {
    for (const t of TEMAS)
      for (const p of t.preguntas) expect(new Set(p.opciones).size, p.id).toBe(p.opciones.length);
  });

  it("hay al menos una licencia disponible y cada tema usa licencias existentes", () => {
    expect(LICENCIAS.some((l) => l.disponible)).toBe(true);
    const ids = new Set(LICENCIAS.map((l) => l.id));
    for (const t of TEMAS) for (const l of t.licencias) expect(ids.has(l)).toBe(true);
  });

  it("ninguna pregunta da pistas obvias (largo, eco, absolutos, comodines, duplicadas)", () => {
    const avisos = revisarCalidad(
      TEMAS.flatMap((t) => t.preguntas.map((p) => ({ tema: t.slug, p }))),
      new Set(FUENTES.map((f) => f.id)),
    ).filter((a) => AVISOS_BLOQUEANTES.includes(a.tipo));
    expect(avisos, avisos.map((a) => `${a.id} · ${a.tipo}: ${a.detalle}`).join("\n")).toEqual([]);
  });
});
