/** Registro de fuentes. Mantener sincronizado con docs/FUENTES.md. */
export type Fuente = { id: string; titulo: string; url: string; verificado: string };

export const FUENTES: Fuente[] = [
  {
    id: "ley-9078",
    titulo: "Ley de Tránsito por Vías Públicas Terrestres y Seguridad Vial N.º 9078 (texto actualizado)",
    url: "https://bufetedecostarica.com/wp-content/uploads/2026/10/ley-de-transito-por-vias-publicas-terrestres-y-seguridad-vial-de-costa-rica_9078_v3.pdf",
    verificado: "2026-11-09",
  },
  {
    id: "multas-2026",
    titulo: "Montos de multas de tránsito vigentes desde el 1 de enero de 2026 (Circular N.º 220-2025, Boletín Judicial N.º 223)",
    url: "https://bufetedecostarica.com/wp-content/uploads/2026/10/ley-de-transito-por-vias-publicas-terrestres-y-seguridad-vial-de-costa-rica_9078_v3.pdf",
    verificado: "2026-11-09",
  },
  {
    id: "manuales-2026",
    titulo: "Nuevos Manuales del Conductor (carro y moto) vigentes desde el 2 de marzo de 2026 — Observador CR",
    url: "https://observador.cr/cambios-en-las-pruebas-teoricas-de-manejo-con-nuevos-manuales-arrancaron-este-lunes/",
    verificado: "2026-11-09",
  },
  {
    id: "aprobacion-2026",
    titulo: "Prueba teórica de manejo mantiene baja aprobación tras cambio de manuales — Teletica, 24 de junio de 2026",
    url: "https://www.teletica.com/nacional/prueba-teorica-de-manejo-mantiene-baja-aprobacion-tras-cambio-de-manuales_412239",
    verificado: "2026-11-09",
  },
  {
    id: "formato-examen",
    titulo: "Formato de la prueba teórica: 40 preguntas, nota mínima 70 — CRHoy (2023) y El Mundo CR (2022)",
    url: "https://www.crhoy.com/pruebas-teoricas-de-licencia-desde-la-casa-cual-sera-la-nota-minima-para-aprobar/",
    verificado: "pendiente",
  },
];

export function buscarFuente(id: string): Fuente | undefined {
  return FUENTES.find((f) => f.id === id);
}
