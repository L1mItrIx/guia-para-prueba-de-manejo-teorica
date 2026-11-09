"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Direccion, Escena } from "@/content/schema";
import { modeloEscena, type ModeloEscena } from "@/lib/modeloEscena";
import type { EstadoEscena } from "@/lib/lineaTiempo";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useProgreso } from "@/store/progreso";
import { Canvas3D } from "@/components/three/Canvas3D";
import { Interseccion } from "@/components/three/piezas/Interseccion";
import { Senales3D } from "@/components/three/piezas/Senales3D";
import { Carro3D } from "@/components/three/piezas/Carro3D";
import { Peaton3D } from "@/components/three/piezas/Peaton3D";
import { Rotonda3D } from "@/components/three/piezas/Rotonda3D";
import { describirEscena } from "./describir";

export type ModoEscena = "demostracion" | "pregunta";
type Fase = "inicio" | "reproduciendo" | "fin";

const CAMARA_CRUCE: [number, number, number] = [17.5, 22, 24];
const CAMARA_ROTONDA: [number, number, number] = [22, 30, 30];

/** Avanza el reloj de la escena mientras se reproduce y avisa al terminar. */
function Reloj({ tiempo, duracion, activo, alTerminar }: { tiempo: { current: number }; duracion: number; activo: boolean; alTerminar: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [activo, invalidate]);
  useFrame((_, delta) => {
    if (!activo) return;
    tiempo.current = Math.min(duracion, tiempo.current + Math.min(delta, 0.1));
    if (tiempo.current >= duracion) alTerminar();
  });
  return null;
}

/** Pide un cuadro nuevo cuando cambia `version` (para frameloop="demand"). */
function Refrescar({ version }: { version: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [version, invalidate]);
  return null;
}

function Actores({ escena, modelo, estado, animando }: { escena: Escena; modelo: ModeloEscena; estado: () => EstadoEscena; animando: boolean }) {
  if (escena.tipo === "rotonda") {
    return (
      <>
        <Rotonda3D />
        {escena.vehiculos.map((v) => (
          <Carro3D
            key={v.id}
            recorrido={modelo.recorridos[v.id]}
            obtenerS={() => estado().s[v.id]}
            estaMoviendo={() => estado().moviendo === v.id}
            animando={animando}
            color={v.color}
            nombre={v.nombre}
            emergencia={v.emergencia}
            etiqueta={v.etiqueta}
          />
        ))}
      </>
    );
  }
  const lineas = (Object.keys(escena.controles) as Direccion[]).filter((d) => escena.controles[d] !== "ninguno");
  return (
    <>
      <Interseccion lineasParada={lineas} tipoVia={escena.tipoVia} pasosPeatonales={[...new Set(escena.peatones.map((p) => p.paso))]} />
      <Senales3D controles={escena.controles} obtenerLuz={(d) => estado().luces[d]} />
      {escena.vehiculos.map((v) => (
        <Carro3D
          key={v.id}
          recorrido={modelo.recorridos[v.id]}
          obtenerS={() => estado().s[v.id]}
          estaMoviendo={() => estado().moviendo === v.id}
          animando={animando}
          color={v.color}
          nombre={v.nombre}
          maniobra={v.maniobra}
          emergencia={v.emergencia}
          etiqueta={v.etiqueta}
        />
      ))}
      {escena.peatones.map((p) => (
        <Peaton3D key={p.id} paso={p.paso} sentido={p.sentido} color={p.color} obtenerAvance={() => estado().peatones[p.id] ?? 0} />
      ))}
    </>
  );
}

/**
 * Escena animada para cualquier modo de estudio (ver skill animacion-3d).
 * - demostracion: muestra la situación y se reproduce con un botón (o sola si `auto`).
 * - pregunta: muestra la situación sin revelar nada; cuando `revelar` pasa a true, reproduce la solución.
 */
export default function EscenaAnimada({
  escena,
  modo,
  revelar = false,
  auto = false,
  montar = true,
  alto = "h-[min(46vh,360px)] min-h-60",
}: {
  escena: Escena;
  modo: ModoEscena;
  revelar?: boolean;
  auto?: boolean;
  /** Si es false, se muestra un póster en lugar del canvas (fuera de pantalla o sin turno). */
  montar?: boolean;
  alto?: string;
}) {
  const reducir = useReducedMotion();
  const marcarVista = useProgreso((s) => s.registrarEscenaVista);
  const modelo = useMemo(() => modeloEscena(escena), [escena]);
  const tiempo = useRef(0);
  const [fase, setFase] = useState<Fase>("inicio");
  const [version, setVersion] = useState(0);

  const cache = useRef<{ t: number; e: EstadoEscena } | null>(null);
  const estado = useCallback(() => {
    if (!cache.current || cache.current.t !== tiempo.current) cache.current = { t: tiempo.current, e: modelo.estadoEn(tiempo.current) };
    return cache.current.e;
  }, [modelo]);

  const reproducir = useCallback(() => {
    if (reducir) {
      tiempo.current = modelo.duracion;
      setFase("fin");
      marcarVista(escena.id);
    } else {
      tiempo.current = 0;
      setFase("reproduciendo");
    }
    setVersion((v) => v + 1);
  }, [reducir, modelo, marcarVista, escena.id]);

  const terminar = useCallback(() => {
    setFase((f) => (f === "reproduciendo" ? "fin" : f));
    marcarVista(escena.id);
  }, [marcarVista, escena.id]);

  // Modo pregunta: la solución se reproduce al responder; al cambiar de pregunta vuelve al inicio.
  useEffect(() => {
    if (modo !== "pregunta") return;
    if (revelar) {
      reproducir();
    } else {
      tiempo.current = 0;
      setFase("inicio");
      setVersion((v) => v + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo, revelar]);

  useEffect(() => {
    if (modo === "demostracion" && auto) reproducir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animando = fase === "reproduciendo";
  const descripcion = describirEscena(escena);
  const pie = modo === "pregunta" ? (revelar ? "Así se resuelve la situación." : escena.situacion) : fase === "fin" ? escena.explicacion : escena.situacion;
  const mostrarBoton = modo === "demostracion" || revelar;

  return (
    <figure className="space-y-2" data-escena={escena.id} data-fase={fase}>
      {montar ? (
        <Canvas3D
          animando={animando}
          noche={escena.tipo === "cruce" && escena.noche}
          camara={escena.tipo === "rotonda" ? CAMARA_ROTONDA : CAMARA_CRUCE}
          className={alto}
          etiqueta={`Animación: ${escena.titulo}. ${escena.situacion} ${descripcion.join(" ")}`}
          alternativa={
            <div className="space-y-1">
              <p className="font-semibold">Este navegador no puede mostrar la animación 3D. La situación es:</p>
              <ul className="list-disc pl-5">
                {descripcion.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              {(modo === "demostracion" || revelar) && <p>{escena.explicacion}</p>}
            </div>
          }
        >
          <Reloj tiempo={tiempo} duracion={modelo.duracion} activo={animando} alTerminar={terminar} />
          <Refrescar version={version} />
          <Actores escena={escena} modelo={modelo} estado={estado} animando={animando} />
        </Canvas3D>
      ) : (
        <div className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-borde bg-superficie-2 text-sm text-suave ${alto}`} aria-hidden>
          Animación: {escena.titulo}
        </div>
      )}
      <figcaption className="flex flex-wrap items-start justify-between gap-2 text-sm">
        <span className="min-w-0 flex-1">
          <span className="font-semibold">{escena.titulo}.</span> <span className="text-suave">{pie}</span>
        </span>
        {mostrarBoton && (
          <button
            type="button"
            onClick={reproducir}
            disabled={animando}
            data-accion="reproducir"
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-borde bg-superficie px-3 py-2 font-semibold hover:bg-superficie-2 disabled:opacity-50"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
              {fase === "inicio" ? (
                <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
              ) : (
                <path d="M8 2a6 6 0 1 0 6 6h-2a4 4 0 1 1-1.2-2.85L9 7h5V2l-1.8 1.8A6 6 0 0 0 8 2z" fill="currentColor" />
              )}
            </svg>
            {animando ? "Reproduciendo…" : fase === "inicio" ? "Reproducir animación" : "Repetir animación"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
