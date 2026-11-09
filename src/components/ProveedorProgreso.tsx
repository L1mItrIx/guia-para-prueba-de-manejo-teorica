"use client";

import { useEffect } from "react";
import { useProgreso } from "@/store/progreso";

/** Carga el progreso guardado en el navegador después de montar (el HTML es estático). */
export function ProveedorProgreso({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useProgreso.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
