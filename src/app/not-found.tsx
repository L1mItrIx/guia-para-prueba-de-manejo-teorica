import { BotonLink } from "@/components/ui/Boton";

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold">Página no encontrada</h1>
      <p className="text-suave">Esta dirección no existe. Desde el inicio se puede elegir un tema.</p>
      <BotonLink href="/">Ir al inicio</BotonLink>
    </div>
  );
}
