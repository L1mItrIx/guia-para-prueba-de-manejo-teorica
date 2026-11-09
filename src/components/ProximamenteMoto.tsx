import { BotonLink } from "@/components/ui/Boton";

export function ProximamenteMoto() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-10 text-center">
      <h1 className="text-3xl font-extrabold">Moto: próximamente</h1>
      <p className="text-suave">
        Desde marzo de 2026 la prueba de motocicleta usa su propio manual. Estamos preparando el contenido específico para la licencia A.
        Mientras tanto, el material de carro te sirve para repasar las normas generales de la Ley de Tránsito.
      </p>
      <BotonLink href="/carro/">Ver temas de carro</BotonLink>
    </div>
  );
}
