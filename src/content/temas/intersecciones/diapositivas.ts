import type { TemaEntrada } from "@/content/schema";

export const diapositivas: TemaEntrada["diapositivas"] = [
  { id: "d-01", titulo: "Intersecciones y derecho de vía", puntos: ["Quién pasa primero: ALTO, CEDA, semáforo, cruces sin señales y rotondas", "Qué hacer con emergencias y peatones", "Base: Ley de Tránsito N.º 9078, arts. 104 a 106 y 128"] },
  { id: "d-02", titulo: "Las prioridades de la ley", visual: "prioridad", puntos: ["Tren (vehículos sobre rieles)", "Inspector de tránsito", "Emergencias con luces y sirena", "Vía primaria > secundaria > terciaria"] },
  { id: "d-03", titulo: "ALTO", visual: "alto", puntos: ["Detención total en la línea de parada", "Aunque haya visibilidad y no venga nadie", "Luego ceder a peatones y a la vía prioritaria", "Multa 2026: ¢245 195,06"] },
  { id: "d-04", titulo: "CEDA EL PASO", visual: "ceda", puntos: ["Bajar la velocidad y observar", "Detenerse solo si viene alguien que ponga en peligro el cruce", "CEDA tiene prioridad sobre ALTO"] },
  { id: "d-05", titulo: "Sin señales", visual: "prioridad", puntos: ["Vías del mismo tipo, sin ninguna señal", "Cede el que llega por la izquierda", "Pasa el que está a la derecha"] },
  { id: "d-06", titulo: "Semáforo", visual: "semaforo", puntos: ["Rojo: detenerse en la línea de parada", "Amarillo / verde intermitente: prepararse para detenerse", "Derecha en rojo: como un ALTO, salvo señal que lo prohíba", "22:00 a 5:00: el rojo funciona como un ALTO, salvo señal"] },
  { id: "d-07", titulo: "Rotondas", visual: "rotonda", puntos: ["Máximo 30 km/h", "Cede el que entra", "Prohibido adelantar y cambiar de carril adentro", "1.ª salida: carril derecho · 3.ª o más: carril interno"] },
  { id: "d-08", titulo: "Emergencias y peatones", visual: "emergencia", puntos: ["Ambulancia con alarmas: tiene prioridad", "Ella también debe verificar antes de cruzar en rojo", "Con verde, derecha en rojo o ALTO: ceder al peatón en la calzada"] },
  { id: "d-09", titulo: "No bloquear el cruce", puntos: ["Verde no autoriza quedar atravesado", "No adelantar en intersecciones", "Estacionar: 10 m (urbana) · 25 m (no urbana)", "Multa por obstruir: ¢60 679,58"] },
];
