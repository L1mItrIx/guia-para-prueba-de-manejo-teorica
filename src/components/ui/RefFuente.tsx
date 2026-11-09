import { buscarFuente } from "@/content/fuentes";
import type { RefFuente as Ref } from "@/content/schema";

/** Cita breve de la fuente, con enlace. */
export function RefFuente({ referencia }: { referencia: Ref }) {
  const f = buscarFuente(referencia.fuente);
  const nombre = f?.id === "ley-9078" || f?.id === "multas-2026" ? "Ley 9078" : f?.titulo ?? referencia.fuente;
  return (
    <p className="text-xs text-suave">
      Fuente:{" "}
      {f ? (
        <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primario">
          {nombre}
        </a>
      ) : (
        nombre
      )}
      , {referencia.detalle}
    </p>
  );
}
