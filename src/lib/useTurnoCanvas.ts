"use client";

import { useEffect, useReducer, useRef } from "react";

/**
 * Limita cuántas escenas 3D tienen un canvas WebGL vivo al mismo tiempo (los navegadores
 * móviles admiten pocos contextos). La escena que entra en pantalla toma el turno de la más
 * antigua; la desplazada muestra su póster hasta volver a entrar en pantalla.
 */
export const MAX_CANVAS = 2;
const activos: symbol[] = [];
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

function soltar(id: symbol) {
  const i = activos.indexOf(id);
  if (i >= 0) {
    activos.splice(i, 1);
    avisar();
  }
}

export function useTurnoCanvas(quiere: boolean): boolean {
  const yo = useRef(Symbol("escena"));
  const [, refrescar] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    oyentes.add(refrescar);
    const id = yo.current;
    return () => {
      oyentes.delete(refrescar);
      soltar(id);
    };
  }, []);

  // Solo se pide turno cuando la escena ENTRA en pantalla (o al montarse visible).
  useEffect(() => {
    const id = yo.current;
    if (!quiere) return soltar(id);
    if (activos.includes(id)) return;
    if (activos.length >= MAX_CANVAS) activos.shift();
    activos.push(id);
    avisar();
  }, [quiere]);

  return activos.includes(yo.current);
}
