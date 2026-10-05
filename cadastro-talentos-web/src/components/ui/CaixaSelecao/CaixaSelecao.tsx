import type { ComponentProps } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./CaixaSelecao.module.css";

interface PropriedadesCaixaSelecao extends Omit<ComponentProps<"input">, "type"> {
  rotulo: string;
}

export function CaixaSelecao({ rotulo, className, ...propriedades }: PropriedadesCaixaSelecao) {
  return (
    <label className={juntarClasses(styles.caixa, className)}>
      <input type="checkbox" className={styles.entrada} {...propriedades} />
      {rotulo}
    </label>
  );
}
