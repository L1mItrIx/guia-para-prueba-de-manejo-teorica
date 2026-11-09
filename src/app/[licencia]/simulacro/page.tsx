import type { Metadata } from "next";
import { obtenerLicencia, paramsLicencias, type ParamsLicencia } from "@/content/rutas";
import { temasDeLicencia } from "@/content/temas";
import { Migas } from "@/components/ui/Migas";
import { Simulacro } from "@/components/estudio/Simulacro";
import { ProximamenteMoto } from "@/components/ProximamenteMoto";

export const dynamicParams = false;
export const generateStaticParams = paramsLicencias;
export const metadata: Metadata = { title: "Simulacro de práctica" };

export default async function PaginaSimulacro({ params }: { params: ParamsLicencia }) {
  const licencia = obtenerLicencia((await params).licencia);
  if (!licencia.disponible) return <ProximamenteMoto />;
  // Solo entran al simulacro las preguntas verificadas contra su fuente.
  const banco = temasDeLicencia(licencia.id).flatMap((t) => t.preguntas.filter((p) => p.verificado !== "pendiente"));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { texto: "Simulacro" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Simulacro de práctica — {licencia.nombre}</h1>
      <Simulacro licencia={licencia.id} banco={banco} />
    </div>
  );
}
