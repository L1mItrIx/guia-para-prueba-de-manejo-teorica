import { describe, expect, it } from "vitest";
import { TEMAS } from "@/content/temas";
import { buscarFuente } from "@/content/fuentes";
import { LICENCIAS } from "@/content/licencias";
import { FUENTES } from "@/content/fuentes";
import { modeloEscena } from "@/lib/modeloEscena";
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
      ...t.escenas.map((e) => `e:${e.id}`),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada referencia apunta a una fuente registrada", () => {
    for (const t of TEMAS) {
      const refs = [
        ...t.resumen.map((r) => r.ref),
        ...t.preguntas.map((p) => p.ref),
        ...t.flashcards.map((f) => f.ref),
        ...t.escenas.map((e) => e.ref),
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

  it("toda referencia a una escena (resumen, preguntas, flashcards) existe en el tema", () => {
    for (const t of TEMAS) {
      const ids = new Set(t.escenas.map((e) => e.id));
      const refs = [
        ...t.resumen.flatMap((r) => r.escenas.map((e) => `resumen ${r.id} → ${e}`)),
        ...t.preguntas.flatMap((p) => (p.escena ? [`pregunta ${p.id} → ${p.escena}`] : [])),
        ...t.flashcards.flatMap((f) => (f.escena ? [`flashcard ${f.id} → ${f.escena}`] : [])),
      ];
      const rotas = refs.filter((r) => !ids.has(r.split(" → ")[1]));
      expect(rotas, rotas.join("\n")).toEqual([]);
    }
  });

  it("cada escena se puede animar y termina con los vehículos dentro de su recorrido", () => {
    for (const t of TEMAS)
      for (const e of t.escenas) {
        const m = modeloEscena(e);
        expect(m.duracion, e.id).toBeGreaterThan(0);
        const fin = m.estadoEn(m.duracion);
        for (const v of e.vehiculos) {
          expect(fin.s[v.id], `${e.id}/${v.id}`).toBeGreaterThanOrEqual(0);
          expect(fin.s[v.id], `${e.id}/${v.id}`).toBeLessThanOrEqual(m.recorridos[v.id].largo + 1e-6);
        }
      }
  });

  it("cada escena se usa en al menos un modo de estudio", () => {
    for (const t of TEMAS) {
      const usadas = new Set([...t.resumen.flatMap((r) => r.escenas), ...t.preguntas.map((p) => p.escena), ...t.flashcards.map((f) => f.escena)]);
      const sinUso = t.escenas.filter((e) => !usadas.has(e.id)).map((e) => e.id);
      expect(sinUso).toEqual([]);
    }
  });
});
