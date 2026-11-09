import type { Direccion, Luz, Paso } from "@/content/schema";

/**
 * Motor de la línea de tiempo de una escena (lógica pura, sin three.js).
 * Recibe los actores y los pasos, y responde "¿cómo está todo en el segundo t?".
 */
export type ActorVehiculo = { id: string; largo: number; sParada: number; s0: number };

export type EstadoEscena = {
  s: Record<string, number>; // metros recorridos por cada vehículo
  peatones: Record<string, number>; // 0 = en la acera de inicio, 1 = cruzó
  luces: Partial<Record<Direccion, Luz>>;
  moviendo: string | null; // vehículo que se mueve en este instante
};

export const VELOCIDAD = 7.5; // m/s
export const DURACION_PEATONES = 4.2;
export const DURACION_SEMAFORO = 0.9;

type Segmento =
  | { tipo: "mover"; id: string; desde: number; hasta: number; t0: number; t1: number }
  | { tipo: "peatones"; ids: string[]; t0: number; t1: number }
  | { tipo: "semaforo"; acceso: Direccion; luz: Luz; t0: number; t1: number }
  | { tipo: "pausa"; t0: number; t1: number };

const suave = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export function pasosDesdeOrden(orden: string[]): Paso[] {
  return orden.map((vehiculo) => ({ accion: "mover", vehiculo, hasta: "fin" }) as const);
}

export function crearLineaTiempo(
  vehiculos: ActorVehiculo[],
  peatones: string[],
  lucesIniciales: Partial<Record<Direccion, Luz>>,
  pasos: Paso[],
): { duracion: number; estadoEn: (t: number) => EstadoEscena } {
  const porId = new Map(vehiculos.map((v) => [v.id, v]));
  const pos = new Map(vehiculos.map((v) => [v.id, v.s0]));
  const segmentos: Segmento[] = [];
  let t = 0;
  for (const p of pasos) {
    if (p.accion === "mover") {
      const v = porId.get(p.vehiculo);
      if (!v) throw new Error(`Vehículo desconocido en la escena: ${p.vehiculo}`);
      const desde = pos.get(v.id)!;
      const hasta = p.hasta === "parada" ? v.sParada : v.largo;
      const dur = Math.max(0.8, Math.abs(hasta - desde) / VELOCIDAD);
      segmentos.push({ tipo: "mover", id: v.id, desde, hasta, t0: t, t1: t + dur });
      pos.set(v.id, hasta);
      t += dur;
    } else if (p.accion === "peatones") {
      segmentos.push({ tipo: "peatones", ids: p.peatones ?? peatones, t0: t, t1: t + DURACION_PEATONES });
      t += DURACION_PEATONES;
    } else if (p.accion === "semaforo") {
      segmentos.push({ tipo: "semaforo", acceso: p.acceso, luz: p.luz, t0: t, t1: t + DURACION_SEMAFORO });
      t += DURACION_SEMAFORO;
    } else {
      segmentos.push({ tipo: "pausa", t0: t, t1: t + p.segundos });
      t += p.segundos;
    }
  }
  const duracion = t;

  const estadoEn = (tiempo: number): EstadoEscena => {
    const e: EstadoEscena = {
      s: Object.fromEntries(vehiculos.map((v) => [v.id, v.s0])),
      peatones: Object.fromEntries(peatones.map((id) => [id, 0])),
      luces: { ...lucesIniciales },
      moviendo: null,
    };
    for (const seg of segmentos) {
      if (tiempo < seg.t0) break;
      const f = seg.t1 > seg.t0 ? Math.min(1, (tiempo - seg.t0) / (seg.t1 - seg.t0)) : 1;
      if (seg.tipo === "mover") {
        e.s[seg.id] = seg.desde + (seg.hasta - seg.desde) * suave(f);
        if (f < 1) e.moviendo = seg.id;
      } else if (seg.tipo === "peatones") {
        for (const id of seg.ids) e.peatones[id] = f;
      } else if (seg.tipo === "semaforo") {
        e.luces[seg.acceso] = seg.luz;
      }
    }
    return e;
  };

  return { duracion, estadoEn };
}
