import Link from "next/link";
import { LICENCIAS } from "@/content/licencias";
import { EXAMEN } from "@/content/examen";

function IconoCarro() {
  return (
    <svg viewBox="0 0 64 40" className="h-14 w-20" aria-hidden>
      <path d="M8 26 L12 14 Q14 9 20 9 H42 Q48 9 51 14 L56 22 Q60 23 60 28 V31 H4 V29 Q4 26 8 26 Z" fill="currentColor" />
      <path d="M17 15 Q18 12 21 12 H30 V21 H14 Z M33 12 H41 Q45 12 47 16 L49 21 H33 Z" fill="var(--superficie)" opacity=".85" />
      <circle cx="16" cy="31" r="6" fill="#222" stroke="var(--superficie)" strokeWidth="2" />
      <circle cx="48" cy="31" r="6" fill="#222" stroke="var(--superficie)" strokeWidth="2" />
    </svg>
  );
}

function IconoMoto() {
  return (
    <svg viewBox="0 0 64 40" className="h-14 w-20" aria-hidden>
      <circle cx="14" cy="28" r="9" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="28" r="9" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M14 28 L26 16 H40 L50 28 M34 16 L30 8 H22 M40 16 L44 10 H50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Inicio() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="inline-block rounded-full bg-aviso-fondo px-3 py-1 text-xs font-semibold">Actualizado a 2026 · Gratis · Sin cuentas</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Pasá la prueba teórica de manejo a la primera</h1>
        <p className="max-w-2xl text-lg text-suave">
          Resúmenes, quizzes, flashcards, presentaciones y escenas 3D interactivas con la Ley de Tránsito vigente en Costa Rica.
          Practicá con un simulacro de {EXAMEN.preguntas} preguntas: se aprueba con {EXAMEN.notaMinima}.
        </p>
      </section>

      <section aria-labelledby="elige" className="space-y-4">
        <h2 id="elige" className="text-xl font-bold">¿Para qué licencia te estás preparando?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LICENCIAS.map((l) => {
            const contenido = (
              <>
                <span className={l.disponible ? "text-primario" : "text-suave"}>{l.slug === "carro" ? <IconoCarro /> : <IconoMoto />}</span>
                <span className="flex items-center gap-2 text-2xl font-extrabold">
                  {l.nombre}
                  {!l.disponible && <span className="rounded-full bg-superficie-2 px-2 py-0.5 text-xs font-semibold text-suave">Próximamente</span>}
                </span>
                <span className="text-sm text-suave">{l.descripcion}</span>
              </>
            );
            const clases = "flex flex-col items-start gap-2 rounded-2xl border-2 p-6 text-left transition";
            return l.disponible ? (
              <Link key={l.id} href={`/${l.slug}/`} className={`${clases} border-primario bg-superficie hover:shadow-lg`} data-licencia={l.slug}>
                {contenido}
                <span className="mt-2 font-semibold text-primario">Empezar →</span>
              </Link>
            ) : (
              <div key={l.id} className={`${clases} border-dashed border-borde bg-superficie-2`} aria-disabled="true" data-licencia={l.slug}>
                {contenido}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["45,9 %", "de quienes se matricularon aprobó el teórico de carro con los manuales nuevos (DGEV, junio 2026)."],
          ["70", "es la nota mínima para aprobar. Practicá hasta superarla con margen."],
          ["0 cuentas", "Tu progreso se guarda en tu navegador. Nadie te pide datos."],
        ].map(([dato, texto]) => (
          <div key={dato} className="rounded-2xl bg-superficie p-5">
            <p className="text-3xl font-extrabold text-primario">{dato}</p>
            <p className="mt-1 text-sm text-suave">{texto}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
