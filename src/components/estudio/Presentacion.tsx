"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Diapositiva } from "@/content/schema";
import { useProgreso } from "@/store/progreso";
import { Boton } from "@/components/ui/Boton";
import { Senal } from "@/components/ui/Senal";

export function Presentacion({ tema, diapositivas }: { tema: string; diapositivas: Diapositiva[] }) {
  const reducir = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const registrar = useProgreso((s) => s.registrarPresentacion);
  const total = diapositivas.length;

  const ir = useCallback(
    (n: number) => {
      const destino = Math.max(0, Math.min(total - 1, n));
      setDir(destino >= i ? 1 : -1);
      setI(destino);
    },
    [i, total],
  );

  useEffect(() => {
    if (i === total - 1) registrar(tema);
  }, [i, total, tema, registrar]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") ir(i + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") ir(i - 1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [i, ir]);

  const d = diapositivas[i];
  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-primario text-primario-texto sm:aspect-video" aria-roledescription="presentación" aria-label={`Diapositiva ${i + 1} de ${total}`}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={d.id}
            custom={dir}
            initial={reducir ? { opacity: 0 } : { opacity: 0, x: 60 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, x: -60 * dir }}
            transition={{ duration: 0.25 }}
            drag={reducir ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) ir(i + 1);
              if (info.offset.x > 60) ir(i - 1);
            }}
            className="absolute inset-0 flex cursor-grab flex-col justify-center gap-6 p-6 active:cursor-grabbing sm:flex-row sm:items-center sm:p-12"
          >
            <div className="min-w-0 flex-1 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75">{i + 1} / {total}</p>
              <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">{d.titulo}</h2>
              <ul className="space-y-2 text-base sm:text-xl">
                {d.puntos.map((p) => (
                  <li key={p} className="flex gap-3"><span aria-hidden>▸</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
            {d.visual && (
              <div className="flex shrink-0 justify-center rounded-2xl bg-white/95 p-4">
                <Senal tipo={d.visual} className="h-24 w-24 sm:h-40 sm:w-40" />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Boton variante="secundario" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Diapositiva anterior">←<span className="hidden sm:inline"> Anterior</span></Boton>
        <div className="flex flex-wrap justify-center gap-1">
          {diapositivas.map((x, k) => (
            <button
              key={x.id}
              type="button"
              onClick={() => ir(k)}
              aria-label={`Ir a la diapositiva ${k + 1}`}
              aria-current={k === i}
              className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-primario" : "w-2.5 bg-borde"}`}
            />
          ))}
        </div>
        <Boton onClick={() => ir(i + 1)} disabled={i === total - 1} aria-label="Diapositiva siguiente"><span className="hidden sm:inline">Siguiente </span>→</Boton>
      </div>
      <p className="text-center text-xs text-suave">Usá las flechas del teclado o deslizá con el dedo.</p>
    </div>
  );
}
