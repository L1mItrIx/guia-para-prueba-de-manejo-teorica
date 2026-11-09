import { Tema, type LicenciaId } from "@/content/schema";
import intersecciones from "./intersecciones";

/** Registro de TODOS los temas. Agrega aquí cada tema nuevo (ver skill arquitectura). */
const ENTRADAS = [intersecciones];

export const TEMAS: Tema[] = ENTRADAS.map((t) => Tema.parse(t));

export function temasDeLicencia(licencia: LicenciaId): Tema[] {
  return TEMAS.filter((t) => t.licencias.includes(licencia));
}

export function temaPorSlug(slug: string): Tema | undefined {
  return TEMAS.find((t) => t.slug === slug);
}
