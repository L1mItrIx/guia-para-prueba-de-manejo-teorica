import type { Metadata } from "next";
import Link from "next/link";
import { obtenerTema, paramsTemas, type ParamsTema } from "@/content/rutas";
import { Migas } from "@/components/ui/Migas";
import { RefFuente } from "@/components/ui/RefFuente";
import { BotonLink } from "@/components/ui/Boton";
import { Senal } from "@/components/ui/Senal";
import type { Visual } from "@/content/schema";

export const dynamicParams = false;
export const generateStaticParams = paramsTemas;

export async function generateMetadata({ params }: { params: ParamsTema }): Promise<Metadata> {
  const p = await params;
  const { tema } = obtenerTema(p.licencia, p.tema);
  return { title: tema.titulo, description: tema.descripcion };
}

const VISUAL_POR_SECCION: Record<string, Visual> = {
  alto: "alto",
  ceda: "ceda",
  semaforo: "semaforo",
  rotondas: "rotonda",
  emergencias: "emergencia",
  peatones: "peaton",
  prioridad: "prioridad",
};

export default async function PaginaTema({ params }: { params: ParamsTema }) {
  const p = await params;
  const { licencia, tema } = obtenerTema(p.licencia, p.tema);
  const base = `/${licencia.slug}/${tema.slug}`;
  const modos = [
    { href: `${base}/escena/`, titulo: "Escena 3D", texto: `${tema.escenarios.length} situaciones: decidí quién pasa primero`, icono: "🚦", mostrar: tema.escenarios.length > 0 },
    { href: `${base}/quiz/`, titulo: "Quiz", texto: `${tema.preguntas.length} preguntas con explicación`, icono: "✅", mostrar: true },
    { href: `${base}/flashcards/`, titulo: "Flashcards", texto: `${tema.flashcards.length} tarjetas con repaso espaciado`, icono: "🃏", mostrar: true },
    { href: `${base}/presentacion/`, titulo: "Presentación", texto: `${tema.diapositivas.length} diapositivas para repasar rápido`, icono: "🖥️", mostrar: true },
  ].filter((m) => m.mostrar);

  return (
    <article className="space-y-8">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { texto: tema.titulo }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{tema.titulo}</h1>
        <p className="text-lg text-suave">{tema.descripcion}</p>
      </header>

      <nav aria-label="Modos de estudio" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modos.map((m) => (
          <Link key={m.href} href={m.href} className="group rounded-2xl border border-borde bg-superficie p-4 transition hover:border-primario hover:shadow-md">
            <span aria-hidden className="text-2xl">{m.icono}</span>
            <span className="mt-1 block font-bold group-hover:text-primario">{m.titulo}</span>
            <span className="block text-sm text-suave">{m.texto}</span>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="resumen" className="space-y-4">
        <h2 id="resumen" className="text-2xl font-bold">Resumen</h2>
        <ol className="space-y-4">
          {tema.resumen.map((s, i) => {
            const visual = VISUAL_POR_SECCION[s.id];
            return (
              <li key={s.id} id={s.id} className="scroll-mt-20 rounded-2xl border border-borde bg-superficie p-5">
                <div className="flex gap-4">
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="text-lg font-bold">
                      <span className="text-suave">{i + 1}. </span>
                      {s.titulo}
                    </h3>
                    {s.parrafos.map((par, j) => (
                      <p key={j} className="leading-relaxed">{par}</p>
                    ))}
                    {s.puntosClave.length > 0 && (
                      <ul className="space-y-1 rounded-xl bg-superficie-2 p-3 text-sm">
                        {s.puntosClave.map((pk) => (
                          <li key={pk} className="flex gap-2"><span aria-hidden className="text-primario">●</span>{pk}</li>
                        ))}
                      </ul>
                    )}
                    {s.multa && <p className="rounded-xl bg-error-fondo p-3 text-sm">{s.multa}</p>}
                    <RefFuente referencia={s.ref} />
                  </div>
                  {visual && <Senal tipo={visual} className="hidden h-24 w-24 shrink-0 sm:block" />}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <BotonLink href={`${base}/quiz/`}>Poner a prueba lo que aprendí</BotonLink>
        {tema.escenarios.length > 0 && <BotonLink href={`${base}/escena/`} variante="secundario">Practicar en 3D</BotonLink>}
      </div>
    </article>
  );
}
