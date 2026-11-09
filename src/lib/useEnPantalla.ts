"use client";

import { useEffect, useState, type RefObject } from "react";

/** true mientras el elemento está en pantalla (o cerca). Sin IntersectionObserver, siempre true. */
export function useEnPantalla(ref: RefObject<Element | null>, margen = "0px"): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margen });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margen]);
  return visible;
}
