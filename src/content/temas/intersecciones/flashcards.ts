import type { TemaEntrada } from "@/content/schema";

const ley = (detalle: string) => ({ fuente: "ley-9078", detalle });
const multas = (detalle: string) => ({ fuente: "multas-2026", detalle });

export const flashcards: TemaEntrada["flashcards"] = [
  { id: "fc-01", frente: "Señal de ALTO", reverso: "Detención completa en la línea de parada, aunque no venga nadie. Luego ceder a peatones y a la vía con prioridad.", ref: ley("Art. 104 f)"), escena: "alto-vs-libre" },
  { id: "fc-02", frente: "Señal de CEDA EL PASO", reverso: "Bajar la velocidad y observar. Detenerse por completo solo si se acerca un vehículo que ponga en peligro el cruce.", ref: ley("Art. 104 g)"), escena: "ceda-vs-alto" },
  { id: "fc-03", frente: "Cruce sin señales, vías del mismo tipo", reverso: "El que llega por la izquierda cede el paso al que tiene a su derecha.", ref: ley("Art. 105 e)"), escena: "sin-senales" },
  { id: "fc-04", frente: "Vía primaria vs. secundaria", reverso: "Tiene prioridad la primaria sobre la secundaria, y la secundaria sobre la terciaria.", ref: ley("Art. 105 d)"), escena: "primaria-secundaria" },
  { id: "fc-05", frente: "CEDA vs. ALTO", reverso: "Tiene prioridad el que tiene CEDA. El del ALTO espera.", ref: ley("Art. 105 g)"), escena: "ceda-vs-alto" },
  { id: "fc-06", frente: "Semáforo vs. ALTO", reverso: "Tienen prioridad los vehículos regulados por semáforo sobre los regulados por ALTO.", ref: ley("Art. 105 f)") },
  { id: "fc-07", frente: "Derecha con luz roja", reverso: "Permitido como si fuera un ALTO, si el tránsito con verde lo permite y no hay señal que lo prohíba. Ceder a peatones y ciclistas.", ref: ley("Art. 104 b) y d)"), escena: "derecha-en-rojo" },
  { id: "fc-08", frente: "Luz roja entre las 22:00 y las 5:00", reverso: "Se puede continuar como si fuera un ALTO, si el tránsito con verde lo permite y no hay señal que lo prohíba.", ref: ley("Art. 104 c)"), escena: "rojo-de-noche" },
  { id: "fc-09", frente: "Amarillo o verde intermitente", reverso: "Desacelerar para detenerse si está lejos; si ya está muy cerca, salir de la intersección sin exceder el límite.", ref: ley("Art. 104 e)"), escena: "luz-amarilla" },
  { id: "fc-10", frente: "Rotonda: ¿quién pasa?", reverso: "El que ya circula dentro. El que entra cede el paso. Máximo 30 km/h.", ref: ley("Art. 106 a) y b)"), escena: "rotonda" },
  { id: "fc-11", frente: "Rotonda: carril para salir", reverso: "1.ª salida: carril externo derecho. 2.ª: carriles internos. 3.ª o más: carril interno o extremo izquierdo.", ref: ley("Art. 106 f), g), h)"), escena: "rotonda" },
  { id: "fc-12", frente: "Rotonda: prohibido…", reverso: "Adelantar, y cambiar de carril excepto al entrar o salir.", ref: ley("Art. 106 d) y e)") },
  { id: "fc-13", frente: "Luz verde pero hay presa", reverso: "No entrar a la intersección si va a quedar obstruyéndola. Prohibido detenerse en medio.", ref: ley("Art. 128"), escena: "cruce-bloqueado" },
  { id: "fc-14", frente: "Estacionar cerca de una intersección", reverso: "Mínimo 10 m en vía urbana, 25 m en vía no urbana. 5 m de un paso peatonal o hidrante.", ref: ley("Art. 110 d)") },
  { id: "fc-15", frente: "Giro izquierda desde la vía principal (accesos secundarios con ALTO)", reverso: "Tiene prioridad sobre los vehículos de los accesos con ALTO. En los accesos secundarios, recto pasa antes que izquierda.", ref: ley("Art. 105 h) e i)"), escena: "giro-izquierda-principal" },
  { id: "fc-16", frente: "Multas 2026 en intersecciones", reverso: "ALTO o luz roja: ¢245 195,06 · Prioridad de paso o rotonda: ¢60 679,58 · No ceder a peatones: ¢26 005,53.", ref: multas("Arts. 144 d) y e), 146 c), d) y r), 147 j)") },
];
