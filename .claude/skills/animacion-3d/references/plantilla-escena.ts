/**
 * PLANTILLA de escena animada (datos, no código 3D). Copiar el objeto a
 * src/content/temas/<tema>/escenas.ts y enlazarlo desde una sección del resumen (`escenas: [id]`),
 * una pregunta (`escena: id`) o una flashcard (`escena: id`).
 * El componente src/components/three/escenas/EscenaAnimada.tsx la dibuja y la anima sola.
 */
import type { TemaEntrada } from "@/content/schema";

export const ejemplo: NonNullable<TemaEntrada["escenas"]>[number] = {
  tipo: "cruce", // o "rotonda"
  id: "mi-escena", // kebab-case, único en el tema
  titulo: "Título corto de la situación",
  situacion: "Qué se ve antes de animar (sin revelar la respuesta).",
  controles: { sur: "alto", este: "semaforo-verde" }, // alto | ceda | semaforo-rojo | semaforo-amarillo | semaforo-verde
  vehiculos: [
    // inicio: metros respecto de la línea de parada (negativo = más atrás). Entre -10 y 0 para que se vea.
    { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto", inicio: -5 },
    { id: "azul", nombre: "Carro azul", color: "#2f6fdb", desde: "este", maniobra: "izquierda" },
  ],
  peatones: [], // { id, paso: "este", sentido: "a-la-izquierda" }
  // Línea de tiempo (o `orden: ["azul", "rojo"]` para "cada uno pasa en este orden").
  pasos: [
    { accion: "mover", vehiculo: "rojo", hasta: "parada" },
    { accion: "pausa", segundos: 0.8 },
    { accion: "mover", vehiculo: "azul" },
    { accion: "mover", vehiculo: "rojo" },
  ],
  explicacion: "Qué muestra la animación y por qué, en una o dos frases.",
  ref: { fuente: "ley-9078", detalle: "Art. N inciso x)" },
};
