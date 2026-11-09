/**
 * Conversión entre el banco de preguntas (archivos src/content/temas/<tema>/preguntas.ts)
 * y filas de una hoja de cálculo. Lógica pura: sin archivos ni Excel, para poder testearla.
 */
import { Pregunta, type Pregunta as TPregunta } from "../../src/content/schema";

export const LETRAS = ["A", "B", "C", "D"] as const;

export type Fila = {
  tema: string;
  id: string;
  enunciado: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  correcta: string; // letra A–D
  explicacion: string;
  fuente: string;
  detalle: string;
  verificado: string;
};

export const COLUMNAS: (keyof Fila)[] = [
  "tema", "id", "enunciado", "opcion_a", "opcion_b", "opcion_c", "opcion_d",
  "correcta", "explicacion", "fuente", "detalle", "verificado",
];

export function filaDesdePregunta(tema: string, p: TPregunta): Fila {
  const op = (i: number) => p.opciones[i] ?? "";
  return {
    tema,
    id: p.id,
    enunciado: p.enunciado,
    opcion_a: op(0),
    opcion_b: op(1),
    opcion_c: op(2),
    opcion_d: op(3),
    correcta: LETRAS[p.correcta],
    explicacion: p.explicacion,
    fuente: p.ref.fuente,
    detalle: p.ref.detalle,
    verificado: p.verificado,
  };
}

const limpiar = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();

export type ErrorFila = { fila: number; id: string; mensaje: string };

/** Convierte filas a preguntas validadas por Zod, agrupadas por tema. `fila` cuenta desde 2 (la 1 es el encabezado). */
export function preguntasDesdeFilas(filas: Partial<Fila>[]): { porTema: Map<string, TPregunta[]>; errores: ErrorFila[] } {
  const porTema = new Map<string, TPregunta[]>();
  const errores: ErrorFila[] = [];
  const vistos = new Set<string>();
  filas.forEach((f, k) => {
    const n = k + 2;
    const id = limpiar(f.id);
    const tema = limpiar(f.tema);
    if (!id && !limpiar(f.enunciado)) return; // fila vacía
    if (!tema) return void errores.push({ fila: n, id, mensaje: "Falta el tema" });
    if (vistos.has(id)) return void errores.push({ fila: n, id, mensaje: "id repetido" });
    vistos.add(id);
    const opciones = [f.opcion_a, f.opcion_b, f.opcion_c, f.opcion_d].map(limpiar).filter(Boolean);
    const letra = limpiar(f.correcta).toUpperCase();
    const correcta = LETRAS.indexOf(letra as (typeof LETRAS)[number]);
    if (correcta < 0) return void errores.push({ fila: n, id, mensaje: `"correcta" debe ser A, B, C o D (vino "${letra}")` });
    const r = Pregunta.safeParse({
      id,
      enunciado: limpiar(f.enunciado),
      opciones,
      correcta,
      explicacion: limpiar(f.explicacion),
      ref: { fuente: limpiar(f.fuente), detalle: limpiar(f.detalle) },
      verificado: limpiar(f.verificado) || "pendiente",
    });
    if (!r.success) {
      return void errores.push({ fila: n, id, mensaje: r.error.issues.map((i) => `${i.path.join(".") || "pregunta"}: ${i.message}`).join("; ") });
    }
    porTema.set(tema, [...(porTema.get(tema) ?? []), r.data]);
  });
  return { porTema, errores };
}

export type Aviso = { id: string; tipo: string; detalle: string };

/** Revisiones de calidad que no impiden importar, pero conviene corregir. */
export function revisarCalidad(preguntas: { tema: string; p: TPregunta }[], fuentesValidas: Set<string>): Aviso[] {
  const avisos: Aviso[] = [];
  const enunciados = new Map<string, string>();
  for (const { p } of preguntas) {
    const largos = p.opciones.map((o) => o.length);
    const max = Math.max(...largos);
    if (largos[p.correcta] === max && largos.filter((l) => l === max).length === 1 && max > 1.4 * Math.min(...largos)) {
      avisos.push({ id: p.id, tipo: "Pista por largo", detalle: "La correcta es claramente la opción más larga; alargá algún distractor." });
    }
    p.opciones.forEach((o, i) => {
      if (i !== p.correcta && /\b(siempre|nunca|jamás)\b/i.test(o)) {
        avisos.push({ id: p.id, tipo: "Absolutos", detalle: `El distractor "${o}" usa un absoluto: delata que es incorrecto.` });
      }
    });
    if (p.opciones.some((o) => /todas las anteriores|ninguna de las anteriores/i.test(o))) {
      avisos.push({ id: p.id, tipo: "Opción comodín", detalle: "Evitá \"todas/ninguna de las anteriores\": las opciones se barajan." });
    }
    if (!fuentesValidas.has(p.ref.fuente)) avisos.push({ id: p.id, tipo: "Fuente desconocida", detalle: `"${p.ref.fuente}" no está en src/content/fuentes.ts` });
    if (p.verificado === "pendiente") avisos.push({ id: p.id, tipo: "Sin verificar", detalle: "No entra al simulacro hasta verificarla." });
    const clave = p.enunciado.toLowerCase().replace(/[^a-záéíóúñü0-9]+/g, " ").trim();
    if (enunciados.has(clave)) avisos.push({ id: p.id, tipo: "Duplicada", detalle: `Mismo enunciado que ${enunciados.get(clave)}` });
    else enunciados.set(clave, p.id);
  }
  // Distribución de la letra correcta en el texto original (no importa en la app porque se baraja, pero ayuda a detectar sesgos al redactar).
  return avisos;
}

/** Código TypeScript de un preguntas.ts generado. */
export function generarArchivoPreguntas(preguntas: TPregunta[], origen: string): string {
  return `import type { TemaEntrada } from "@/content/schema";

// Generado con \`npm run banco:importar\` desde ${origen}.
// Para cambiar preguntas: editá este archivo o la hoja de cálculo (no ambos a la vez). Ver skill xlsx.
export const preguntas: TemaEntrada["preguntas"] = ${JSON.stringify(preguntas, null, 2)};
`;
}
