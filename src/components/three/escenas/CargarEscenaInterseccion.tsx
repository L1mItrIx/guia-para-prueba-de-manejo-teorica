"use client";

import dynamic from "next/dynamic";
import type { Escenario } from "@/content/schema";

/** La escena se carga solo en el cliente (export estático, ver skill animacion-3d). */
const Escena = dynamic(() => import("./EscenaInterseccion"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4" aria-busy="true">
      <div className="h-9 w-2/3 animate-pulse rounded-full bg-superficie" />
      <div className="h-[min(62vh,520px)] min-h-72 animate-pulse rounded-2xl bg-superficie" />
      <p className="text-sm text-suave">Cargando escena 3D…</p>
    </div>
  ),
});

export function CargarEscenaInterseccion({ escenarios }: { escenarios: Escenario[] }) {
  return <Escena escenarios={escenarios} />;
}
