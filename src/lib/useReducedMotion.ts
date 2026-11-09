"use client";

import { useEffect, useState } from "react";

/** true si la persona pidió reducir el movimiento en su sistema. */
export function useReducedMotion(): boolean {
  const [reducir, setReducir] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReducir(mq.matches);
    const cambio = (e: MediaQueryListEvent) => setReducir(e.matches);
    mq.addEventListener("change", cambio);
    return () => mq.removeEventListener("change", cambio);
  }, []);
  return reducir;
}
