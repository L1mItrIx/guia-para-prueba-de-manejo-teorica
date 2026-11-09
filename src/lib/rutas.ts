import type { Direccion, Maniobra } from "@/content/schema";

/**
 * Geometría de la intersección (1 unidad = 1 m). Norte = -z, Este = +x.
 * Calles de doble sentido con un carril por sentido de 3,5 m; se circula por la derecha.
 */
export const CARRIL = 3.5;
export const MEDIO_CARRIL = CARRIL / 2;
export const BORDE_CRUCE = CARRIL; // la intersección es un cuadrado de 7 × 7
export const LINEA_PARADA = BORDE_CRUCE + 1.5;
export const LARGO_CALLE = 30;
/** Hasta dónde avanza un carro después de cruzar (queda visible en la escena). */
export const SALIDA = 13;

export type V2 = { x: number; z: number };

const UNITARIO: Record<Direccion, V2> = {
  norte: { x: 0, z: -1 },
  sur: { x: 0, z: 1 },
  este: { x: 1, z: 0 },
  oeste: { x: -1, z: 0 },
};

const suma = (a: V2, b: V2): V2 => ({ x: a.x + b.x, z: a.z + b.z });
const escala = (a: V2, k: number): V2 => ({ x: a.x * k, z: a.z * k });
/** Vector a la derecha de un rumbo (con norte = -z). */
export const derechaDe = (h: V2): V2 => ({ x: -h.z, z: h.x });

/** Rumbo de un vehículo que llega desde `desde` (va hacia el centro). */
export const rumboDesde = (desde: Direccion): V2 => escala(UNITARIO[desde], -1);

/** Posición en la línea de parada del acceso `desde`. */
export function posicionDeEspera(desde: Direccion): V2 {
  return suma(escala(UNITARIO[desde], LINEA_PARADA + 2.4), escala(derechaDe(rumboDesde(desde)), MEDIO_CARRIL));
}

/** Rumbo de salida según la maniobra. */
export function rumboSalida(desde: Direccion, maniobra: Maniobra): V2 {
  const h = rumboDesde(desde);
  if (maniobra === "recto") return h;
  const r = derechaDe(h);
  return maniobra === "derecha" ? r : escala(r, -1);
}

/** Bézier cuadrática. */
function bezier(p0: V2, c: V2, p1: V2, t: number): V2 {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, z: u * u * p0.z + 2 * u * t * c.z + t * t * p1.z };
}

/**
 * Ruta como polilínea: desde la línea de parada, a través del cruce, hasta el final de la calle de salida.
 */
export function rutaVehiculo(desde: Direccion, maniobra: Maniobra, distanciaSalida = SALIDA, muestras = 24): V2[] {
  const h = rumboDesde(desde);
  const r = derechaDe(h);
  const h2 = rumboSalida(desde, maniobra);
  const r2 = derechaDe(h2);
  const inicio = posicionDeEspera(desde);
  const entrada = suma(escala(h, -BORDE_CRUCE), escala(r, MEDIO_CARRIL)); // borde del cruce, carril de llegada
  const salida = suma(escala(h2, BORDE_CRUCE), escala(r2, MEDIO_CARRIL)); // borde del cruce, carril de salida
  const fin = suma(escala(h2, distanciaSalida), escala(r2, MEDIO_CARRIL));

  const puntos: V2[] = [inicio, entrada];
  if (maniobra === "recto") {
    puntos.push(salida);
  } else {
    // Punto de control: intersección de la línea de llegada con la de salida.
    // Llegada: r·m + h·t ; salida: r2·m + h2·s. Como h ⟂ h2, basta proyectar.
    const control = suma(escala(r, MEDIO_CARRIL), escala(h, h.x * (r2.x * MEDIO_CARRIL) + h.z * (r2.z * MEDIO_CARRIL)));
    for (let i = 1; i <= muestras; i++) puntos.push(bezier(entrada, control, salida, i / muestras));
  }
  puntos.push(fin);
  return puntos;
}

/** Longitudes acumuladas de una polilínea. */
function acumuladas(puntos: readonly V2[]): number[] {
  const acc = [0];
  for (let i = 1; i < puntos.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(puntos[i].x - puntos[i - 1].x, puntos[i].z - puntos[i - 1].z));
  }
  return acc;
}

/**
 * Posición y ángulo (rotación Y de three.js, 0 = mirando a -z/norte) en la fracción t ∈ [0, 1] del recorrido.
 */
export function posicionEnRuta(puntos: readonly V2[], t: number): { x: number; z: number; angulo: number } {
  const acc = acumuladas(puntos);
  const total = acc[acc.length - 1];
  const d = Math.min(Math.max(t, 0), 1) * total;
  let i = 1;
  while (i < acc.length - 1 && acc[i] < d) i++;
  const a = puntos[i - 1];
  const b = puntos[i];
  const tramo = acc[i] - acc[i - 1] || 1;
  const f = (d - acc[i - 1]) / tramo;
  return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, angulo: anguloDeRumbo({ x: b.x - a.x, z: b.z - a.z }) };
}

/** Rotación Y para que el frente del carro (-z local) apunte al rumbo h. */
export function anguloDeRumbo(h: V2): number {
  return Math.atan2(-h.x, -h.z);
}

/* ───────── Recorridos medidos en metros (para la línea de tiempo) ───────── */

/** Metros que se dibujan antes de la línea de parada (permite vehículos que llegan desde atrás). */
export const ATRAS = 20;

export type Recorrido = { puntos: V2[]; largo: number; sParada: number; en: (s: number) => { x: number; z: number; angulo: number } };

/** Recorrido medido en metros sobre una polilínea. */
export function crearRecorrido(puntos: V2[], sParada: number): Recorrido {
  const acc = [0];
  for (let i = 1; i < puntos.length; i++) acc.push(acc[i - 1] + Math.hypot(puntos[i].x - puntos[i - 1].x, puntos[i].z - puntos[i - 1].z));
  const largo = acc[acc.length - 1];
  const en = (sRaw: number) => {
    const s = Math.min(Math.max(sRaw, 0), largo);
    let i = 1;
    while (i < acc.length - 1 && acc[i] < s) i++;
    const a = puntos[i - 1];
    const b = puntos[i];
    const f = (s - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
    return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, angulo: anguloDeRumbo({ x: b.x - a.x, z: b.z - a.z }) };
  };
  return { puntos, largo, sParada, en };
}

/** Desvío lateral de un vehículo que va recto: lateral en m (+ derecha) y metros de recorrido donde empieza a correrse. */
export type Desvio = { lateral: number; desdeS: number };

const LARGO_DESVIO = 4; // metros que tarda en correrse de lado
const LARGO_REGRESO = 6; // metros que tarda en volver al centro de su carril dentro del cruce

/** Recorrido de un vehículo en un cruce: empieza ATRAS metros antes de su línea de parada (sParada = ATRAS). */
export function recorridoCruce(desde: Direccion, maniobra: Maniobra, fin = SALIDA, desvio?: Desvio): Recorrido {
  const h = rumboDesde(desde);
  const espera = posicionDeEspera(desde);
  const inicio = { x: espera.x - h.x * ATRAS, z: espera.z - h.z * ATRAS };
  const ruta = rutaVehiculo(desde, maniobra, fin);
  if (!desvio || desvio.lateral === 0 || maniobra !== "recto") return crearRecorrido([inicio, ...ruta], ATRAS);

  // Tramo recto (inicio → salida del cruce) muestreado cada metro, con el desvío lateral aplicado.
  const r = derechaDe(h);
  const sEntrada = ATRAS + Math.hypot(ruta[1].x - espera.x, ruta[1].z - espera.z);
  const sSalida = sEntrada + 2 * BORDE_CRUCE;
  const hasta = Math.min(ATRAS, desvio.desdeS + LARGO_DESVIO);
  const peso = (s: number) => {
    const entra = hasta > desvio.desdeS ? Math.min(1, Math.max(0, (s - desvio.desdeS) / (hasta - desvio.desdeS))) : 1;
    const sale = Math.min(1, Math.max(0, (s - sEntrada) / LARGO_REGRESO));
    return entra * (1 - sale);
  };
  const muestras = [...new Set([...Array.from({ length: Math.floor(sSalida) + 1 }, (_, i) => i), ATRAS, sEntrada, sSalida])].sort((a, b) => a - b);
  const puntos: V2[] = muestras.map((s) => {
    const k = peso(s) * desvio.lateral;
    return { x: inicio.x + h.x * s + r.x * k, z: inicio.z + h.z * s + r.z * k };
  });
  puntos.push(ruta[ruta.length - 1]);
  // sParada = metros recorridos (sobre la polilínea) hasta la línea de parada.
  const iParada = muestras.indexOf(ATRAS);
  let sParada = 0;
  for (let i = 1; i <= iParada; i++) sParada += Math.hypot(puntos[i].x - puntos[i - 1].x, puntos[i].z - puntos[i - 1].z);
  return crearRecorrido(puntos, sParada);
}
