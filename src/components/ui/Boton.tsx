import Link from "next/link";
import type { ComponentProps } from "react";

type Variante = "primario" | "secundario" | "fantasma";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 min-h-11";
const VARIANTES: Record<Variante, string> = {
  primario: "bg-primario text-primario-texto hover:opacity-90",
  secundario: "border border-borde bg-superficie text-texto hover:bg-superficie-2",
  fantasma: "text-primario hover:bg-superficie-2",
};

export function clasesBoton(variante: Variante = "primario", extra = "") {
  return `${BASE} ${VARIANTES[variante]} ${extra}`;
}

export function Boton({ variante = "primario", className = "", ...props }: ComponentProps<"button"> & { variante?: Variante }) {
  return <button type="button" className={clasesBoton(variante, className)} {...props} />;
}

export function BotonLink({ variante = "primario", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={clasesBoton(variante, className)} {...props} />;
}
