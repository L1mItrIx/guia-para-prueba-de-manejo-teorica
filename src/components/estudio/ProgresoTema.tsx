"use client";

import { BarraProgreso } from "@/components/ui/BarraProgreso";
import { dominio } from "@/lib/leitner";
import { useHidratado } from "@/lib/useHidratado";
import { useProgreso } from "@/store/progreso";

export function ProgresoTema({ tema, flashcards, escenas = [] }: { tema: string; flashcards: string[]; escenas?: string[] }) {
  const hidratado = useHidratado();
  const quiz = useProgreso((s) => s.quizzes[tema]);
  const tarjetas = useProgreso((s) => s.flashcards);
  const vistas = useProgreso((s) => s.escenas);
  if (!hidratado) return <div className="h-12" aria-hidden />;
  const nVistas = escenas.filter((id) => vistas[id]).length;
  return (
    <div className="space-y-2">
      <BarraProgreso etiqueta="Mejor nota en el quiz" valor={quiz?.mejorNota ?? 0} />
      <BarraProgreso etiqueta="Flashcards dominadas" valor={dominio(flashcards, tarjetas)} />
      {escenas.length > 0 && <BarraProgreso etiqueta={`Animaciones vistas (${nVistas} de ${escenas.length})`} valor={(nVistas / escenas.length) * 100} />}
    </div>
  );
}
