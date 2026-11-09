/** Generador pseudoaleatorio con semilla (mulberry32) para que los tests sean reproducibles. */
export function crearAleatorio(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates. No modifica el arreglo original. */
export function barajar<T>(items: readonly T[], aleatorio: () => number = Math.random): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Baraja las opciones de una pregunta y devuelve el nuevo índice de la correcta. */
export function barajarOpciones(
  opciones: readonly string[],
  correcta: number,
  aleatorio: () => number = Math.random,
): { opciones: string[]; correcta: number } {
  const indices = barajar(
    opciones.map((_, i) => i),
    aleatorio,
  );
  return { opciones: indices.map((i) => opciones[i]), correcta: indices.indexOf(correcta) };
}
