"use client";

import { useEffect } from "react";
import type { LicenciaId } from "@/content/schema";
import { useProgreso } from "@/store/progreso";
import { useHidratado } from "@/lib/useHidratado";

/** Guarda la licencia elegida (para la página de progreso y futuros accesos directos). */
export function RecordarLicencia({ licencia }: { licencia: LicenciaId }) {
  const hidratado = useHidratado();
  const elegir = useProgreso((s) => s.elegirLicencia);
  useEffect(() => {
    if (hidratado) elegir(licencia);
  }, [hidratado, licencia, elegir]);
  return null;
}
