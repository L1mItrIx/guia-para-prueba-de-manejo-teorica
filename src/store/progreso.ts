"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { LicenciaId } from "@/content/schema";
import { responderTarjeta, type EstadoTarjeta } from "@/lib/leitner";

export type RegistroQuiz = { intentos: number; mejorNota: number; ultimaNota: number };
export type RegistroSimulacro = { fecha: number; nota: number; aprobado: boolean; licencia: LicenciaId };

type Estado = {
  licencia: LicenciaId | null;
  quizzes: Record<string, RegistroQuiz>; // por tema
  preguntas: Record<string, { vistas: number; aciertos: number }>; // por id de pregunta
  flashcards: Record<string, EstadoTarjeta>;
  escenas: Record<string, boolean>; // escena animada vista completa
  simulacros: RegistroSimulacro[];
};

type Acciones = {
  elegirLicencia: (l: LicenciaId) => void;
  registrarRespuesta: (preguntaId: string, acerto: boolean) => void;
  registrarQuiz: (tema: string, nota: number) => void;
  responderFlashcard: (id: string, acerto: boolean) => void;
  registrarEscenaVista: (id: string) => void;
  registrarSimulacro: (r: Omit<RegistroSimulacro, "fecha">) => void;
  reiniciar: () => void;
};

const INICIAL: Estado = {
  licencia: null,
  quizzes: {},
  preguntas: {},
  flashcards: {},
  escenas: {},
  simulacros: [],
};

/** localStorage protegido: si el navegador lo bloquea, la web sigue funcionando (sin guardar). */
const almacenamientoSeguro: StateStorage = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* sin almacenamiento disponible */
    }
  },
  removeItem: (k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* sin almacenamiento disponible */
    }
  },
};

export const useProgreso = create<Estado & Acciones>()(
  persist(
    (set) => ({
      ...INICIAL,
      elegirLicencia: (licencia) => set({ licencia }),
      registrarRespuesta: (id, acerto) =>
        set((s) => {
          const p = s.preguntas[id] ?? { vistas: 0, aciertos: 0 };
          return { preguntas: { ...s.preguntas, [id]: { vistas: p.vistas + 1, aciertos: p.aciertos + (acerto ? 1 : 0) } } };
        }),
      registrarQuiz: (tema, nota) =>
        set((s) => {
          const q = s.quizzes[tema] ?? { intentos: 0, mejorNota: 0, ultimaNota: 0 };
          return {
            quizzes: { ...s.quizzes, [tema]: { intentos: q.intentos + 1, mejorNota: Math.max(q.mejorNota, nota), ultimaNota: nota } },
          };
        }),
      responderFlashcard: (id, acerto) =>
        set((s) => ({ flashcards: { ...s.flashcards, [id]: responderTarjeta(s.flashcards[id], acerto, Date.now()) } })),
      registrarEscenaVista: (id) => set((s) => (s.escenas[id] ? s : { escenas: { ...s.escenas, [id]: true } })),
      registrarSimulacro: (r) => set((s) => ({ simulacros: [{ ...r, fecha: Date.now() }, ...s.simulacros].slice(0, 20) })),
      reiniciar: () => set({ ...INICIAL }),
    }),
    {
      name: "prueba-teorica-cr:progreso",
      version: 2,
      // v1 → v2: se quitaron la presentación y el modo 3D aparte; las escenas pasan a contarse como "vistas".
      migrate: (guardado, version) => {
        const e = (guardado ?? {}) as Record<string, unknown>;
        if (version < 2) {
          const { escenarios, presentaciones, ...resto } = e;
          void presentaciones;
          return { ...resto, escenas: (escenarios as Record<string, boolean>) ?? {} } as unknown as Estado & Acciones;
        }
        return e as unknown as Estado & Acciones;
      },
      storage: createJSONStorage(() => almacenamientoSeguro),
      skipHydration: true, // se rehidrata en el cliente (ProveedorProgreso) para evitar desajustes con el HTML estático
    },
  ),
);
