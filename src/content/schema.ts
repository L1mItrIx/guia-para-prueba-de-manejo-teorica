import { z } from "zod";

/** Licencias soportadas. B1 = automóvil, A = motocicleta. */
export const LicenciaId = z.enum(["B1", "A"]);
export type LicenciaId = z.infer<typeof LicenciaId>;

/** Fecha ISO (AAAA-MM-DD) en que se verificó contra la fuente, o "pendiente". */
export const Verificado = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa AAAA-MM-DD"),
  z.literal("pendiente"),
]);

/** Referencia a una fuente registrada en content/fuentes.ts. */
export const RefFuente = z.object({
  fuente: z.string().min(1),
  detalle: z.string().min(1), // p. ej. "Art. 105, inciso e)"
});
export type RefFuente = z.infer<typeof RefFuente>;

export const Pregunta = z
  .object({
    id: z.string().min(1),
    enunciado: z.string().min(10),
    opciones: z.array(z.string().min(1)).min(3).max(4),
    correcta: z.number().int().min(0),
    explicacion: z.string().min(10),
    ref: RefFuente,
    verificado: Verificado,
    /** Escena animada que ilustra la situación (se revela la solución al responder). */
    escena: z.string().optional(),
  })
  .refine((p) => p.correcta < p.opciones.length, {
    message: "La respuesta correcta no existe entre las opciones",
  });
export type Pregunta = z.infer<typeof Pregunta>;

export const Flashcard = z.object({
  id: z.string().min(1),
  frente: z.string().min(3),
  reverso: z.string().min(3),
  ref: RefFuente,
  escena: z.string().optional(),
});
export type Flashcard = z.infer<typeof Flashcard>;

export const SeccionResumen = z.object({
  id: z.string().min(1),
  titulo: z.string().min(3),
  parrafos: z.array(z.string().min(10)).min(1),
  puntosClave: z.array(z.string().min(3)).default([]),
  /** Multa vigente asociada, si aplica (texto ya formateado). */
  multa: z.string().optional(),
  ref: RefFuente,
  /** Escenas animadas que acompañan la sección. */
  escenas: z.array(z.string()).default([]),
});
export type SeccionResumen = z.infer<typeof SeccionResumen>;

export const Visual = z.enum(["alto", "ceda", "semaforo", "rotonda", "emergencia", "peaton", "prioridad"]);
export type Visual = z.infer<typeof Visual>;

/* ───────────── Escenas animadas (3D) ───────────── */

export const Direccion = z.enum(["norte", "sur", "este", "oeste"]);
export type Direccion = z.infer<typeof Direccion>;
export const Maniobra = z.enum(["recto", "derecha", "izquierda"]);
export type Maniobra = z.infer<typeof Maniobra>;
export const Control = z.enum(["ninguno", "alto", "ceda", "semaforo-rojo", "semaforo-amarillo", "semaforo-verde"]);
export type Control = z.infer<typeof Control>;
export const Luz = z.enum(["rojo", "amarillo", "verde"]);
export type Luz = z.infer<typeof Luz>;

const Color = z.string().regex(/^#[0-9a-fA-F]{6}$/);

/** Un paso de la línea de tiempo de una escena. Se ejecutan en orden. */
export const Paso = z.discriminatedUnion("accion", [
  /** Mueve un vehículo hasta su línea de parada / ceda ("parada") o hasta el final de su recorrido ("fin"). */
  z.object({ accion: z.literal("mover"), vehiculo: z.string(), hasta: z.enum(["parada", "fin"]).default("fin") }),
  /** Los peatones (todos, o los indicados) cruzan su paso peatonal. */
  z.object({ accion: z.literal("peatones"), peatones: z.array(z.string()).optional() }),
  /** Cambia la luz del semáforo de un acceso. */
  z.object({ accion: z.literal("semaforo"), acceso: Direccion, luz: Luz }),
  z.object({ accion: z.literal("pausa"), segundos: z.number().positive().max(10) }),
]);
export type Paso = z.infer<typeof Paso>;

export const VehiculoCruce = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1), // "Carro rojo"
  color: Color,
  desde: Direccion, // acceso por el que llega
  maniobra: Maniobra,
  emergencia: z.boolean().default(false),
  /** Metros respecto de la línea de parada al empezar (negativo = más atrás; positivo = ya pasó el cruce). */
  inicio: z.number().min(-20).max(30).default(0),
  /** Hasta dónde llega desde el centro del cruce al terminar (m). Si falta, se escalona según el orden. */
  fin: z.number().min(8).max(40).optional(),
  etiqueta: z.boolean().default(true),
});
export type VehiculoCruce = z.infer<typeof VehiculoCruce>;

export const Peaton = z.object({
  id: z.string().min(1),
  /** Brazo del cruce en cuyo paso peatonal camina. */
  paso: Direccion,
  /** Hacia qué lado cruza, visto desde el conductor que llega por ese brazo. */
  sentido: z.enum(["a-la-derecha", "a-la-izquierda"]).default("a-la-izquierda"),
  color: Color.default("#f28c28"),
});
export type Peaton = z.infer<typeof Peaton>;

const BaseEscena = {
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(3),
  situacion: z.string().min(10),
  explicacion: z.string().min(10),
  ref: RefFuente,
};

export const EscenaCruce = z.object({
  ...BaseEscena,
  tipo: z.literal("cruce"),
  /** Control de cada acceso. Los que no aparecen no tienen señal. */
  controles: z.partialRecord(Direccion, Control).default({}),
  tipoVia: z.partialRecord(Direccion, z.enum(["primaria", "secundaria"])).optional(),
  noche: z.boolean().default(false),
  vehiculos: z.array(VehiculoCruce).min(1).max(5),
  peatones: z.array(Peaton).default([]),
  /** Orden de paso: atajo para "mover cada uno hasta el fin, en este orden". */
  orden: z.array(z.string()).optional(),
  /** Línea de tiempo completa (si está, reemplaza a `orden`). */
  pasos: z.array(Paso).optional(),
});
export type EscenaCruce = z.infer<typeof EscenaCruce>;

export const VehiculoRotonda = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  color: Color,
  /** Brazo por el que entra. Si falta, ya circula dentro desde `dentroDesde` (grados; 0 = este, 90 = norte). */
  entrada: Direccion.optional(),
  dentroDesde: z.number().min(0).max(360).optional(),
  salida: Direccion,
  carril: z.enum(["interno", "externo"]),
  emergencia: z.boolean().default(false),
  etiqueta: z.boolean().default(true),
});
export type VehiculoRotonda = z.infer<typeof VehiculoRotonda>;

export const EscenaRotonda = z.object({
  ...BaseEscena,
  tipo: z.literal("rotonda"),
  vehiculos: z.array(VehiculoRotonda).min(1).max(4),
  orden: z.array(z.string()).optional(),
  pasos: z.array(Paso).optional(),
});
export type EscenaRotonda = z.infer<typeof EscenaRotonda>;

export const Escena = z
  .discriminatedUnion("tipo", [EscenaCruce, EscenaRotonda])
  .refine((e) => !!e.orden || !!e.pasos, { message: "La escena necesita `orden` o `pasos`" })
  .refine(
    (e) => {
      const ids = new Set(e.vehiculos.map((v) => v.id));
      const usados = [...(e.orden ?? []), ...(e.pasos ?? []).flatMap((p) => (p.accion === "mover" ? [p.vehiculo] : []))];
      return usados.every((id) => ids.has(id));
    },
    { message: "El orden o los pasos mencionan un vehículo que no existe" },
  )
  .refine((e) => e.tipo !== "rotonda" || e.vehiculos.every((v) => (v.entrada ? 1 : 0) + (v.dentroDesde !== undefined ? 1 : 0) === 1), {
    message: "Cada vehículo de rotonda necesita `entrada` o `dentroDesde` (uno solo)",
  });
export type Escena = z.infer<typeof Escena>;

export const Tema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  licencias: z.array(LicenciaId).min(1),
  resumen: z.array(SeccionResumen).min(1),
  preguntas: z.array(Pregunta).min(1),
  flashcards: z.array(Flashcard).min(1),
  escenas: z.array(Escena).default([]),
});
export type Tema = z.infer<typeof Tema>;
export type TemaEntrada = z.input<typeof Tema>;
