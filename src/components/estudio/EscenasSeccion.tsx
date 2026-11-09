"use client";

import { useState } from "react";
import type { Escena } from "@/content/schema";
import { EscenaEmbebida } from "@/components/three/escenas/EscenaEmbebida";

/** Animaciones de una sección del resumen. Si hay varias, se elige una a la vez (un solo canvas). */
export function EscenasSeccion({ escenas }: { escenas: Escena[] }) {
  const [i, setI] = useState(0);
  const actual = escenas[i];
  return (
    <div className="min-w-0 space-y-2">
      {escenas.length > 1 && (
        <div role="tablist" aria-label="Animaciones de esta sección" className="flex flex-wrap gap-2">
          {escenas.map((e, k) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${k === i ? "border-primario bg-primario text-primario-texto" : "border-borde bg-superficie hover:border-primario"}`}
            >
              {e.titulo}
            </button>
          ))}
        </div>
      )}
      <EscenaEmbebida key={actual.id} escena={actual} modo="demostracion" />
    </div>
  );
}
