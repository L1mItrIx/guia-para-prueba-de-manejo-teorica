/**
 * Repetición espaciada (sistema Leitner) con 5 cajas.
 * Acertar sube una caja; fallar regresa a la caja 1.
 * Cada caja se repasa después de cierta cantidad de días.
 */
export const DIAS_POR_CAJA = [0, 1, 3, 7, 14] as const;
export const CAJA_MAX = DIAS_POR_CAJA.length; // 5

export type EstadoTarjeta = { caja: number; proxima: number /* epoch ms */ };

const DIA = 24 * 60 * 60 * 1000;

export function responderTarjeta(
  estado: EstadoTarjeta | undefined,
  acerto: boolean,
  ahora: number,
): EstadoTarjeta {
  const actual = estado?.caja ?? 1;
  const caja = acerto ? Math.min(actual + 1, CAJA_MAX) : 1;
  return { caja, proxima: ahora + DIAS_POR_CAJA[caja - 1] * DIA };
}

/** ¿Toca repasar? Las tarjetas nunca vistas siempre tocan. */
export function tocaRepasar(estado: EstadoTarjeta | undefined, ahora: number): boolean {
  return !estado || estado.proxima <= ahora;
}

/** Ordena: primero las que tocan (caja más baja primero), luego el resto. */
export function ordenarParaRepaso<T extends { id: string }>(
  tarjetas: readonly T[],
  estados: Readonly<Record<string, EstadoTarjeta>>,
  ahora: number,
): T[] {
  return [...tarjetas].sort((a, b) => {
    const ea = estados[a.id];
    const eb = estados[b.id];
    const ta = tocaRepasar(ea, ahora) ? 0 : 1;
    const tb = tocaRepasar(eb, ahora) ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return (ea?.caja ?? 0) - (eb?.caja ?? 0);
  });
}

/** Porcentaje de dominio: tarjetas en la caja 4 o 5. */
export function dominio(ids: readonly string[], estados: Readonly<Record<string, EstadoTarjeta>>): number {
  if (ids.length === 0) return 0;
  const dominadas = ids.filter((id) => (estados[id]?.caja ?? 0) >= 4).length;
  return Math.round((dominadas / ids.length) * 100);
}
