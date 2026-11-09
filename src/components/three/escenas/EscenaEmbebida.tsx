"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { Escena } from "@/content/schema";
import { useEnPantalla } from "@/lib/useEnPantalla";
import { useTurnoCanvas } from "@/lib/useTurnoCanvas";
import type { ModoEscena } from "./EscenaAnimada";

const ALTO = "h-[min(46vh,360px)] min-h-60";

/** El código 3D se carga solo en el cliente y solo cuando hace falta (export estático). */
const EscenaAnimada = dynamic(() => import("./EscenaAnimada"), {
  ssr: false,
  loading: () => <div className={`w-full animate-pulse rounded-2xl bg-superficie-2 ${ALTO}`} aria-hidden />,
});

/**
 * Escena lista para usar dentro de un modo de estudio: se monta al entrar en pantalla
 * y respeta el límite de canvas vivos (ver skill animacion-3d).
 */
export function EscenaEmbebida(props: { escena: Escena; modo: ModoEscena; revelar?: boolean; auto?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useEnPantalla(ref);
  const turno = useTurnoCanvas(visible);
  return (
    <div ref={ref}>
      <EscenaAnimada {...props} montar={visible && turno} alto={ALTO} />
    </div>
  );
}
