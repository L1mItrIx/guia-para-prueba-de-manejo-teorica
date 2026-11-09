"use client";

import Link from "next/link";
import { useHidratado } from "@/lib/useHidratado";
import { useProgreso } from "@/store/progreso";
import { dominio } from "@/lib/leitner";
import { BarraProgreso } from "@/components/ui/BarraProgreso";
import { Boton } from "@/components/ui/Boton";
import { EXAMEN } from "@/content/examen";

export type ResumenTema = { slug: string; titulo: string; href: string; flashcards: string[]; escenarios: string[] };

export function PanelProgreso({ temas }: { temas: ResumenTema[] }) {
  const hidratado = useHidratado();
  const s = useProgreso();
  if (!hidratado) return <div className="h-64 animate-pulse rounded-2xl bg-superficie" aria-hidden />;

  const ultimo = s.simulacros[0];
  const reiniciar = () => {
    if (window.confirm("¿Borrar todo tu progreso guardado en este navegador?")) s.reiniciar();
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-superficie p-5">
          <p className="text-sm text-suave">Último simulacro</p>
          <p className="text-3xl font-extrabold">{ultimo ? ultimo.nota : "—"}</p>
          {ultimo && <p className={`text-sm font-semibold ${ultimo.aprobado ? "text-exito" : "text-error"}`}>{ultimo.aprobado ? "Aprobado" : "Reprobado"}</p>}
        </div>
        <div className="rounded-2xl bg-superficie p-5">
          <p className="text-sm text-suave">Simulacros aprobados</p>
          <p className="text-3xl font-extrabold">{s.simulacros.filter((x) => x.aprobado).length} / {s.simulacros.length}</p>
          <p className="text-sm text-suave">Nota mínima {EXAMEN.notaMinima}</p>
        </div>
        <div className="rounded-2xl bg-superficie p-5">
          <p className="text-sm text-suave">Preguntas respondidas</p>
          <p className="text-3xl font-extrabold">{Object.values(s.preguntas).reduce((a, p) => a + p.vistas, 0)}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Por tema</h2>
        {temas.map((t) => {
          const resueltos = t.escenarios.filter((id) => s.escenarios[id]).length;
          return (
            <div key={t.slug} className="space-y-3 rounded-2xl border border-borde bg-superficie p-5">
              <Link href={t.href} className="font-bold hover:text-primario">{t.titulo}</Link>
              <BarraProgreso etiqueta="Mejor nota en el quiz" valor={s.quizzes[t.slug]?.mejorNota ?? 0} />
              <BarraProgreso etiqueta="Flashcards dominadas" valor={dominio(t.flashcards, s.flashcards)} />
              {t.escenarios.length > 0 && <BarraProgreso etiqueta={`Escenas 3D resueltas (${resueltos}/${t.escenarios.length})`} valor={(resueltos / t.escenarios.length) * 100} />}
              <p className="text-sm text-suave">Presentación: {s.presentaciones[t.slug] ? "vista completa ✔" : "pendiente"}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-2 rounded-2xl border border-borde p-5">
        <h2 className="font-bold">Tus datos</h2>
        <p className="text-sm text-suave">El progreso se guarda solo en este navegador (no hay cuentas ni servidores). Si borrás los datos del navegador o usás otro dispositivo, empezás de cero.</p>
        <Boton variante="secundario" onClick={reiniciar}>Borrar mi progreso</Boton>
      </section>
    </div>
  );
}
