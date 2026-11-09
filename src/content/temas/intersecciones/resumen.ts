import type { TemaEntrada } from "@/content/schema";

const ley = (detalle: string) => ({ fuente: "ley-9078", detalle });

export const resumen: TemaEntrada["resumen"] = [
  {
    id: "prioridad",
    titulo: "¿Quién tiene prioridad de paso?",
    parrafos: [
      "La Ley de Tránsito enumera quién tiene prioridad de paso respecto de los demás vehículos. Primero menciona los vehículos que circulan sobre rieles (tren), las indicaciones de un inspector de tránsito y los vehículos de emergencia autorizados que usen señales visuales y sonoras mientras atienden una emergencia.",
      "Después vienen las reglas según el tipo de vía y de señal: quien circula por una carretera primaria tiene prioridad sobre quien viene de una secundaria, y la secundaria sobre la terciaria. Los vehículos regulados por semáforo tienen prioridad sobre los regulados por ALTO, y los regulados por CEDA también tienen prioridad sobre los que tienen ALTO.",
      "Si no hay ninguna señal y las dos vías son del mismo tipo, se aplica la regla supletoria: el conductor que llega por la izquierda debe ceder el paso al vehículo que se encuentra a su derecha.",
    ],
    puntosClave: [
      "Prioridad: tren, inspector de tránsito y emergencias con luces y sirena",
      "Vía primaria > secundaria > terciaria",
      "Semáforo > ALTO · CEDA > ALTO",
      "Sin señales y vías iguales: cede el que tiene al otro a su derecha",
    ],
    multa: "Irrespetar las prioridades de paso: multa categoría D, ¢60 679,58 (2026).",
    ref: ley("Art. 105 y art. 146 inciso c)"),
  },
  {
    id: "alto",
    titulo: "Señal de ALTO",
    parrafos: [
      "Ante un ALTO hay que detener el vehículo por completo en la línea de parada, aun cuando haya buena visibilidad y no venga nadie por la vía con prioridad. Si no hay línea de parada, se detiene en el punto más cercano a la vía que va a cruzar.",
      "Después de detenerse, debe ceder el paso a todos los peatones que estén sobre la calzada y a los vehículos que, por su velocidad o cercanía, circulen por las vías con prioridad.",
    ],
    puntosClave: ["Alto = detención total, siempre", "Luego ceder a peatones y a la vía prioritaria"],
    multa: "Irrespetar el ALTO en una intersección: multa categoría B, ¢245 195,06 (2026).",
    ref: ley("Art. 104 inciso f) y art. 144 inciso d)"),
  },
  {
    id: "ceda",
    titulo: "Señal de CEDA EL PASO",
    parrafos: [
      "En una intersección con CEDA, el conductor debe disminuir la velocidad de forma que pueda observar el tránsito que se aproxima por las otras vías.",
      "Si se acerca un vehículo que por su cercanía o rapidez puede poner en peligro la seguridad, debe detenerse por completo. Si no viene nadie, puede continuar sin detenerse.",
    ],
    puntosClave: ["Ceda = bajar la velocidad y observar", "Detenerse solo si viene alguien que ponga en peligro el cruce"],
    ref: ley("Art. 104 inciso g)"),
  },
  {
    id: "semaforo",
    titulo: "Semáforos",
    parrafos: [
      "Con luz roja hay que detenerse por completo en la línea de parada; si no existe, cerca de la vía que se va a cruzar pero sin obstruir el tránsito transversal.",
      "La luz amarilla y la luz verde intermitente indican que debe desacelerar para detenerse si todavía está lejos del cruce; si ya está muy cerca, debe salir de la intersección sin exceder el límite de velocidad.",
      "Giro a la derecha con luz roja: está permitido si el tránsito de la vía con luz verde lo permite, haciéndolo como si fuera un ALTO (detenerse y ceder). Está prohibido donde Ingeniería de Tránsito haya colocado una señal que lo prohíba.",
      "Entre las 22:00 y las 5:00, con luz roja, se puede continuar como si fuera un ALTO si el tránsito de la vía con luz verde lo permite, salvo que una señal fija lo prohíba.",
      "Con luz verde, o al girar a la derecha en rojo, siempre se debe ceder el paso a los peatones y ciclistas que estén sobre la calzada.",
    ],
    puntosClave: [
      "Rojo = detenerse en la línea de parada",
      "Amarillo / verde intermitente = prepararse para detenerse",
      "Derecha en rojo = como un ALTO, salvo señal que lo prohíba",
      "De 22:00 a 5:00 el rojo funciona como un ALTO, salvo señal que lo prohíba",
    ],
    multa: "Irrespetar la luz roja (fuera de las excepciones del art. 104): multa categoría B, ¢245 195,06 (2026).",
    ref: ley("Art. 104 incisos a) a e) y art. 144 inciso e)"),
  },
  {
    id: "giros-izquierda",
    titulo: "Giros a la izquierda en intersecciones con ALTO",
    parrafos: [
      "En un cruce donde la vía principal no tiene señal y los dos accesos secundarios tienen ALTO, quien gira a la izquierda desde la vía principal tiene prioridad sobre los vehículos detenidos en los accesos secundarios.",
      "Entre los vehículos de los accesos secundarios, los que siguen recto tienen prioridad sobre los que giran a la izquierda desde esos mismos accesos.",
      "El giro a la izquierda y la vuelta en U están permitidos, excepto donde el señalamiento horizontal o vertical lo prohíba.",
    ],
    puntosClave: ["Desde la vía principal: el giro a la izquierda pasa antes que los accesos con ALTO", "En los accesos secundarios: recto antes que izquierda"],
    ref: ley("Art. 105 incisos h) e i), art. 121"),
  },
  {
    id: "rotondas",
    titulo: "Rotondas",
    parrafos: [
      "Dentro de una rotonda la velocidad máxima es de 30 km/h. Quien va a entrar debe ceder el paso al que ya circula dentro, y entrar solo cuando la maniobra sea segura.",
      "No se permite cambiar de carril dentro de la rotonda, excepto al entrar y salir, ni adelantar a otro vehículo.",
      "Para salir por la primera salida, ubíquese en el carril externo derecho. Para la segunda salida puede usar los carriles internos. Para la tercera salida o posteriores, use el carril interno o extremo izquierdo.",
    ],
    puntosClave: ["Máximo 30 km/h", "Cede el que entra al que circula dentro", "Sin cambios de carril ni adelantamientos adentro", "1.ª salida: carril derecho · 3.ª o más: carril interno"],
    multa: "Incumplir las reglas de las rotondas: multa categoría D, ¢60 679,58 (2026).",
    ref: ley("Art. 106 y art. 146 inciso d)"),
  },
  {
    id: "emergencias",
    titulo: "Vehículos de emergencia",
    parrafos: [
      "Los vehículos de emergencia que atienden un incidente con sus dispositivos de alarma encendidos pueden continuar en una intersección con luz roja o con ALTO, pero solo después de verificar que no hay vehículos circulando por las vías que se cruzan.",
      "Tienen prioridad de paso sobre los demás vehículos siempre que se identifiquen con señales visuales y sonoras y estén atendiendo una emergencia.",
    ],
    puntosClave: ["Con luces y sirena en emergencia: tienen prioridad", "Sin alarmas activadas: son un vehículo más"],
    ref: ley("Art. 104 inciso h) y art. 105 inciso c)"),
  },
  {
    id: "no-bloquear",
    titulo: "No bloquear la intersección y no adelantar en ella",
    parrafos: [
      "Está prohibido entrar a una intersección, aun con luz verde o derecho de vía, si por la congestión el vehículo va a quedar obstruyendo la circulación. También está prohibido detenerse sobre el señalamiento horizontal o en medio de la intersección.",
      "Está prohibido adelantar en intersecciones y cruces de ferrocarril, y adelantar a un vehículo que se detuvo frente a un paso peatonal.",
      "No se puede estacionar a menos de 10 m de una intersección en vías urbanas, a menos de 25 m en vías no urbanas, ni a menos de 5 m de un paso peatonal.",
    ],
    puntosClave: ["Verde no da permiso para quedar atravesado", "Nunca adelantar en una intersección", "Estacionar: 10 m (urbana) · 25 m (no urbana) · 5 m del paso peatonal"],
    multa: "Entrar a una intersección congestionada y obstruirla: multa categoría D, ¢60 679,58 (2026).",
    ref: ley("Art. 128, art. 108 incisos d) y f), art. 110 inciso d), art. 146 inciso r)"),
  },
  {
    id: "peatones",
    titulo: "Peatones",
    parrafos: [
      "Con luz verde, al girar a la derecha en rojo o después de detenerse en un ALTO, se cede el paso a todos los peatones que estén sobre la calzada.",
      "No ceder el paso a peatones donde el señalamiento lo indica es una infracción.",
    ],
    puntosClave: ["Con luz verde, al girar a la derecha en rojo o después de un ALTO: ceder al peatón que está en la calzada"],
    multa: "No ceder el paso a peatones donde lo indica el señalamiento: multa categoría E, ¢26 005,53 (2026).",
    ref: ley("Art. 104 incisos d) y f), art. 147 inciso j)"),
  },
];
