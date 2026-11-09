import { notFound } from "next/navigation";
import { LICENCIAS, licenciaPorSlug, type Licencia } from "./licencias";
import { temaPorSlug, temasDeLicencia } from "./temas";
import type { Tema } from "./schema";

/** Parámetros estáticos de /[licencia]. */
export function paramsLicencias() {
  return LICENCIAS.map((l) => ({ licencia: l.slug }));
}

/** Parámetros estáticos de /[licencia]/[tema]. Solo licencias disponibles. */
export function paramsTemas() {
  return LICENCIAS.filter((l) => l.disponible).flatMap((l) => temasDeLicencia(l.id).map((t) => ({ licencia: l.slug, tema: t.slug })));
}

export function obtenerLicencia(slug: string): Licencia {
  const l = licenciaPorSlug(slug);
  if (!l) notFound();
  return l;
}

export function obtenerTema(licenciaSlug: string, temaSlug: string): { licencia: Licencia; tema: Tema } {
  const licencia = obtenerLicencia(licenciaSlug);
  const tema = temaPorSlug(temaSlug);
  if (!tema || !licencia.disponible || !tema.licencias.includes(licencia.id)) notFound();
  return { licencia, tema };
}

export type ParamsLicencia = Promise<{ licencia: string }>;
export type ParamsTema = Promise<{ licencia: string; tema: string }>;
