"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Escena, Pregunta } from "@/content/schema";
import { EscenaEmbebida } from "@/components/three/escenas/EscenaEmbebida";
import { barajar, barajarOpciones } from "@/lib/barajar";
import { calificar } from "@/lib/calificar";
import { useProgreso } from "@/store/progreso";
import { Boton, BotonLink } from "@/components/ui/Boton";
import { RefFuente } from "@/components/ui/RefFuente";
import { EXAMEN } from "@/content/examen";

type Item = Pregunta & { orden: string[]; correctaBarajada: number };

function preparar(preguntas: Pregunta[]): Item[] {
  return barajar(preguntas).map((p) => {
    const b = barajarOpciones(p.opciones, p.correcta);
    return { ...p, orden: b.opciones, correctaBarajada: b.correcta };
  });
}

const LETRAS = ["A", "B", "C", "D"];

export function Quiz({ tema, preguntas, escenas = [], volverHref }: { tema: string; preguntas: Pregunta[]; escenas?: Escena[]; volverHref: string }) {
  const escenaPorId = Object.fromEntries(escenas.map((e) => [e.id, e]));
  const reducir = useReducedMotion();
  const [items, setItems] = useState<Item[] | null>(null);
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState<(number | null)[]>([]);
  const registrarRespuesta = useProgreso((s) => s.registrarRespuesta);
  const registrarQuiz = useProgreso((s) => s.registrarQuiz);

  const empezar = () => {
    const nuevos = preparar(preguntas);
    setItems(nuevos);
    setRespuestas(nuevos.map(() => null));
    setI(0);
  };

  if (!items) {
    return (
      <div className="space-y-4 rounded-2xl border border-borde bg-superficie p-6">
        <p className="text-lg font-semibold">{preguntas.length} preguntas de selección única</p>
        <p className="text-suave">Después de cada respuesta aparece la explicación con el artículo de la ley y, en las preguntas de situación, la animación de lo que corresponde hacer. Las preguntas y las opciones cambian de orden en cada intento.</p>
        <Boton onClick={empezar}>Empezar quiz</Boton>
      </div>
    );
  }

  const terminado = i >= items.length;
  if (terminado) {
    const r = calificar(respuestas, items.map((it) => it.correctaBarajada), EXAMEN.notaMinima);
    const falladas = items.filter((it, k) => respuestas[k] !== it.correctaBarajada);
    return (
      <div className="space-y-6">
        <div className={`rounded-2xl p-6 ${r.aprobado ? "bg-exito-fondo" : "bg-error-fondo"}`} role="status">
          <p className="text-sm font-semibold uppercase tracking-wide">{r.aprobado ? "Aprobado" : "Por debajo de la nota mínima"}</p>
          <p className="text-4xl font-extrabold" data-testid="nota-quiz">{r.nota}</p>
          <p className="text-sm">{r.correctas} de {r.total} correctas · nota mínima: {EXAMEN.notaMinima}</p>
        </div>
        {falladas.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold">Preguntas para repasar</h2>
            {falladas.map((it) => (
              <div key={it.id} className="space-y-2 rounded-2xl border border-borde bg-superficie p-4">
                <p className="font-semibold">{it.enunciado}</p>
                <p className="text-sm"><span className="font-semibold text-exito">Correcta:</span> {it.orden[it.correctaBarajada]}</p>
                <p className="text-sm text-suave">{it.explicacion}</p>
                <RefFuente referencia={it.ref} />
              </div>
            ))}
          </section>
        )}
        <div className="flex flex-wrap gap-3">
          <Boton onClick={empezar}>Hacer el quiz otra vez</Boton>
          <BotonLink href={volverHref} variante="secundario">Volver al tema</BotonLink>
        </div>
      </div>
    );
  }

  const it = items[i];
  const elegida = respuestas[i];
  const respondida = elegida !== null;

  const elegir = (k: number) => {
    if (respondida) return;
    const nuevas = [...respuestas];
    nuevas[i] = k;
    setRespuestas(nuevas);
    registrarRespuesta(it.id, k === it.correctaBarajada);
  };

  const siguiente = () => {
    if (i + 1 >= items.length) {
      const r = calificar(respuestas, items.map((x) => x.correctaBarajada), EXAMEN.notaMinima);
      registrarQuiz(tema, r.nota);
    }
    setI(i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-suave">
        <span>Pregunta {i + 1} de {items.length}</span>
        <span>{respuestas.filter((r, k) => r !== null && r === items[k].correctaBarajada).length} correctas</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-superficie-2" aria-hidden>
        <div className="h-full bg-primario transition-[width]" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={it.id}
          initial={reducir ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducir ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 rounded-2xl border border-borde bg-superficie p-5"
        >
          <h2 className="text-lg font-semibold leading-snug">{it.enunciado}</h2>
          {it.escena && escenaPorId[it.escena] && <EscenaEmbebida escena={escenaPorId[it.escena]} modo="pregunta" revelar={respondida} />}
          <ul className="space-y-2">
            {it.orden.map((op, k) => {
              const esCorrecta = k === it.correctaBarajada;
              let estilo = "border-borde hover:border-primario hover:bg-superficie-2";
              if (respondida && esCorrecta) estilo = "border-exito bg-exito-fondo";
              else if (respondida && k === elegida) estilo = "border-error bg-error-fondo";
              else if (respondida) estilo = "border-borde opacity-70";
              return (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => elegir(k)}
                    disabled={respondida}
                    aria-pressed={k === elegida}
                    className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${estilo}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-superficie-2 text-sm font-bold">{LETRAS[k]}</span>
                    <span className="pt-0.5">{op}</span>
                    {respondida && esCorrecta && <span className="ml-auto text-exito" aria-label="Respuesta correcta">✔</span>}
                    {respondida && !esCorrecta && k === elegida && <span className="ml-auto text-error" aria-label="Respuesta elegida, incorrecta">✘</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {respondida && (
            <div className={`space-y-2 rounded-xl p-4 ${elegida === it.correctaBarajada ? "bg-exito-fondo" : "bg-error-fondo"}`} role="status">
              <p className="font-bold">{elegida === it.correctaBarajada ? "Correcto" : "Incorrecto"}</p>
              <p className="text-sm">{it.explicacion}</p>
              <RefFuente referencia={it.ref} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-end">
        <Boton onClick={siguiente} disabled={!respondida}>
          {i + 1 >= items.length ? "Ver resultado" : "Siguiente →"}
        </Boton>
      </div>
    </div>
  );
}
