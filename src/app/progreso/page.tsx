import type { Metadata } from "next";
import { LICENCIAS } from "@/content/licencias";
import { temasDeLicencia } from "@/content/temas";
import { PanelProgreso, type ResumenTema } from "@/components/estudio/PanelProgreso";

export const metadata: Metadata = { title: "Progreso" };

export default function PaginaProgreso() {
  const temas: ResumenTema[] = LICENCIAS.filter((l) => l.disponible).flatMap((l) =>
    temasDeLicencia(l.id).map((t) => ({
      slug: t.slug,
      titulo: `${t.titulo} (${l.nombre})`,
      href: `/${l.slug}/${t.slug}/`,
      flashcards: t.flashcards.map((f) => f.id),
      escenas: t.escenas.map((e) => e.id),
    })),
  );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Progreso</h1>
      <PanelProgreso temas={temas} />
    </div>
  );
}
