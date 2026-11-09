import { describe, expect, it } from "vitest";
import { TEMAS } from "@/content/temas";
import { filaDesdePregunta, generarArchivoPreguntas, preguntasDesdeFilas, revisarCalidad } from "../../scripts/banco/lib";

const tema = TEMAS[0];

describe("banco de preguntas ↔ hoja de cálculo", () => {
  it("ida y vuelta sin pérdidas", () => {
    const filas = tema.preguntas.map((p) => filaDesdePregunta(tema.slug, p));
    const { porTema, errores } = preguntasDesdeFilas(filas);
    expect(errores).toEqual([]);
    expect(porTema.get(tema.slug)).toEqual(tema.preguntas);
  });

  it("limpia espacios y acepta la letra en minúscula", () => {
    const f = { ...filaDesdePregunta(tema.slug, tema.preguntas[0]), enunciado: `  ${tema.preguntas[0].enunciado}   `, correcta: "a" };
    const { porTema } = preguntasDesdeFilas([f]);
    expect(porTema.get(tema.slug)![0].enunciado).toBe(tema.preguntas[0].enunciado);
  });

  it("reporta letra inválida, id repetido y datos que no cumplen el esquema", () => {
    const base = filaDesdePregunta(tema.slug, tema.preguntas[0]);
    const { errores } = preguntasDesdeFilas([
      { ...base, correcta: "E" },
      { ...base, id: "x1" },
      { ...base, id: "x1" },
      { ...base, id: "x2", correcta: "D", opcion_d: "" },
    ]);
    expect(errores.map((e) => e.fila)).toEqual([2, 4, 5]);
  });

  it("ignora filas vacías", () => {
    expect(preguntasDesdeFilas([{}, { id: "", enunciado: "" }]).errores).toEqual([]);
  });

  it("detecta absolutos, duplicadas y fuentes desconocidas", () => {
    const p = { ...tema.preguntas[0], opciones: ["Correcta", "Nunca jamás", "Otra"], correcta: 0, ref: { fuente: "inventada", detalle: "x" } };
    const tipos = revisarCalidad([{ tema: "t", p }, { tema: "t", p: { ...p, id: "otro" } }], new Set(["ley-9078"])).map((a) => a.tipo);
    expect(tipos).toContain("Absolutos");
    expect(tipos).toContain("Duplicada");
    expect(tipos).toContain("Fuente desconocida");
  });

  it("genera un archivo TS con el export esperado", () => {
    const ts = generarArchivoPreguntas(tema.preguntas.slice(0, 1), "x.xlsx");
    expect(ts).toContain('export const preguntas: TemaEntrada["preguntas"] = [');
    expect(ts).toContain(tema.preguntas[0].id);
  });
});
