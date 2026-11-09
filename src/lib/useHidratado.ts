"use client";

import { useEffect, useState } from "react";
import { useProgreso } from "@/store/progreso";

/** true cuando el progreso guardado ya se cargó desde el navegador. */
export function useHidratado(): boolean {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const quitar = useProgreso.persist.onFinishHydration(() => setListo(true));
    if (useProgreso.persist.hasHydrated()) setListo(true);
    return quitar;
  }, []);
  return listo;
}
