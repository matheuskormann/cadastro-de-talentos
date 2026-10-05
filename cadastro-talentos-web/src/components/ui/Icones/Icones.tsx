import type { SVGProps } from "react";

type PropriedadesIcone = SVGProps<SVGSVGElement>;

const propriedadesBase: PropriedadesIcone = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconeEmail(propriedades: PropriedadesIcone) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" {...propriedadesBase} {...propriedades}>
      <rect x="2" y="4" width="14" height="10.5" rx="2" />
      <path d="M2.5 5l6.5 5 6.5-5" />
    </svg>
  );
}

export function IconeTelefone(propriedades: PropriedadesIcone) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" {...propriedadesBase} {...propriedades}>
      <path d="M4 2.5h2.5l1.2 3.2-1.6 1.1a8 8 0 004.1 4.1l1.1-1.6 3.2 1.2V13a2 2 0 01-2 2A11.5 11.5 0 012 4.5a2 2 0 012-2z" />
    </svg>
  );
}

export function IconeCopiar(propriedades: PropriedadesIcone) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" {...propriedadesBase} {...propriedades}>
      <rect x="6" y="6" width="9.5" height="9.5" rx="2" />
      <path d="M12 6V4.5a2 2 0 00-2-2H4.5a2 2 0 00-2 2V10a2 2 0 002 2H6" />
    </svg>
  );
}

export function IconeBusca(propriedades: PropriedadesIcone) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...propriedadesBase} strokeWidth={1.7} {...propriedades}>
      <circle cx="7" cy="7" r="5.2" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  );
}

export function IconeAvancar(propriedades: PropriedadesIcone) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" {...propriedadesBase} strokeWidth={1.8} {...propriedades}>
      <path d="M1.5 1.5L6.5 7l-5 5.5" />
    </svg>
  );
}
