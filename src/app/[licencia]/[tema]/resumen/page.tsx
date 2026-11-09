import type { Metadata } from "next";
import Link from "next/link";
import { obtenerTema, paramsTemas, type ParamsTema } from "@/content/rutas";
import { Migas } from "@/components/ui/Migas";
import { RefFuente } from "@/components/ui/RefFuente";
import { Senal } from "@/components/ui/Senal";
import { BotonLink } from "@/components/ui/Boton";
import { EscenasSeccion } from "@/components/estudio/EscenasSeccion";
import type { Visual } from "@/content/schema";

export const dynamicParams = false;
export const generateStaticParams = paramsTemas;

export async function generateMetadata({ params }: { params: ParamsTema }): Promise<Metadata> {
  const p = await params;
  const { tema } = obtenerTema(p.licencia, p.tema);
  return { title: `Resumen — ${tema.titulo}` };
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

export default async function PaginaResumen({ params }: { params: ParamsTema }) {
  const p = await params;
  const { licencia, tema } = obtenerTema(p.licencia, p.tema);
  const base = `/${licencia.slug}/${tema.slug}`;
  const escenaPorId = Object.fromEntries(tema.escenas.map((e) => [e.id, e]));

  return (
    <article className="space-y-8">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { href: `${base}/`, texto: tema.titulo }, { texto: "Resumen" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Resumen: {tema.titulo}</h1>
        <p className="text-suave">Cada sección explica una regla y, cuando aplica, la muestra en una animación.</p>
      </header>

      <nav aria-label="Secciones" className="flex flex-wrap gap-2 text-sm">
        {tema.resumen.map((s, i) => (
          <Link key={s.id} href={`#${s.id}`} className="rounded-full border border-borde bg-superficie px-3 py-1.5 hover:border-primario">
            {i + 1}. {s.titulo}
          </Link>
        ))}
      </nav>

      <ol className="space-y-6">
        {tema.resumen.map((s, i) => {
          const visual = VISUAL_POR_SECCION[s.id];
          const escenas = s.escenas.map((id) => escenaPorId[id]).filter(Boolean);
          return (
            <li key={s.id} id={s.id} className="scroll-mt-20 rounded-2xl border border-borde bg-superficie p-5">
              <div className={`grid gap-6 ${escenas.length ? "lg:grid-cols-2" : ""}`}>
                <div className="min-w-0 space-y-3">
                  <h2 className="flex items-start gap-3 text-xl font-bold">
                    {visual && <Senal tipo={visual} className="h-9 w-9 shrink-0" />}
                    <span>
                      <span className="text-suave">{i + 1}. </span>
                      {s.titulo}
                    </span>
                  </h2>
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
                {escenas.length > 0 && <EscenasSeccion escenas={escenas} />}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        <BotonLink href={`${base}/quiz/`}>Seguir con el quiz</BotonLink>
        <BotonLink href={`${base}/flashcards/`} variante="secundario">Repasar con flashcards</BotonLink>
      </div>
    </article>
  );
}
