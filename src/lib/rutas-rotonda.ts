import type { Direccion } from "@/content/schema";
import { crearRecorrido, derechaDe, MEDIO_CARRIL, type Recorrido, type V2 } from "./rutas";

/**
 * Geometría de la rotonda (1 unidad = 1 m). Norte = -z, Este = +x.
 * Se circula en sentido antihorario visto desde arriba (por la derecha): este → norte → oeste → sur.
 * Ángulos en radianes: 0 = este, π/2 = norte; punto(θ, r) = (r·cosθ, -r·sinθ).
 */
export const R_ISLA = 7.5;
export const R_INTERNO = 9.25;
export const R_EXTERNO = 12.75;
export const R_BORDE = 14.5;
export const R_CEDA = R_BORDE + 1.2;
export const LARGO_BRAZO = 34;
export const SALIDA_ROTONDA = 26;
const ATRAS_ROTONDA = 14;

export const ANGULO_BRAZO: Record<Direccion, number> = { este: 0, norte: Math.PI / 2, oeste: Math.PI, sur: (3 * Math.PI) / 2 };
const ORDEN_CCW: Direccion[] = ["este", "norte", "oeste", "sur"];

export const punto = (theta: number, r: number): V2 => ({ x: r * Math.cos(theta), z: -r * Math.sin(theta) });
const haciaAfuera = (d: Direccion): V2 => punto(ANGULO_BRAZO[d], 1);

/** Número de salida (1.ª, 2.ª, 3.ª, 4.ª = vuelta completa) al entrar por `entrada` y salir por `salida`. */
export function numeroDeSalida(entrada: Direccion, salida: Direccion): number {
  const i = ORDEN_CCW.indexOf(entrada);
  const j = ORDEN_CCW.indexOf(salida);
  const n = (j - i + 4) % 4;
  return n === 0 ? 4 : n;
}

/** Punto del carril de llegada (lado derecho) del brazo `d`, a `dist` metros del centro. */
export function puntoLlegada(d: Direccion, dist: number): V2 {
  const u = haciaAfuera(d);
  const r = derechaDe({ x: -u.x, z: -u.z });
  return { x: u.x * dist + r.x * MEDIO_CARRIL, z: u.z * dist + r.z * MEDIO_CARRIL };
}

/** Punto del carril de salida (lado derecho al alejarse) del brazo `d`, a `dist` metros del centro. */
export function puntoSalida(d: Direccion, dist: number): V2 {
  const u = haciaAfuera(d);
  const r = derechaDe(u);
  return { x: u.x * dist + r.x * MEDIO_CARRIL, z: u.z * dist + r.z * MEDIO_CARRIL };
}

function arco(desde: number, hasta: number, radio: number): V2[] {
  const pasos = Math.max(2, Math.ceil((hasta - desde) / 0.06));
  return Array.from({ length: pasos + 1 }, (_, k) => punto(desde + ((hasta - desde) * k) / pasos, radio));
}

export function recorridoRotonda(v: {
  entrada?: Direccion;
  dentroDesde?: number;
  salida: Direccion;
  carril: "interno" | "externo";
  fin?: number;
}): Recorrido {
  const radio = v.carril === "interno" ? R_INTERNO : R_EXTERNO;
  const delta = Math.asin(MEDIO_CARRIL / radio);
  const puntos: V2[] = [];
  let sParada = 0;
  let thetaInicio: number;
  if (v.entrada) {
    puntos.push(puntoLlegada(v.entrada, R_CEDA + ATRAS_ROTONDA), puntoLlegada(v.entrada, R_CEDA));
    sParada = ATRAS_ROTONDA;
    thetaInicio = ANGULO_BRAZO[v.entrada] + delta + 0.22;
  } else {
    thetaInicio = ((v.dentroDesde ?? 0) * Math.PI) / 180;
  }
  let thetaFin = ANGULO_BRAZO[v.salida] - delta - 0.22;
  while (thetaFin <= thetaInicio + 0.3) thetaFin += 2 * Math.PI;
  puntos.push(...arco(thetaInicio, thetaFin, radio));
  puntos.push(puntoSalida(v.salida, R_CEDA), puntoSalida(v.salida, v.fin ?? SALIDA_ROTONDA));
  return crearRecorrido(puntos, sParada);
}
