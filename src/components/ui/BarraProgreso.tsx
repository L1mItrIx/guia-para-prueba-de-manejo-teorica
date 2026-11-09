export function BarraProgreso({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  const v = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-suave">
        <span>{etiqueta}</span>
        <span>{v} %</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-superficie-2" role="progressbar" aria-label={etiqueta} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primario transition-[width] duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
