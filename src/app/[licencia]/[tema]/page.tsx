import type { Metadata } from "next";
import Link from "next/link";
import { obtenerTema, paramsTemas, type ParamsTema } from "@/content/rutas";
import { Migas } from "@/components/ui/Migas";
import { IconoQuiz, IconoResumen, IconoTarjetas, IconoAnimacion } from "@/components/ui/Iconos";
import { ProgresoTema } from "@/components/estudio/ProgresoTema";

export const dynamicParams = false;
export const generateStaticParams = paramsTemas;

export async function generateMetadata({ params }: { params: ParamsTema }): Promise<Metadata> {
  const p = await params;
  const { tema } = obtenerTema(p.licencia, p.tema);
  return { title: tema.titulo, description: tema.descripcion };
}

export default async function PaginaTema({ params }: { params: ParamsTema }) {
  const p = await params;
  const { licencia, tema } = obtenerTema(p.licencia, p.tema);
  const base = `/${licencia.slug}/${tema.slug}`;
  const conEscena = (n: number) => (n > 0 ? `${n} con animación` : null);
  const modos = [
    {
      href: `${base}/resumen/`,
      titulo: "Resumen",
      texto: "Las reglas explicadas paso a paso, con la animación de cada situación.",
      detalle: [`${tema.resumen.length} secciones`, conEscena(tema.resumen.filter((s) => s.escenas.length).length)],
      Icono: IconoResumen,
    },
    {
      href: `${base}/quiz/`,
      titulo: "Quiz",
      texto: "Preguntas de selección única. Al responder se ve la explicación y la animación de la respuesta correcta.",
      detalle: [`${tema.preguntas.length} preguntas`, conEscena(tema.preguntas.filter((q) => q.escena).length)],
      Icono: IconoQuiz,
    },
    {
      href: `${base}/flashcards/`,
      titulo: "Flashcards",
      texto: "Tarjetas de repaso rápido. Las que se fallan vuelven antes; al voltear, algunas muestran la situación animada.",
      detalle: [`${tema.flashcards.length} tarjetas`, conEscena(tema.flashcards.filter((f) => f.escena).length)],
      Icono: IconoTarjetas,
    },
  ];

  return (
    <div className="space-y-8">
      <Migas items={[{ href: "/", texto: "Inicio" }, { href: `/${licencia.slug}/`, texto: licencia.nombre }, { texto: tema.titulo }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{tema.titulo}</h1>
        <p className="text-lg text-suave">{tema.descripcion}</p>
      </header>

      <section aria-labelledby="como" className="space-y-4">
        <h2 id="como" className="text-xl font-bold">Cómo estudiar este tema</h2>
        <p className="flex items-center gap-2 text-sm text-suave">
          <IconoAnimacion /> Los tres modos incluyen animaciones 3D de las situaciones.
        </p>
        <ul className="grid gap-4 md:grid-cols-3">
          {modos.map(({ href, titulo, texto, detalle, Icono }) => (
            <li key={href}>
              <Link href={href} className="group flex h-full flex-col gap-3 rounded-2xl border border-borde bg-superficie p-5 transition hover:border-primario hover:shadow-md" data-modo={titulo.toLowerCase()}>
                <span className="text-primario">
                  <Icono />
                </span>
                <span className="text-lg font-bold group-hover:text-primario">{titulo}</span>
                <span className="text-sm text-suave">{texto}</span>
                <span className="mt-auto text-xs font-semibold text-suave">{detalle.filter(Boolean).join(" · ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-2xl border border-borde bg-superficie p-5">
        <h2 className="font-bold">Progreso en este tema</h2>
        <ProgresoTema tema={tema.slug} flashcards={tema.flashcards.map((f) => f.id)} escenas={tema.escenas.map((e) => e.id)} />
      </section>
    </div>
  );
}
