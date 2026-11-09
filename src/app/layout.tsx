import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { ProveedorProgreso } from "@/components/ProveedorProgreso";

export const metadata: Metadata = {
  title: { default: "Teórico CR — Prepárate para la prueba teórica de manejo 2026", template: "%s · Teórico CR" },
  description:
    "Estudia gratis para la prueba teórica de manejo de Costa Rica: resúmenes, quizzes, flashcards, presentaciones, escenas 3D y simulacro, con la Ley de Tránsito 9078 y las multas vigentes en 2026.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b3d91" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1020" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CR">
      <body className="min-h-dvh antialiased">
        <ProveedorProgreso>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-superficie focus:p-3">
            Saltar al contenido
          </a>
          <header className="sticky top-0 z-40 border-b border-borde bg-superficie/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                <span aria-hidden className="flex h-7 w-10 flex-col overflow-hidden rounded-md border border-borde">
                  <span className="h-1/5 bg-[#0b3d91]" />
                  <span className="h-1/5 bg-white" />
                  <span className="h-2/5 bg-[#ce1126]" />
                  <span className="h-1/5 bg-white" />
                </span>
                <span>Teórico CR</span>
              </Link>
              <nav aria-label="Principal" className="flex items-center gap-1 text-sm font-medium">
                <Link href="/carro/" className="rounded-lg px-3 py-2 hover:bg-superficie-2">Temas</Link>
                <Link href="/progreso/" className="rounded-lg px-3 py-2 hover:bg-superficie-2">Mi progreso</Link>
              </nav>
            </div>
          </header>
          <main id="contenido" className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
            {children}
          </main>
          <footer className="border-t border-borde">
            <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-xs text-suave">
              <p>
                Sitio gratuito e independiente. No está afiliado al MOPT, al COSEVI ni a la Dirección General de Educación Vial.
                El contenido se basa en la Ley de Tránsito N.º 9078 vigente y en las multas que rigen desde enero de 2026.
              </p>
              <p>
                <Link href="/fuentes/" className="underline underline-offset-2 hover:text-primario">Fuentes y fecha de verificación</Link>
                {" · "}Tu progreso se guarda solo en este navegador: no hay cuentas.
              </p>
            </div>
          </footer>
        </ProveedorProgreso>
      </body>
    </html>
  );
}
