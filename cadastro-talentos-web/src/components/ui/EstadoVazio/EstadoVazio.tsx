import type { ReactNode } from "react";
import styles from "./EstadoVazio.module.css";

interface PropriedadesEstadoVazio {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

export function EstadoVazio({ titulo, descricao, acao }: PropriedadesEstadoVazio) {
  return (
    <div className={styles.estado}>
      <p className={styles.titulo}>{titulo}</p>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {acao && <div className={styles.acao}>{acao}</div>}
    </div>
  );
}
