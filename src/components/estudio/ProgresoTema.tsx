"use client";

import { BarraProgreso } from "@/components/ui/BarraProgreso";
import { dominio } from "@/lib/leitner";
import { useHidratado } from "@/lib/useHidratado";
import { useProgreso } from "@/store/progreso";

export function ProgresoTema({ tema, flashcards }: { tema: string; preguntas: string[]; flashcards: string[] }) {
  const hidratado = useHidratado();
  const quiz = useProgreso((s) => s.quizzes[tema]);
  const tarjetas = useProgreso((s) => s.flashcards);
  if (!hidratado) return <div className="h-12" aria-hidden />;
  return (
    <div className="space-y-2">
      <BarraProgreso etiqueta="Mejor nota en el quiz" valor={quiz?.mejorNota ?? 0} />
      <BarraProgreso etiqueta="Flashcards dominadas" valor={dominio(flashcards, tarjetas)} />
    </div>
  );
}
