import type { Metadata } from "next";
import Link from "next/link";
import { obtenerLicencia, paramsLicencias, type ParamsLicencia } from "@/content/rutas";
import { temasDeLicencia } from "@/content/temas";
import { EXAMEN } from "@/content/examen";
import { BotonLink } from "@/components/ui/Boton";
import { Migas } from "@/components/ui/Migas";
import { ProximamenteMoto } from "@/components/ProximamenteMoto";
import { RecordarLicencia } from "@/components/RecordarLicencia";
import { ProgresoTema } from "@/components/estudio/ProgresoTema";

export const dynamicParams = false;
export const generateStaticParams = paramsLicencias;

export async function generateMetadata({ params }: { params: ParamsLicencia }): Promise<Metadata> {
  const l = obtenerLicencia((await params).licencia);
  return { title: `Temas — ${l.nombre}` };
}

export default async function PaginaLicencia({ params }: { params: ParamsLicencia }) {
  const licencia = obtenerLicencia((await params).licencia);
  if (!licencia.disponible) return <ProximamenteMoto />;
  const temas = temasDeLicencia(licencia.id);
  const base = `/${licencia.slug}`;

  return (
    <div className="space-y-8">
      <RecordarLicencia licencia={licencia.id} />
      <Migas items={[{ href: "/", texto: "Inicio" }, { texto: licencia.nombre }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Licencia {licencia.id}: {licencia.nombre}</h1>
        <p className="text-suave">Elegí un tema para estudiar o poné a prueba lo que sabés con el simulacro.</p>
      </header>

      <section className="rounded-2xl bg-primario p-6 text-primario-texto">
        <h2 className="text-xl font-bold">Simulacro de examen</h2>
        <p className="mt-1 text-sm opacity-90">
          {EXAMEN.preguntas} preguntas · {EXAMEN.minutos} minutos · nota mínima {EXAMEN.notaMinima}. Igual que el examen real.
        </p>
        <Link href={`${base}/simulacro/`} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-superficie px-4 py-2.5 text-sm font-semibold text-texto">
          Hacer simulacro →
        </Link>
      </section>

      <section aria-labelledby="temas" className="space-y-4">
        <h2 id="temas" className="text-xl font-bold">Temas</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {temas.map((t) => (
            <li key={t.slug} className="flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-5">
              <h3 className="text-lg font-bold">
                <Link href={`${base}/${t.slug}/`} className="hover:text-primario">{t.titulo}</Link>
              </h3>
              <p className="text-sm text-suave">{t.descripcion}</p>
              <ProgresoTema tema={t.slug} preguntas={t.preguntas.map((p) => p.id)} flashcards={t.flashcards.map((f) => f.id)} />
              <div className="mt-auto flex flex-wrap gap-2">
                <BotonLink href={`${base}/${t.slug}/`}>Estudiar</BotonLink>
                <BotonLink href={`${base}/${t.slug}/quiz/`} variante="secundario">Quiz</BotonLink>
              </div>
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-2xl border border-dashed border-borde p-5 text-sm text-suave">
            Próximos temas: señales de tránsito, velocidades, adelantamiento, alcohol y drogas, primeros auxilios y mecánica básica.
          </li>
        </ul>
      </section>
    </div>
  );
}
