"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LicenciaId, Pregunta } from "@/content/schema";
import { EXAMEN } from "@/content/examen";
import { barajar, barajarOpciones } from "@/lib/barajar";
import { calificar, formatoTiempo } from "@/lib/calificar";
import { useProgreso } from "@/store/progreso";
import { Boton } from "@/components/ui/Boton";
import { RefFuente } from "@/components/ui/RefFuente";

type Item = Pregunta & { orden: string[]; correctaBarajada: number };
const LETRAS = ["A", "B", "C", "D"];

/** Modo examen: sin retroalimentación hasta entregar, con tiempo límite. */
export function Simulacro({ licencia, banco }: { licencia: LicenciaId; banco: Pregunta[] }) {
  const registrar = useProgreso((s) => s.registrarSimulacro);
  const [items, setItems] = useState<Item[] | null>(null);
  const [respuestas, setRespuestas] = useState<(number | null)[]>([]);
  const [actual, setActual] = useState(0);
  const [restante, setRestante] = useState(EXAMEN.minutos * 60);
  const [entregado, setEntregado] = useState(false);
  const fin = useRef(0);

  const cantidad = Math.min(EXAMEN.preguntas, banco.length);

  const empezar = () => {
    const sel = barajar(banco).slice(0, cantidad).map((p) => {
      const b = barajarOpciones(p.opciones, p.correcta);
      return { ...p, orden: b.opciones, correctaBarajada: b.correcta };
    });
    setItems(sel);
    setRespuestas(sel.map(() => null));
    setActual(0);
    setEntregado(false);
    fin.current = Date.now() + EXAMEN.minutos * 60 * 1000;
    setRestante(EXAMEN.minutos * 60);
  };

  const resultado = useMemo(
    () => (items ? calificar(respuestas, items.map((i) => i.correctaBarajada), EXAMEN.notaMinima) : null),
    [items, respuestas],
  );

  const entregar = () => {
    if (!resultado || entregado) return;
    setEntregado(true);
    registrar({ nota: resultado.nota, aprobado: resultado.aprobado, licencia });
    window.scrollTo({ top: 0 });
  };

  // Temporizador basado en la hora real (no se desfasa si la pestaña queda en segundo plano).
  useEffect(() => {
    if (!items || entregado) return;
    const id = window.setInterval(() => {
      const s = Math.round((fin.current - Date.now()) / 1000);
      setRestante(Math.max(0, s));
    }, 500);
    return () => window.clearInterval(id);
  }, [items, entregado]);

  useEffect(() => {
    if (items && !entregado && restante <= 0) entregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante]);

  if (!items) {
    return (
      <div className="space-y-4 rounded-2xl border border-borde bg-superficie p-6">
        <ul className="space-y-1">
          <li>📝 <strong>{cantidad}</strong> preguntas de selección única</li>
          <li>⏱️ <strong>{EXAMEN.minutos}</strong> minutos</li>
          <li>🎯 Se aprueba con <strong>{EXAMEN.notaMinima}</strong></li>
          <li>🔇 No verás si acertaste hasta entregar, igual que en el examen real</li>
        </ul>
        {cantidad < EXAMEN.preguntas && (
          <p className="rounded-xl bg-aviso-fondo p-3 text-sm">
            El examen real tiene {EXAMEN.preguntas} preguntas. Por ahora el banco del sitio tiene {banco.length} preguntas verificadas; el simulacro crecerá con cada tema nuevo.
          </p>
        )}
        <Boton onClick={empezar}>Empezar simulacro</Boton>
      </div>
    );
  }

  if (entregado && resultado) {
    return (
      <div className="space-y-6">
        <div className={`rounded-2xl p-6 ${resultado.aprobado ? "bg-exito-fondo" : "bg-error-fondo"}`} role="status">
          <p className="text-sm font-semibold uppercase tracking-wide">{resultado.aprobado ? "Aprobado" : "Reprobado"}</p>
          <p className="text-5xl font-extrabold" data-testid="nota-simulacro">{resultado.nota}</p>
          <p>{resultado.correctas} de {resultado.total} correctas · nota mínima {EXAMEN.notaMinima}</p>
        </div>
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Revisión</h2>
          {items.map((it, k) => {
            const bien = respuestas[k] === it.correctaBarajada;
            return (
              <details key={it.id} className={`rounded-2xl border-2 bg-superficie p-4 ${bien ? "border-exito" : "border-error"}`}>
                <summary className="cursor-pointer font-semibold">
                  {bien ? "✔" : "✘"} {k + 1}. {it.enunciado}
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  {respuestas[k] !== null && !bien && <p><span className="font-semibold text-error">Tu respuesta:</span> {it.orden[respuestas[k]!]}</p>}
                  {respuestas[k] === null && <p className="text-error">Sin responder</p>}
                  <p><span className="font-semibold text-exito">Correcta:</span> {it.orden[it.correctaBarajada]}</p>
                  <p className="text-suave">{it.explicacion}</p>
                  <RefFuente referencia={it.ref} />
                </div>
              </details>
            );
          })}
        </section>
        <Boton onClick={empezar}>Hacer otro simulacro</Boton>
      </div>
    );
  }

  const it = items[actual];
  const contestadas = respuestas.filter((r) => r !== null).length;
  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-30 flex items-center justify-between rounded-xl border border-borde bg-superficie px-4 py-2 shadow-sm">
        <span className="text-sm">{contestadas}/{items.length} respondidas</span>
        <span className={`font-mono text-lg font-bold ${restante < 300 ? "text-error" : ""}`} aria-live="off" aria-label={`Tiempo restante ${formatoTiempo(restante)}`}>
          ⏱ {formatoTiempo(restante)}
        </span>
      </div>
      <div className="space-y-4 rounded-2xl border border-borde bg-superficie p-5">
        <p className="text-sm text-suave">Pregunta {actual + 1} de {items.length}</p>
        <h2 className="text-lg font-semibold leading-snug">{it.enunciado}</h2>
        <ul className="space-y-2">
          {it.orden.map((op, k) => (
            <li key={k}>
              <button
                type="button"
                aria-pressed={respuestas[actual] === k}
                onClick={() => setRespuestas((r) => r.map((x, j) => (j === actual ? k : x)))}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left ${respuestas[actual] === k ? "border-primario bg-superficie-2" : "border-borde hover:border-primario"}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-superficie-2 text-sm font-bold">{LETRAS[k]}</span>
                <span className="pt-0.5">{op}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between gap-3">
        <Boton variante="secundario" onClick={() => setActual((a) => a - 1)} disabled={actual === 0}>← Anterior</Boton>
        {actual + 1 < items.length ? (
          <Boton onClick={() => setActual((a) => a + 1)}>Siguiente →</Boton>
        ) : (
          <Boton onClick={entregar}>Entregar examen</Boton>
        )}
      </div>
      <nav aria-label="Ir a una pregunta" className="flex flex-wrap gap-1.5">
        {items.map((x, k) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setActual(k)}
            aria-label={`Pregunta ${k + 1}${respuestas[k] !== null ? ", respondida" : ""}`}
            aria-current={k === actual}
            className={`h-9 w-9 rounded-lg text-sm font-semibold ${k === actual ? "bg-primario text-primario-texto" : respuestas[k] !== null ? "bg-superficie-2" : "border border-borde"}`}
          >
            {k + 1}
          </button>
        ))}
      </nav>
      <Boton variante="fantasma" onClick={entregar}>Entregar ahora ({items.length - contestadas} sin responder)</Boton>
    </div>
  );
}
