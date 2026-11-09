import type { ComponentProps } from "react";

export function Tarjeta({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-2xl border border-borde bg-superficie p-5 shadow-sm ${className}`} {...props} />;
}
