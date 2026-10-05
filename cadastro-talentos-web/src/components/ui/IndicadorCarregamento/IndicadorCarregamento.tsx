import styles from "./IndicadorCarregamento.module.css";

interface PropriedadesIndicadorCarregamento {
  mensagem?: string;
}

export function IndicadorCarregamento({ mensagem }: PropriedadesIndicadorCarregamento) {
  const indicador = <span aria-hidden="true" className={styles.indicador} />;

  if (!mensagem) {
    return indicador;
  }

  return (
    <div role="status" className={styles.centralizado}>
      {indicador}
      <span>{mensagem}</span>
    </div>
  );
}
