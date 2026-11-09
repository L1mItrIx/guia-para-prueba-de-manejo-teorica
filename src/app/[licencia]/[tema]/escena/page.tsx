import type { Metadata } from "next";
import { obtenerTema, paramsTemas, type ParamsTema } from "@/content/rutas";
import { Migas } from "@/components/ui/Migas";
import { CargarEscenaInterseccion } from "@/components/three/escenas/CargarEscenaInterseccion";

export const dynamicParams = false;
export const generateStaticParams = paramsTemas;

export async function generateMetadata({ params }: { params: ParamsTema }): Promise<Metadata> {
  const p = await params;
  const { tema } = obtenerTema(p.licencia, p.tema);
  return { title: `Escena 3D — ${tema.titulo}` };
}

export default async function Pagina({ params }: { params: ParamsTema }) {
  const p = await params;
  const { licencia, tema } = obtenerTema(p.licencia, p.tema);
  const volver = `/${licencia.slug}/${tema.slug}/`;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { href: volver, texto: tema.titulo }, { texto: "Escena 3D" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Escena 3D: {tema.titulo}</h1>
      <CargarEscenaInterseccion escenarios={tema.escenarios} />
    </div>
  );
}
