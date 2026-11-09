import type { Metadata } from "next";
import { LICENCIAS } from "@/content/licencias";
import { temasDeLicencia } from "@/content/temas";
import { PanelProgreso, type ResumenTema } from "@/components/estudio/PanelProgreso";

export const metadata: Metadata = { title: "Mi progreso" };

export default function PaginaProgreso() {
  const temas: ResumenTema[] = LICENCIAS.filter((l) => l.disponible).flatMap((l) =>
    temasDeLicencia(l.id).map((t) => ({
      slug: t.slug,
      titulo: `${t.titulo} (${l.nombre})`,
      href: `/${l.slug}/${t.slug}/`,
      flashcards: t.flashcards.map((f) => f.id),
      escenarios: t.escenarios.map((e) => e.id),
    })),
  );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Mi progreso</h1>
      <PanelProgreso temas={temas} />
    </div>
  );
}
