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
});
export type SeccionResumen = z.infer<typeof SeccionResumen>;

export const Visual = z.enum(["alto", "ceda", "semaforo", "rotonda", "emergencia", "peaton", "prioridad"]);
export type Visual = z.infer<typeof Visual>;

export const Diapositiva = z.object({
  id: z.string().min(1),
  titulo: z.string().min(3),
  puntos: z.array(z.string().min(3)).min(1).max(6),
  visual: Visual.optional(),
});
export type Diapositiva = z.infer<typeof Diapositiva>;

/** Escenas 3D de intersección. */
export const Direccion = z.enum(["norte", "sur", "este", "oeste"]);
export type Direccion = z.infer<typeof Direccion>;
export const Maniobra = z.enum(["recto", "derecha", "izquierda"]);
export type Maniobra = z.infer<typeof Maniobra>;
export const Control = z.enum(["ninguno", "alto", "ceda", "semaforo-rojo", "semaforo-verde"]);
export type Control = z.infer<typeof Control>;

export const Vehiculo = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1), // "Carro rojo"
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  desde: Direccion, // de dónde viene (acceso por el que entra)
  maniobra: Maniobra,
  emergencia: z.boolean().default(false),
});
export type Vehiculo = z.infer<typeof Vehiculo>;

export const Escenario = z
  .object({
    id: z.string().min(1),
    titulo: z.string().min(3),
    situacion: z.string().min(10),
    /** Control de cada acceso. Los que no aparecen no tienen señal. */
    controles: z.partialRecord(Direccion, Control),
    /** Tipo de vía de cada acceso (para la regla primaria/secundaria). */
    tipoVia: z.partialRecord(Direccion, z.enum(["primaria", "secundaria"])).optional(),
    vehiculos: z.array(Vehiculo).min(2).max(4),
    /** Orden correcto de paso (ids de vehiculos). */
    orden: z.array(z.string()).min(2),
    explicacion: z.string().min(10),
    ref: RefFuente,
  })
  .refine((e) => e.orden.every((id) => e.vehiculos.some((v) => v.id === id)), {
    message: "El orden menciona un vehículo que no existe",
  })
  .refine((e) => new Set(e.vehiculos.map((v) => v.desde)).size === e.vehiculos.length, {
    message: "Dos vehículos no pueden venir del mismo acceso",
  });
export type Escenario = z.infer<typeof Escenario>;

export const Tema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  licencias: z.array(LicenciaId).min(1),
  resumen: z.array(SeccionResumen).min(1),
  preguntas: z.array(Pregunta).min(1),
  flashcards: z.array(Flashcard).min(1),
  diapositivas: z.array(Diapositiva).min(1),
  escenarios: z.array(Escenario).default([]),
});
export type Tema = z.infer<typeof Tema>;
export type TemaEntrada = z.input<typeof Tema>;
