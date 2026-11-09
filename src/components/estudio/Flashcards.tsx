"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Escena, Flashcard } from "@/content/schema";
import { EscenaEmbebida } from "@/components/three/escenas/EscenaEmbebida";
import { dominio, ordenarParaRepaso, tocaRepasar } from "@/lib/leitner";
import { useHidratado } from "@/lib/useHidratado";
import { useProgreso } from "@/store/progreso";
import { Boton, BotonLink } from "@/components/ui/Boton";
import { BarraProgreso } from "@/components/ui/BarraProgreso";
import { RefFuente } from "@/components/ui/RefFuente";

export function Flashcards({ tarjetas, escenas = [], volverHref }: { tarjetas: Flashcard[]; escenas?: Escena[]; volverHref: string }) {
  const escenaPorId = Object.fromEntries(escenas.map((e) => [e.id, e]));
  const reducir = useReducedMotion();
  const hidratado = useHidratado();
  const estados = useProgreso((s) => s.flashcards);
  const responder = useProgreso((s) => s.responderFlashcard);
  const [mazo, setMazo] = useState<Flashcard[] | null>(null);
  const [i, setI] = useState(0);
  const [volteada, setVolteada] = useState(false);

  const ids = tarjetas.map((t) => t.id);

  const empezar = (todas: boolean) => {
    const ahora = Date.now();
    const ordenadas = ordenarParaRepaso(tarjetas, estados, ahora);
    setMazo(todas ? ordenadas : ordenadas.filter((t) => tocaRepasar(estados[t.id], ahora)));
    setI(0);
    setVolteada(false);
  };

  if (!hidratado) return <div className="h-80 animate-pulse rounded-2xl bg-superficie" aria-hidden />;

  if (!mazo) {
    const ahora = Date.now();
    const pendientes = tarjetas.filter((t) => tocaRepasar(estados[t.id], ahora)).length;
    return (
      <div className="space-y-4 rounded-2xl border border-borde bg-superficie p-6">
        <BarraProgreso etiqueta="Tarjetas dominadas" valor={dominio(ids, estados)} />
        <p>
          <strong>{pendientes}</strong> de {tarjetas.length} tarjetas pendientes de repaso hoy. Las acertadas vuelven a aparecer en 1, 3, 7 y 14 días; las falladas, en el próximo repaso.
        </p>
        <div className="flex flex-wrap gap-3">
          <Boton onClick={() => empezar(false)} disabled={pendientes === 0}>Repasar pendientes</Boton>
          <Boton onClick={() => empezar(true)} variante="secundario">Repasar todas</Boton>
        </div>
      </div>
    );
  }

  if (i >= mazo.length) {
    return (
      <div className="space-y-4 rounded-2xl bg-exito-fondo p-6" role="status">
        <p className="text-xl font-bold">Repaso terminado</p>
        <BarraProgreso etiqueta="Tarjetas dominadas" valor={dominio(ids, estados)} />
        <div className="flex flex-wrap gap-3">
          <Boton onClick={() => setMazo(null)}>Volver a empezar</Boton>
          <BotonLink href={volverHref} variante="secundario">Volver al tema</BotonLink>
        </div>
      </div>
    );
  }

  const t = mazo[i];
  const caja = estados[t.id]?.caja;
  const marcar = (acerto: boolean) => {
    responder(t.id, acerto);
    setVolteada(false);
    setI(i + 1);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-suave">Tarjeta {i + 1} de {mazo.length}{caja ? ` · caja ${caja} de 5` : " · nueva"}</p>
      <div className="[perspective:1200px]">
        <motion.button
          type="button"
          onClick={() => setVolteada((v) => !v)}
          aria-label={volteada ? "Mostrar la pregunta" : "Mostrar la respuesta"}
          className="relative block h-72 w-full [transform-style:preserve-3d] sm:h-64"
          animate={reducir ? { opacity: 1 } : { rotateY: volteada ? 180 : 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <span
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-primario bg-superficie p-6 text-center [backface-visibility:hidden] ${reducir && volteada ? "hidden" : ""}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-suave">Pregunta</span>
            <span className="text-2xl font-bold">{t.frente}</span>
            <span className="text-xs text-suave">Tocar la tarjeta para ver la respuesta</span>
          </span>
          <span
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-exito bg-superficie p-6 text-center [backface-visibility:hidden] ${reducir ? (volteada ? "" : "hidden") : "[transform:rotateY(180deg)]"}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-suave">Respuesta</span>
            <span className="text-lg">{t.reverso}</span>
          </span>
        </motion.button>
      </div>
      {volteada ? (
        <div className="space-y-3">
          <RefFuente referencia={t.ref} />
          {t.escena && escenaPorId[t.escena] && <EscenaEmbebida key={t.id} escena={escenaPorId[t.escena]} modo="demostracion" auto />}
          <div className="grid grid-cols-2 gap-3">
            <Boton variante="secundario" onClick={() => marcar(false)}>✘ Repasar de nuevo</Boton>
            <Boton onClick={() => marcar(true)}>✔ Acertada</Boton>
          </div>
        </div>
      ) : (
        <Boton className="w-full" variante="secundario" onClick={() => setVolteada(true)}>Ver respuesta</Boton>
      )}
    </div>
  );
}
