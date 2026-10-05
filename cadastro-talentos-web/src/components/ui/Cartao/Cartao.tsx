import type { ReactNode } from "react";
import styles from "./Cartao.module.css";

interface PropriedadesCartao {
  titulo?: string;
  descricao?: string;
  acao?: ReactNode;
  children: ReactNode;
}

export function Cartao({ titulo, descricao, acao, children }: PropriedadesCartao) {
  return (
    <section className={styles.cartao}>
      {titulo && (
        <div className={styles.cabecalho}>
          <div className={styles.textos}>
            <h2 className={styles.titulo}>{titulo}</h2>
            {descricao && <p className={styles.descricao}>{descricao}</p>}
          </div>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}
