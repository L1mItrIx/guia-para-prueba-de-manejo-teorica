import type { Direccion, Escena, Luz, Paso } from "@/content/schema";
import { crearLineaTiempo, pasosDesdeOrden, type EstadoEscena } from "./lineaTiempo";
import { recorridoCruce, SALIDA, type Recorrido } from "./rutas";
import { recorridoRotonda, SALIDA_ROTONDA } from "./rutas-rotonda";

export type ModeloEscena = {
  recorridos: Record<string, Recorrido>;
  duracion: number;
  estadoEn: (t: number) => EstadoEscena;
};

const LUZ_DE_CONTROL: Record<string, Luz | undefined> = {
  "semaforo-rojo": "rojo",
  "semaforo-amarillo": "amarillo",
  "semaforo-verde": "verde",
};

/** Pasos efectivos de una escena (los explícitos, o los derivados de `orden`). */
export function pasosDe(e: Escena): Paso[] {
  return e.pasos ?? pasosDesdeOrden(e.orden ?? []);
}

/** Convierte una escena del contenido en recorridos + línea de tiempo (lógica pura). */
export function modeloEscena(e: Escena): ModeloEscena {
  const pasos = pasosDe(e);
  // El que sale primero llega más lejos, para que no se encimen si toman la misma calle.
  const ordenSalida = [...new Set(pasos.flatMap((p) => (p.accion === "mover" && p.hasta === "fin" ? [p.vehiculo] : [])))];
  const escalon = (id: string) => {
    const k = ordenSalida.indexOf(id);
    return k < 0 ? 0 : ordenSalida.length - 1 - k;
  };

  const recorridos: Record<string, Recorrido> = {};
  const actores = [];
  let luces: Partial<Record<Direccion, Luz>> = {};
  let peatones: string[] = [];

  if (e.tipo === "cruce") {
    for (const v of e.vehiculos) {
      const r = recorridoCruce(v.desde, v.maniobra, v.fin ?? SALIDA + escalon(v.id) * 6.5);
      recorridos[v.id] = r;
      actores.push({ id: v.id, largo: r.largo, sParada: r.sParada, s0: r.sParada + v.inicio });
    }
    luces = Object.fromEntries(
      Object.entries(e.controles).flatMap(([d, c]) => (LUZ_DE_CONTROL[c] ? [[d, LUZ_DE_CONTROL[c]]] : [])),
    );
    peatones = e.peatones.map((p) => p.id);
  } else {
    for (const v of e.vehiculos) {
      const r = recorridoRotonda({ ...v, fin: SALIDA_ROTONDA + escalon(v.id) * 5 });
      recorridos[v.id] = r;
      actores.push({ id: v.id, largo: r.largo, sParada: r.sParada, s0: v.entrada ? r.sParada : 0 });
    }
  }

  const lt = crearLineaTiempo(actores, peatones, luces, pasos);
  return { recorridos, duracion: lt.duracion, estadoEn: lt.estadoEn };
}
