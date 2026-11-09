import type { Metadata } from "next";
import { FUENTES } from "@/content/fuentes";
import { EXAMEN } from "@/content/examen";

export const metadata: Metadata = { title: "Fuentes" };

export default function PaginaFuentes() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Fuentes y verificación</h1>
      <p className="text-suave">
        Cada regla, pregunta y multa del sitio cita el artículo del que sale. Esta es la lista de fuentes con la fecha de revisión.
        Ante cualquier diferencia, vale la versión oficial.
      </p>
      <ul className="space-y-3">
        {FUENTES.map((f) => (
          <li key={f.id} className="rounded-2xl border border-borde bg-superficie p-4">
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:text-primario hover:underline">{f.titulo}</a>
            <p className="mt-1 text-sm text-suave">
              {f.verificado === "pendiente" ? "Pendiente de confirmar con la Dirección General de Educación Vial" : `Verificado el ${f.verificado}`}
            </p>
          </li>
        ))}
      </ul>
      <p className="rounded-xl bg-aviso-fondo p-4 text-sm">
        El formato del simulacro ({EXAMEN.preguntas} preguntas, {EXAMEN.minutos} minutos, nota mínima {EXAMEN.notaMinima}) se basa en lo publicado por la prensa
        sobre la prueba teórica. Conviene confirmarlo con Educación Vial al matricular la prueba.
      </p>
    </div>
  );
}
