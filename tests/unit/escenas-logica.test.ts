import { describe, expect, it } from "vitest";
import { crearLineaTiempo, pasosDesdeOrden, VELOCIDAD } from "@/lib/lineaTiempo";
import { ATRAS, recorridoCruce } from "@/lib/rutas";
import { numeroDeSalida, puntoSalida, recorridoRotonda, R_BORDE } from "@/lib/rutas-rotonda";

const cerca = (a: number, b: number, d = 3) => expect(a).toBeCloseTo(b, d);

describe("recorridoCruce", () => {
  it("empieza ATRAS metros antes de la línea de parada y en s = sParada está en la línea", () => {
    const r = recorridoCruce("sur", "recto");
    expect(r.sParada).toBe(ATRAS);
    const enLinea = r.en(r.sParada);
    const inicio = r.en(0);
    cerca(inicio.z - enLinea.z, ATRAS);
    cerca(inicio.x, enLinea.x);
  });
});

describe("rotonda (sentido antihorario visto desde arriba)", () => {
  it("numera las salidas: desde el sur, este es la 1.ª y oeste la 3.ª", () => {
    expect(numeroDeSalida("sur", "este")).toBe(1);
    expect(numeroDeSalida("sur", "norte")).toBe(2);
    expect(numeroDeSalida("sur", "oeste")).toBe(3);
    expect(numeroDeSalida("sur", "sur")).toBe(4);
  });

  it("entra por el sur por el carril derecho y sale por el oeste en el carril derecho de esa calle", () => {
    const r = recorridoRotonda({ entrada: "sur", salida: "oeste", carril: "interno" });
    const ini = r.en(0);
    expect(ini.x).toBeGreaterThan(0);
    expect(ini.z).toBeGreaterThan(R_BORDE);
    const fin = r.en(r.largo);
    const esperado = puntoSalida("oeste", 26);
    cerca(fin.x, esperado.x);
    cerca(fin.z, esperado.z);
    expect(esperado.z).toBeLessThan(0); // al alejarse hacia el oeste, su derecha es el norte
  });

  it("la 1.ª salida recorre menos que la 3.ª", () => {
    const corta = recorridoRotonda({ entrada: "sur", salida: "este", carril: "externo" });
    const larga = recorridoRotonda({ entrada: "sur", salida: "oeste", carril: "externo" });
    expect(corta.largo).toBeLessThan(larga.largo);
  });

  it("un vehículo que ya circula dentro no tiene línea de ceda", () => {
    expect(recorridoRotonda({ dentroDesde: 180, salida: "este", carril: "externo" }).sParada).toBe(0);
  });
});

describe("línea de tiempo", () => {
  const vehiculos = [
    { id: "a", largo: 40, sParada: 20, s0: 20 },
    { id: "b", largo: 40, sParada: 20, s0: 10 },
  ];

  it("mueve los vehículos en orden, uno a la vez", () => {
    const lt = crearLineaTiempo(vehiculos, [], {}, pasosDesdeOrden(["a", "b"]));
    cerca(lt.duracion, 20 / VELOCIDAD + 30 / VELOCIDAD);
    const medio = lt.estadoEn(20 / VELOCIDAD / 2);
    expect(medio.moviendo).toBe("a");
    expect(medio.s.b).toBe(10);
    const fin = lt.estadoEn(lt.duracion + 1);
    expect(fin.s).toEqual({ a: 40, b: 40 });
    expect(fin.moviendo).toBeNull();
  });

  it("'parada' deja el vehículo en su línea; semáforo y peatones cambian en su turno", () => {
    const lt = crearLineaTiempo(vehiculos, ["p1"], { sur: "verde" }, [
      { accion: "semaforo", acceso: "sur", luz: "amarillo" },
      { accion: "mover", vehiculo: "b", hasta: "parada" },
      { accion: "peatones" },
      { accion: "pausa", segundos: 1 },
    ]);
    expect(lt.estadoEn(0).luces.sur).toBe("amarillo");
    const fin = lt.estadoEn(lt.duracion);
    expect(fin.s.b).toBe(20);
    expect(fin.peatones.p1).toBe(1);
  });

  it("falla con un vehículo desconocido", () => {
    expect(() => crearLineaTiempo(vehiculos, [], {}, pasosDesdeOrden(["x"]))).toThrow();
  });
});
