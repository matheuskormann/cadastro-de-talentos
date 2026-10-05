import type { ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./TituloPagina.module.css";

interface PropriedadesTituloPagina {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  destaque?: boolean;
}

export function TituloPagina({ titulo, descricao, acao, destaque = false }: PropriedadesTituloPagina) {
  return (
    <div className={juntarClasses(styles.titulo, destaque && styles.destaque)}>
      <div className={styles.textos}>
        <h1 className={styles.nome}>{titulo}</h1>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
