import Link from "next/link";

export function Migas({ items }: { items: { href?: string; texto: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-suave">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>›</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-primario hover:underline">
                {it.texto}
              </Link>
            ) : (
              <span aria-current="page" className="text-texto">
                {it.texto}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
