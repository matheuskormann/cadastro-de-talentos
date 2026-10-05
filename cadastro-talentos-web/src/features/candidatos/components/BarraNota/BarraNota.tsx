import { juntarClasses } from "@/lib/classes";
import { notaMaxima } from "../../constants/opcoes";
import { formatarNota } from "../../utils/formatacao";
import styles from "./BarraNota.module.css";

type ExibicaoRotulo = "sempre" | "nunca" | "somenteCelular";

interface PropriedadesBarraNota {
  rotulo: string;
  nota: number;
  compacta?: boolean;
  destaque?: boolean;
  exibirRotulo?: ExibicaoRotulo;
}

const classesExibicao: Record<ExibicaoRotulo, string | undefined> = {
  sempre: undefined,
  nunca: styles.semRotulo,
  somenteCelular: styles.rotuloSomenteCelular,
};

export function BarraNota({ rotulo, nota, compacta = false, destaque = false, exibirRotulo = compacta ? "nunca" : "sempre" }: PropriedadesBarraNota) {
  const percentual = Math.min(Math.max(nota / notaMaxima, 0), 1) * 100;

  return (
    <div
      role="meter"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={notaMaxima}
      aria-valuenow={nota}
      className={juntarClasses(styles.barra, compacta && styles.compacta, destaque && styles.destaque, classesExibicao[exibirRotulo])}
    >
      <span className={styles.rotulo}>{rotulo}</span>
      <span className={styles.trilho}>
        <span className={styles.preenchimento} style={{ width: `${percentual}%` }} />
      </span>
      <span className={styles.valor}>{formatarNota(nota)}</span>
    </div>
  );
}
