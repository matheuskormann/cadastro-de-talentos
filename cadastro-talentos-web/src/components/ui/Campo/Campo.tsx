import type { ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./Campo.module.css";

interface PropriedadesCampo {
  rotulo: string;
  idControle: string;
  obrigatorio?: boolean;
  erro?: string;
  etiqueta?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function obterIdErro(idControle: string) {
  return `${idControle}-erro`;
}

export function obterClassesControle(erro?: string, destacado?: boolean, classeExtra?: string) {
  return juntarClasses(styles.controle, destacado && styles.destacado, erro && styles.invalido, classeExtra);
}

export function Campo({ rotulo, idControle, obrigatorio, erro, etiqueta, className, children }: PropriedadesCampo) {
  return (
    <div className={juntarClasses(styles.campo, className)}>
      <label htmlFor={idControle} className={styles.rotulo}>
        {rotulo}
        {obrigatorio && " *"}
        {etiqueta}
      </label>
      {children}
      {erro && (
        <span id={obterIdErro(idControle)} role="alert" className={styles.erro}>
          {erro}
        </span>
      )}
    </div>
  );
}

export { styles as estilosCampo };
