import type { TemaEntrada } from "@/content/schema";
import { resumen } from "./resumen";
import { preguntas } from "./preguntas";
import { flashcards } from "./flashcards";
import { diapositivas } from "./diapositivas";
import { escenarios } from "./escenarios";

const tema: TemaEntrada = {
  slug: "intersecciones",
  titulo: "Intersecciones y derecho de vía",
  descripcion: "Quién pasa primero: ALTO, CEDA, semáforos, cruces sin señales, rotondas y vehículos de emergencia.",
  licencias: ["B1"], // Moto (A): revisar contra el manual de motociclistas antes de habilitar
  resumen,
  preguntas,
  flashcards,
  diapositivas,
  escenarios,
};

export default tema;
