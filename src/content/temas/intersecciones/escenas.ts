import type { TemaEntrada } from "@/content/schema";

const ley = (detalle: string) => ({ fuente: "ley-9078", detalle });

const ROJO = "#d93838";
const AZUL = "#2f6fdb";
const VERDE = "#2e9e5b";
const AMARILLO = "#e8b923";
const GRIS = "#8d939e";
const BLANCO = "#f2f2f2";

/**
 * Escenas animadas del tema. Se usan desde el resumen, el quiz y las flashcards (campo `escena`/`escenas`).
 * Norte está al fondo de la vista; se circula por la derecha. `inicio`: metros respecto de la línea de parada.
 */
export const escenas: TemaEntrada["escenas"] = [
  {
    tipo: "cruce",
    id: "sin-senales",
    titulo: "Cruce sin señales",
    situacion: "Dos carros llegan al mismo tiempo a un cruce sin señales. Las dos calles son del mismo tipo.",
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto" },
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "este", maniobra: "recto" },
    ],
    orden: ["azul", "rojo"],
    explicacion: "Para el carro rojo, el azul viene por la derecha. Sin señales y con vías del mismo tipo, cede el que tiene al otro a su derecha: pasa primero el azul.",
    ref: ley("Art. 105 inciso e)"),
  },
  {
    tipo: "cruce",
    id: "primaria-secundaria",
    titulo: "Vía primaria y vía secundaria",
    situacion: "El carro rojo llega por una vía secundaria a una primaria (la calle este–oeste). El azul circula por la primaria y viene por la izquierda del rojo.",
    tipoVia: { este: "primaria", oeste: "primaria", norte: "secundaria", sur: "secundaria" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto" },
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "oeste", maniobra: "recto", inicio: -6 },
    ],
    orden: ["azul", "rojo"],
    explicacion: "La vía primaria tiene prioridad sobre la secundaria, aunque el carro de la primaria venga por la izquierda. La regla de la derecha solo se usa entre vías del mismo tipo.",
    ref: ley("Art. 105 incisos d) y e)"),
  },
  {
    tipo: "cruce",
    id: "alto-vs-libre",
    titulo: "ALTO frente a una calle sin señal",
    situacion: "El carro rojo tiene una señal de ALTO. El azul circula por la calle transversal, que no tiene señal.",
    controles: { sur: "alto" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -5 },
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "oeste", maniobra: "recto", inicio: -10 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "pausa", segundos: 0.8 },
      { accion: "mover", vehiculo: "azul" },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "El rojo se detiene por completo en la línea de parada y cede a quien circula por la vía con prioridad. Pasa primero el azul, aunque venga por la izquierda del rojo.",
    ref: ley("Art. 104 inciso f)"),
  },
  {
    tipo: "cruce",
    id: "ceda-vs-alto",
    titulo: "CEDA frente a ALTO",
    situacion: "El carro rojo tiene ALTO y el verde tiene CEDA EL PASO. Llegan casi al mismo tiempo.",
    controles: { sur: "alto", este: "ceda" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -5 },
      { id: "verde", nombre: "Carro verde", color: VERDE, desde: "este", maniobra: "recto", inicio: -10 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "mover", vehiculo: "verde" },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "Los vehículos regulados por CEDA tienen prioridad sobre los regulados por ALTO. El verde reduce, observa y pasa; el rojo espera detenido en su ALTO.",
    ref: ley("Art. 104 incisos f) y g); art. 105 inciso g)"),
  },
  {
    tipo: "cruce",
    id: "luz-amarilla",
    titulo: "Cambio a luz amarilla",
    situacion: "El semáforo cambia a amarillo. El carro rojo ya está encima de la línea de parada; el azul todavía está lejos.",
    controles: { sur: "semaforo-amarillo", oeste: "semaforo-rojo" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: 1 },
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "sur", maniobra: "recto", inicio: -10 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo" },
      { accion: "mover", vehiculo: "azul", hasta: "parada" },
      { accion: "semaforo", acceso: "sur", luz: "rojo" },
    ],
    explicacion: "Con luz amarilla, quien está muy cerca del cruce lo despeja sin exceder el límite (rojo) y quien todavía está lejos desacelera y se detiene (azul).",
    ref: ley("Art. 104 inciso e)"),
  },
  {
    tipo: "cruce",
    id: "derecha-en-rojo",
    titulo: "Giro a la derecha con luz roja",
    situacion: "El carro rojo tiene luz roja y quiere girar a la derecha. El azul tiene luz verde y sigue recto hacia el mismo carril. No hay señal que prohíba el giro.",
    controles: { sur: "semaforo-rojo", oeste: "semaforo-verde" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "derecha" },
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "oeste", maniobra: "recto", inicio: -12 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "azul" },
      { accion: "pausa", segundos: 0.6 },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "Con rojo se puede girar a la derecha como si fuera un ALTO: detenerse y girar solo si el tránsito con luz verde lo permite. El rojo deja pasar al azul y luego gira.",
    ref: ley("Art. 104 incisos a) y b)"),
  },
  {
    tipo: "cruce",
    id: "rojo-de-noche",
    titulo: "Luz roja entre las 22:00 y las 5:00",
    situacion: "Son las 11:30 p. m. El carro rojo tiene luz roja, la calle transversal está vacía y no hay señal que lo prohíba.",
    noche: true,
    controles: { sur: "semaforo-rojo", oeste: "semaforo-verde" },
    vehiculos: [{ id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -5 }],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "pausa", segundos: 1.4 },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "Después de las 22:00 y antes de las 5:00, el rojo funciona como un ALTO si el tránsito con luz verde lo permite: detenerse por completo y luego continuar con seguridad.",
    ref: ley("Art. 104 inciso c)"),
  },
  {
    tipo: "cruce",
    id: "peatones-giro",
    titulo: "Peatones al girar",
    situacion: "El carro rojo tiene luz verde y va a girar a la derecha. En el paso peatonal de la calle a la que entra hay peatones cruzando.",
    controles: { sur: "semaforo-verde", este: "semaforo-rojo" },
    vehiculos: [{ id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "derecha", inicio: -5 }],
    peatones: [
      { id: "p1", paso: "este", sentido: "a-la-izquierda", color: "#f28c28" },
      { id: "p2", paso: "este", sentido: "a-la-derecha", color: "#7b5cd6" },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "peatones" },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "Aun con luz verde, hay que ceder el paso a los peatones y ciclistas que están sobre la calzada. El rojo espera a que terminen de cruzar y después gira.",
    ref: ley("Art. 104 inciso d)"),
  },
  {
    tipo: "cruce",
    id: "cruce-bloqueado",
    titulo: "Luz verde con el cruce congestionado",
    situacion: "El carro rojo tiene luz verde, pero al otro lado del cruce hay una fila detenida y no queda espacio.",
    controles: { sur: "semaforo-verde" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -7, fin: 13 },
      { id: "gris1", nombre: "Carro gris", color: GRIS, desde: "sur", maniobra: "recto", inicio: 15, fin: 19, etiqueta: false },
      { id: "gris2", nombre: "Carro gris", color: GRIS, desde: "sur", maniobra: "recto", inicio: 21, fin: 26, etiqueta: false },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "pausa", segundos: 2 },
      { accion: "mover", vehiculo: "gris2" },
      { accion: "mover", vehiculo: "gris1" },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "La luz verde no autoriza a quedar atravesado. El rojo espera antes de la intersección y entra solo cuando la fila avanza y hay espacio para salir.",
    ref: ley("Art. 128"),
  },
  {
    tipo: "cruce",
    id: "ambulancia",
    titulo: "Ambulancia en emergencia",
    situacion: "Una ambulancia con luces y sirena atiende una emergencia y tiene luz roja. El carro rojo tiene luz verde.",
    controles: { oeste: "semaforo-rojo", sur: "semaforo-verde" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -4 },
      { id: "ambulancia", nombre: "Ambulancia", color: BLANCO, desde: "oeste", maniobra: "recto", emergencia: true, inicio: -14 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "ambulancia", hasta: "parada" },
      { accion: "pausa", segundos: 0.6 },
      { accion: "mover", vehiculo: "ambulancia" },
      { accion: "mover", vehiculo: "rojo" },
    ],
    explicacion: "Un vehículo de emergencia identificado con luces y sirena, atendiendo una emergencia, tiene prioridad. Puede continuar con luz roja, pero solo después de verificar que el cruce está libre; el rojo le cede el paso.",
    ref: ley("Art. 104 inciso h) y art. 105 inciso c)"),
  },
  {
    tipo: "cruce",
    id: "ambulancia-mismo-carril",
    titulo: "Ambulancia en el mismo carril",
    situacion: "El carro rojo espera la luz roja en su carril. Por detrás, en el mismo carril, llega una ambulancia con luces y sirena que atiende una emergencia.",
    controles: { sur: "semaforo-rojo" },
    vehiculos: [
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto", inicio: -3, desvio: 1.1, fin: 14 },
      { id: "ambulancia", nombre: "Ambulancia", color: BLANCO, desde: "sur", maniobra: "recto", emergencia: true, inicio: -10, desvio: -1.3, fin: 22 },
    ],
    pasos: [
      { accion: "mover", vehiculo: "rojo", hasta: "parada" },
      { accion: "pausa", segundos: 0.6 },
      { accion: "mover", vehiculo: "ambulancia" },
    ],
    explicacion: "La ambulancia con luces y sirena, atendiendo una emergencia, tiene prioridad de paso sobre los demás vehículos, también sobre el que va delante en su mismo carril. El rojo le cede el paso: se corre a la derecha y espera, sin obstruirla, aunque siga con luz roja. La ambulancia cruza solo después de verificar que el cruce está libre.",
    ref: ley("Art. 104 inciso h) y art. 105 inciso c)"),
  },
  {
    tipo: "cruce",
    id: "giro-izquierda-principal",
    titulo: "Giro a la izquierda desde la vía principal",
    situacion: "La vía este–oeste es la principal y no tiene señal. Los accesos norte y sur tienen ALTO. El azul gira a la izquierda desde la principal; el rojo sigue recto desde el sur y el amarillo gira a la izquierda desde el norte.",
    controles: { norte: "alto", sur: "alto" },
    tipoVia: { este: "primaria", oeste: "primaria", norte: "secundaria", sur: "secundaria" },
    vehiculos: [
      { id: "azul", nombre: "Carro azul", color: AZUL, desde: "oeste", maniobra: "izquierda" },
      { id: "rojo", nombre: "Carro rojo", color: ROJO, desde: "sur", maniobra: "recto" },
      { id: "amarillo", nombre: "Carro amarillo", color: AMARILLO, desde: "norte", maniobra: "izquierda" },
    ],
    orden: ["azul", "rojo", "amarillo"],
    explicacion: "Quien gira a la izquierda desde la vía principal pasa antes que los accesos secundarios con ALTO (azul). Entre los accesos secundarios, el que sigue recto pasa antes que el que gira a la izquierda (rojo antes que amarillo).",
    ref: ley("Art. 105 incisos h) e i)"),
  },
  {
    tipo: "rotonda",
    id: "rotonda",
    titulo: "Rotonda: ceder y elegir carril",
    situacion: "El carro azul ya circula dentro de la rotonda. El rojo entra por el sur para tomar la 3.ª salida y el verde entra por el este para tomar la 1.ª salida.",
    vehiculos: [
      { id: "azul", nombre: "Carro azul", color: AZUL, dentroDesde: 196, salida: "este", carril: "externo" },
      { id: "rojo", nombre: "Carro rojo", color: ROJO, entrada: "sur", salida: "oeste", carril: "interno" },
      { id: "verde", nombre: "Carro verde", color: VERDE, entrada: "este", salida: "norte", carril: "externo" },
    ],
    orden: ["azul", "rojo", "verde"],
    explicacion: "El que entra cede al que ya circula dentro (el rojo espera al azul). Para la 3.ª salida se usa el carril interno (rojo) y para la 1.ª, el externo derecho (verde). Dentro no se adelanta ni se cambia de carril, y el máximo es 30 km/h.",
    ref: ley("Art. 106"),
  },
];
