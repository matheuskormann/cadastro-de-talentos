import type { ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./Etiqueta.module.css";

type VarianteEtiqueta = "destaque" | "primaria" | "neutra" | "escura" | "alerta";
type TamanhoEtiqueta = "medio" | "pequeno";

interface PropriedadesEtiqueta {
  variante?: VarianteEtiqueta;
  tamanho?: TamanhoEtiqueta;
  children: ReactNode;
}

export function Etiqueta({ variante = "neutra", tamanho = "medio", children }: PropriedadesEtiqueta) {
  return <span className={juntarClasses(styles.etiqueta, styles[variante], styles[tamanho])}>{children}</span>;
}
