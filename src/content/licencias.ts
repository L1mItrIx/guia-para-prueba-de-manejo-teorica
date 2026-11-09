import type { LicenciaId } from "./schema";

export type Licencia = {
  id: LicenciaId;
  /** Segmento de URL. */
  slug: "carro" | "moto";
  nombre: string;
  descripcion: string;
  disponible: boolean;
};

export const LICENCIAS: Licencia[] = [
  {
    id: "B1",
    slug: "carro",
    nombre: "Carro",
    descripcion: "Licencia B1 — automóvil. Manual del Conductor 2026 para automóvil.",
    disponible: true,
  },
  {
    id: "A",
    slug: "moto",
    nombre: "Moto",
    descripcion: "Licencia A — motocicleta. Manual del Conductor 2026 para motociclistas.",
    disponible: false,
  },
];

export function licenciaPorSlug(slug: string): Licencia | undefined {
  return LICENCIAS.find((l) => l.slug === slug);
}
