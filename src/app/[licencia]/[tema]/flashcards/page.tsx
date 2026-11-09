import type { Metadata } from "next";
import { obtenerTema, paramsTemas, type ParamsTema } from "@/content/rutas";
import { Migas } from "@/components/ui/Migas";
import { Flashcards } from "@/components/estudio/Flashcards";

export const dynamicParams = false;
export const generateStaticParams = paramsTemas;

export async function generateMetadata({ params }: { params: ParamsTema }): Promise<Metadata> {
  const p = await params;
  const { tema } = obtenerTema(p.licencia, p.tema);
  return { title: `Flashcards — ${tema.titulo}` };
}

export default async function Pagina({ params }: { params: ParamsTema }) {
  const p = await params;
  const { licencia, tema } = obtenerTema(p.licencia, p.tema);
  const volver = `/${licencia.slug}/${tema.slug}/`;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { href: volver, texto: tema.titulo }, { texto: "Flashcards" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Flashcards: {tema.titulo}</h1>
      <Flashcards tarjetas={tema.flashcards} volverHref={volver} />
    </div>
  );
}
