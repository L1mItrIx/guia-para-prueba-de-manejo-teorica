import type { Escena } from "@/content/schema";
import { numeroDeSalida } from "@/lib/rutas-rotonda";

const CONTROL: Record<string, string> = {
  alto: "ALTO",
  ceda: "CEDA EL PASO",
  "semaforo-rojo": "luz roja",
  "semaforo-amarillo": "luz amarilla",
  "semaforo-verde": "luz verde",
};
const MANIOBRA = { recto: "sigue recto", derecha: "gira a la derecha", izquierda: "gira a la izquierda" } as const;

/** Descripción en texto de la escena (lectores de pantalla y navegadores sin WebGL). */
export function describirEscena(e: Escena): string[] {
  if (e.tipo === "rotonda") {
    return e.vehiculos.map((v) =>
      v.entrada
        ? `${v.nombre}: entra por el ${v.entrada} hacia la ${numeroDeSalida(v.entrada, v.salida)}.ª salida (${v.salida}), por el carril ${v.carril}.`
        : `${v.nombre}: ya circula dentro de la rotonda y sale por el ${v.salida}.`,
    );
  }
  const lineas = e.vehiculos
    .filter((v) => v.etiqueta)
    .map((v) => {
      const c = e.controles[v.desde];
      return `${v.nombre}: llega por el ${v.desde} y ${MANIOBRA[v.maniobra]}${c && c !== "ninguno" ? `; tiene ${CONTROL[c]}` : "; sin señal"}${v.emergencia ? "; con luces y sirena" : ""}.`;
    });
  if (e.peatones.length) lineas.push(`Hay ${e.peatones.length} peatones en el paso peatonal del brazo ${e.peatones[0].paso}.`);
  return lineas;
}
