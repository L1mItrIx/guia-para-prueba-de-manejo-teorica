import type { Visual } from "@/content/schema";

/** Ilustraciones 2D (SVG) de señales y situaciones. Decorativas: el texto siempre explica lo mismo. */
export function Senal({ tipo, className = "h-28 w-28" }: { tipo: Visual; className?: string }) {
  switch (tipo) {
    case "alto":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="#c8102e" stroke="#fff" strokeWidth="4" />
          <text x="50" y="60" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">
            ALTO
          </text>
        </svg>
      );
    case "ceda":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <polygon points="4,8 96,8 50,94" fill="#c8102e" />
          <polygon points="20,18 80,18 50,74" fill="#fff" />
          <text x="50" y="40" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c8102e" fontFamily="Arial, sans-serif">
            CEDA
          </text>
        </svg>
      );
    case "semaforo":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <rect x="32" y="4" width="36" height="92" rx="8" fill="#222" />
          <circle cx="50" cy="22" r="11" fill="#e53935" />
          <circle cx="50" cy="50" r="11" fill="#fdd835" opacity="0.35" />
          <circle cx="50" cy="78" r="11" fill="#43a047" opacity="0.35" />
        </svg>
      );
    case "rotonda":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <circle cx="50" cy="50" r="46" fill="#1565c0" />
          <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round">
            <path d="M50 22 A28 28 0 0 1 76 58" />
            <path d="M68 76 A28 28 0 0 1 26 64" />
            <path d="M22 44 A28 28 0 0 1 38 25" />
          </g>
          <g fill="#fff">
            <polygon points="78,48 82,64 68,60" />
            <polygon points="30,72 20,60 34,58" />
            <polygon points="34,16 46,24 32,32" />
          </g>
        </svg>
      );
    case "emergencia":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <rect x="8" y="38" width="84" height="40" rx="6" fill="#f5f5f5" stroke="#999" strokeWidth="2" />
          <rect x="8" y="56" width="84" height="6" fill="#c8102e" />
          <rect x="34" y="26" width="14" height="10" rx="2" fill="#e53935" />
          <rect x="52" y="26" width="14" height="10" rx="2" fill="#1e63d6" />
          <circle cx="28" cy="80" r="8" fill="#333" />
          <circle cx="72" cy="80" r="8" fill="#333" />
        </svg>
      );
    case "peaton":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <rect x="4" y="4" width="92" height="92" rx="12" fill="#1565c0" />
          <polygon points="50,12 90,88 10,88" fill="#fff" />
          <circle cx="50" cy="42" r="6" fill="#111" />
          <path d="M50 49 L46 66 L40 80 M47 62 L56 80 M46 55 L38 60 M48 54 L58 60" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "prioridad":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
          <rect x="38" y="0" width="24" height="100" fill="#555" />
          <rect x="0" y="38" width="100" height="24" fill="#555" />
          <rect x="54" y="74" width="7" height="14" rx="2" fill="#d93838" />
          <rect x="74" y="39" width="14" height="7" rx="2" fill="#2f6fdb" />
          <path d="M57 70 L57 56" stroke="#fff" strokeWidth="3" markerEnd="url(#f)" />
          <defs>
            <marker id="f" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#fff" />
            </marker>
          </defs>
        </svg>
      );
  }
}
