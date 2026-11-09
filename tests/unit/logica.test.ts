import { describe, expect, it } from "vitest";
import { barajar, barajarOpciones, crearAleatorio } from "@/lib/barajar";
import { calificar, formatoTiempo } from "@/lib/calificar";
import { CAJA_MAX, dominio, ordenarParaRepaso, responderTarjeta, tocaRepasar } from "@/lib/leitner";

describe("barajar", () => {
  it("conserva los elementos y no muta el original", () => {
    const orig = [1, 2, 3, 4, 5];
    const b = barajar(orig, crearAleatorio(1));
    expect([...b].sort()).toEqual(orig);
    expect(orig).toEqual([1, 2, 3, 4, 5]);
  });
  it("barajarOpciones sigue la respuesta correcta", () => {
    const r = barajarOpciones(["a", "b", "c", "d"], 2, crearAleatorio(7));
    expect(r.opciones[r.correcta]).toBe("c");
  });
});

describe("calificar", () => {
  it("70 de 100 aprueba con nota mínima 70", () => {
    const correctas = Array.from({ length: 40 }, () => 0);
    const respuestas = correctas.map((_, i) => (i < 28 ? 0 : 1));
    const r = calificar(respuestas, correctas, 70);
    expect(r).toEqual({ total: 40, correctas: 28, nota: 70, aprobado: true });
  });
  it("las no respondidas cuentan como malas", () => {
    expect(calificar([null, 0], [0, 0], 70).nota).toBe(50);
  });
  it("formatoTiempo", () => {
    expect(formatoTiempo(50 * 60)).toBe("50:00");
    expect(formatoTiempo(65)).toBe("01:05");
    expect(formatoTiempo(-3)).toBe("00:00");
  });
});

describe("leitner", () => {
  const ahora = 1_000_000;
  it("acertar sube de caja y fallar regresa a 1", () => {
    let e = responderTarjeta(undefined, true, ahora);
    expect(e.caja).toBe(2);
    e = responderTarjeta(e, true, ahora);
    expect(e.caja).toBe(3);
    e = responderTarjeta(e, false, ahora);
    expect(e.caja).toBe(1);
  });
  it("no pasa de la caja máxima", () => {
    let e = undefined;
    for (let i = 0; i < 10; i++) e = responderTarjeta(e, true, ahora);
    expect(e!.caja).toBe(CAJA_MAX);
  });
  it("las nuevas tocan; las programadas a futuro no", () => {
    expect(tocaRepasar(undefined, ahora)).toBe(true);
    expect(tocaRepasar(responderTarjeta(undefined, true, ahora), ahora)).toBe(false);
  });
  it("ordena primero las pendientes", () => {
    const estados = { a: responderTarjeta(undefined, true, ahora) };
    const orden = ordenarParaRepaso([{ id: "a" }, { id: "b" }], estados, ahora);
    expect(orden.map((t) => t.id)).toEqual(["b", "a"]);
  });
  it("dominio cuenta cajas 4 y 5", () => {
    expect(dominio(["a", "b"], { a: { caja: 4, proxima: 0 }, b: { caja: 2, proxima: 0 } })).toBe(50);
  });
});
