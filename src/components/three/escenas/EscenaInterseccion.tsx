"use client";

import { useMemo, useRef, useState } from "react";
import type { Escenario, Vehiculo } from "@/content/schema";
import { rutaVehiculo, SALIDA } from "@/lib/rutas";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useProgreso } from "@/store/progreso";
import { Canvas3D } from "@/components/three/Canvas3D";
import { Interseccion } from "@/components/three/piezas/Interseccion";
import { Senales3D } from "@/components/three/piezas/Senales3D";
import { Carro3D, type EstadoCarro } from "@/components/three/piezas/Carro3D";
import { Boton } from "@/components/ui/Boton";
import { RefFuente } from "@/components/ui/RefFuente";

type Fase = "elegir" | "revelando" | "terminado";

const NOMBRE_CONTROL: Record<string, string> = {
  alto: "ALTO",
  ceda: "CEDA EL PASO",
  "semaforo-rojo": "semáforo en rojo",
  "semaforo-verde": "semáforo en verde",
};
const NOMBRE_MANIOBRA = { recto: "sigue recto", derecha: "gira a la derecha", izquierda: "gira a la izquierda" } as const;

function describirVehiculo(e: Escenario, v: Vehiculo) {
  const c = e.controles[v.desde];
  return `${v.nombre}: viene del ${v.desde}, ${NOMBRE_MANIOBRA[v.maniobra]}${c && c !== "ninguno" ? `, tiene ${NOMBRE_CONTROL[c]}` : ", sin señal"}${v.emergencia ? ", con luces y sirena" : ""}.`;
}

export default function EscenaInterseccion({ escenarios }: { escenarios: Escenario[] }) {
  const reducir = useReducedMotion();
  const registrar = useProgreso((s) => s.registrarEscenario);
  const resueltos = useProgreso((s) => s.escenarios);
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState<Fase>("elegir");
  const [elegido, setElegido] = useState<string | null>(null);
  const [paso, setPaso] = useState(0);

  const vista = useRef<HTMLDivElement>(null);
  const e = escenarios[idx];
  // El que pasa primero avanza más lejos, para que no se encimen si salen por la misma calle.
  const rutas = useMemo(
    () =>
      Object.fromEntries(
        e.vehiculos.map((v) => [v.id, rutaVehiculo(v.desde, v.maniobra, SALIDA + (e.orden.length - 1 - e.orden.indexOf(v.id)) * 6.5)]),
      ),
    [e],
  );
  const lineas = (Object.keys(e.controles) as (keyof typeof e.controles)[]).filter((d) => e.controles[d] !== "ninguno");

  const estadoDe = (id: string): EstadoCarro => {
    if (fase === "elegir") return "esperando";
    if (fase === "terminado") return "llego";
    const k = e.orden.indexOf(id);
    if (k < paso) return "llego";
    if (k === paso) return "moviendo";
    return "esperando";
  };

  const revelar = () => {
    setPaso(0);
    setFase(reducir ? "terminado" : "revelando");
  };

  const elegir = (id: string) => {
    if (fase !== "elegir") return;
    setElegido(id);
    registrar(e.id, id === e.orden[0]);
    revelar();
    vista.current?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "center" });
  };

  const terminoUno = () => {
    if (paso + 1 >= e.orden.length) setFase("terminado");
    else setPaso((p) => p + 1);
  };

  const irA = (k: number) => {
    setIdx(k);
    setFase("elegir");
    setElegido(null);
    setPaso(0);
  };

  const acerto = elegido === e.orden[0];
  const nombre = (id: string) => e.vehiculos.find((v) => v.id === id)?.nombre ?? id;

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Situaciones" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {escenarios.map((x, k) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={k === idx}
            onClick={() => irA(k)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${k === idx ? "border-primario bg-primario text-primario-texto" : "border-borde bg-superficie"}`}
          >
            {resueltos[x.id] ? "✔ " : ""}
            {k + 1}. {x.titulo}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">{e.titulo}</h2>
        <p>{e.situacion}</p>
      </div>

      <div ref={vista}>
      <Canvas3D
        key={e.id}
        animando={fase === "revelando" || e.vehiculos.some((v) => v.emergencia)}
        etiqueta={`Vista 3D de la intersección. ${e.vehiculos.map((v) => describirVehiculo(e, v)).join(" ")}`}
        alternativa={
          <div className="space-y-1">
            <p className="font-semibold">Tu navegador no puede mostrar 3D. Esta es la situación:</p>
            <ul className="list-disc pl-5">
              {e.vehiculos.map((v) => (
                <li key={v.id}>{describirVehiculo(e, v)}</li>
              ))}
            </ul>
          </div>
        }
      >
        <Interseccion lineasParada={lineas} />
        <Senales3D controles={e.controles} />
        {e.vehiculos.map((v) => (
          <Carro3D
            key={v.id}
            ruta={rutas[v.id]}
            color={v.color}
            nombre={v.nombre.replace(/^Carro /, "")}
            maniobra={v.maniobra}
            emergencia={v.emergencia}
            estado={estadoDe(v.id)}
            resaltado={fase === "elegir" ? false : v.id === e.orden[paso] && fase === "revelando"}
            alTerminar={terminoUno}
            alElegir={fase === "elegir" ? () => elegir(v.id) : undefined}
            mostrarEtiqueta
          />
        ))}
      </Canvas3D>
      </div>
      <p className="text-xs text-suave">Arrastrá para girar la cámara · pellizcá o usá la rueda para acercar. Se circula por la derecha.</p>

      {fase === "elegir" ? (
        <fieldset className="space-y-3 rounded-2xl border border-borde bg-superficie p-4">
          <legend className="px-1 font-bold">¿Quién pasa primero?</legend>
          <p className="text-sm text-suave">Tocá el vehículo en la escena o elegí aquí:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {e.vehiculos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => elegir(v.id)}
                className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-borde p-3 text-left hover:border-primario"
              >
                <span aria-hidden className="h-5 w-5 shrink-0 rounded-full border border-borde" style={{ background: v.color }} />
                <span>
                  <span className="block font-semibold">{v.nombre}</span>
                  <span className="block text-xs text-suave">{describirVehiculo(e, v).replace(`${v.nombre}: `, "")}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <div className={`space-y-3 rounded-2xl p-4 ${acerto ? "bg-exito-fondo" : "bg-error-fondo"}`} role="status" aria-live="polite">
          <p className="text-lg font-bold">{acerto ? "¡Correcto!" : `No: primero pasa el ${nombre(e.orden[0]).toLowerCase()}`}</p>
          <p>
            <strong>Orden correcto:</strong> {e.orden.map(nombre).join(" → ")}
          </p>
          <p>{e.explicacion}</p>
          <RefFuente referencia={e.ref} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Boton variante="secundario" onClick={revelar} disabled={fase === "revelando"}>
              ↻ Ver de nuevo
            </Boton>
            {idx + 1 < escenarios.length ? (
              <Boton onClick={() => irA(idx + 1)}>Siguiente situación →</Boton>
            ) : (
              <Boton onClick={() => irA(0)}>Volver a la primera</Boton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
