import type { TemaEntrada } from "@/content/schema";

const ley = (detalle: string) => ({ fuente: "ley-9078", detalle });

/**
 * Escenarios de la escena 3D. "desde" es el acceso por el que llega cada vehículo.
 * Se circula por la derecha. Norte está al fondo de la escena.
 */
export const escenarios: TemaEntrada["escenarios"] = [
  {
    id: "sin-senales",
    titulo: "Cruce sin señales",
    situacion: "Dos carros llegan al mismo tiempo a un cruce sin señales. Las dos calles son del mismo tipo.",
    controles: {},
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto" },
      { id: "azul", nombre: "Carro azul", color: "#2f6fdb", desde: "este", maniobra: "recto" },
    ],
    orden: ["azul", "rojo"],
    explicacion: "Sin señales y con vías del mismo tipo, el que llega por la izquierda cede al que tiene a su derecha. Para el carro rojo, el azul viene por la derecha: pasa primero el azul.",
    ref: ley("Art. 105 inciso e)"),
  },
  {
    id: "alto-vs-libre",
    titulo: "ALTO frente a una calle sin señal",
    situacion: "El carro rojo tiene una señal de ALTO. El carro azul circula por la calle transversal, que no tiene señal.",
    controles: { sur: "alto" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto" },
      { id: "azul", nombre: "Carro azul", color: "#2f6fdb", desde: "oeste", maniobra: "recto" },
    ],
    orden: ["azul", "rojo"],
    explicacion: "El rojo debe detenerse por completo en el ALTO y ceder a los vehículos que circulan por la vía con prioridad. Pasa primero el azul, aunque venga por la izquierda del rojo.",
    ref: ley("Art. 104 inciso f)"),
  },
  {
    id: "ceda-vs-alto",
    titulo: "CEDA frente a ALTO",
    situacion: "El carro rojo tiene ALTO y el carro verde tiene CEDA EL PASO. Llegan al mismo tiempo.",
    controles: { sur: "alto", este: "ceda" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto" },
      { id: "verde", nombre: "Carro verde", color: "#2e9e5b", desde: "este", maniobra: "recto" },
    ],
    orden: ["verde", "rojo"],
    explicacion: "Los vehículos regulados por CEDA tienen prioridad sobre los regulados por ALTO. Pasa primero el verde.",
    ref: ley("Art. 105 inciso g)"),
  },
  {
    id: "ambulancia",
    titulo: "Llega una ambulancia",
    situacion: "Cruce sin señales. El carro rojo tiene a la ambulancia a su izquierda. La ambulancia lleva luces y sirena encendidas y atiende una emergencia.",
    controles: {},
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto" },
      { id: "ambulancia", nombre: "Ambulancia", color: "#f2f2f2", desde: "oeste", maniobra: "recto", emergencia: true },
    ],
    orden: ["ambulancia", "rojo"],
    explicacion: "Normalmente el rojo pasaría primero, porque la ambulancia viene por su izquierda. Pero un vehículo de emergencia identificado con señales visuales y sonoras, y atendiendo una emergencia, tiene prioridad de paso.",
    ref: ley("Art. 105 inciso c)"),
  },
  {
    id: "derecha-en-rojo",
    titulo: "Giro a la derecha con luz roja",
    situacion: "El carro rojo tiene luz roja y quiere girar a la derecha. El carro azul tiene luz verde y sigue recto hacia el mismo carril. No hay señal que prohíba el giro.",
    controles: { sur: "semaforo-rojo", oeste: "semaforo-verde" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "derecha" },
      { id: "azul", nombre: "Carro azul", color: "#2f6fdb", desde: "oeste", maniobra: "recto" },
    ],
    orden: ["azul", "rojo"],
    explicacion: "Se puede girar a la derecha en rojo como si fuera un ALTO, solo si el tránsito de la vía con luz verde lo permite. El rojo se detiene, deja pasar al azul y luego gira.",
    ref: ley("Art. 104 incisos a) y b)"),
  },
  {
    id: "giro-izquierda-principal",
    titulo: "Giro a la izquierda desde la vía principal",
    situacion: "La vía este–oeste es la principal y no tiene señal. Los accesos norte y sur tienen ALTO. El azul gira a la izquierda desde la principal; el rojo sigue recto desde el sur y el amarillo gira a la izquierda desde el norte.",
    controles: { norte: "alto", sur: "alto" },
    tipoVia: { este: "primaria", oeste: "primaria", norte: "secundaria", sur: "secundaria" },
    vehiculos: [
      { id: "azul", nombre: "Carro azul", color: "#2f6fdb", desde: "oeste", maniobra: "izquierda" },
      { id: "rojo", nombre: "Carro rojo", color: "#d93838", desde: "sur", maniobra: "recto" },
      { id: "amarillo", nombre: "Carro amarillo", color: "#e8b923", desde: "norte", maniobra: "izquierda" },
    ],
    orden: ["azul", "rojo", "amarillo"],
    explicacion: "Quien gira a la izquierda desde la vía principal tiene prioridad sobre los accesos secundarios con ALTO (pasa el azul). Entre los accesos secundarios, el que sigue recto tiene prioridad sobre el que gira a la izquierda (el rojo antes que el amarillo).",
    ref: ley("Art. 105 incisos h) e i)"),
  },
];
