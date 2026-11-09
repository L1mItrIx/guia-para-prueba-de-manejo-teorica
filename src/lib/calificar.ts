export type Resultado = {
  total: number;
  correctas: number;
  /** Nota de 0 a 100, redondeada a un decimal. */
  nota: number;
  aprobado: boolean;
};

/** respuestas[i] es el índice elegido (o null si no se respondió); correctas[i] el índice correcto. */
export function calificar(
  respuestas: readonly (number | null)[],
  correctas: readonly number[],
  notaMinima: number,
): Resultado {
  if (respuestas.length !== correctas.length) {
    throw new Error("Las respuestas y las correctas deben tener la misma cantidad");
  }
  const total = correctas.length;
  const buenas = respuestas.filter((r, i) => r !== null && r === correctas[i]).length;
  const nota = total === 0 ? 0 : Math.round((buenas / total) * 1000) / 10;
  return { total, correctas: buenas, nota, aprobado: nota >= notaMinima };
}

/** Formatea segundos como mm:ss. */
export function formatoTiempo(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
