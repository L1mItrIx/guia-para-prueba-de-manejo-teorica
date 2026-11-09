import { describe, expect, it } from "vitest";
import { anguloDeRumbo, posicionDeEspera, posicionEnRuta, rutaVehiculo, MEDIO_CARRIL, SALIDA } from "@/lib/rutas";

const cerca = (a: number, b: number) => expect(a).toBeCloseTo(b, 5);

describe("rutas (se circula por la derecha; norte = -z)", () => {
  it("el que viene del sur espera en el carril derecho (x > 0)", () => {
    const p = posicionDeEspera("sur");
    cerca(p.x, MEDIO_CARRIL);
    expect(p.z).toBeGreaterThan(0);
  });

  it("recto desde el sur termina al norte en su carril", () => {
    const r = rutaVehiculo("sur", "recto");
    const fin = r[r.length - 1];
    cerca(fin.x, MEDIO_CARRIL);
    cerca(fin.z, -SALIDA);
  });

  it("derecha desde el sur termina al este, en el carril sur de esa calle", () => {
    const fin = rutaVehiculo("sur", "derecha").at(-1)!;
    cerca(fin.x, SALIDA);
    cerca(fin.z, MEDIO_CARRIL);
  });

  it("izquierda desde el sur termina al oeste, en el carril norte de esa calle", () => {
    const fin = rutaVehiculo("sur", "izquierda").at(-1)!;
    cerca(fin.x, -SALIDA);
    cerca(fin.z, -MEDIO_CARRIL);
  });

  it("posicionEnRuta interpola de inicio a fin", () => {
    const r = rutaVehiculo("este", "recto");
    const a = posicionEnRuta(r, 0);
    const b = posicionEnRuta(r, 1);
    cerca(a.x, r[0].x);
    cerca(b.x, r.at(-1)!.x);
  });

  it("anguloDeRumbo: norte = 0, oeste = +90°", () => {
    cerca(anguloDeRumbo({ x: 0, z: -1 }), 0);
    cerca(anguloDeRumbo({ x: -1, z: 0 }), Math.PI / 2);
  });
});

describe("salida configurable", () => {
  it("permite terminar más lejos", () => {
    const fin = rutaVehiculo("sur", "recto", 20).at(-1)!;
    cerca(fin.z, -20);
  });
});
