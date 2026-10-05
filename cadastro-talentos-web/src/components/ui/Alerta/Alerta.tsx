import type { ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./Alerta.module.css";

type VarianteAlerta = "informacao" | "atencao" | "erro";

interface PropriedadesAlerta {
  variante?: VarianteAlerta;
  titulo?: string;
  children: ReactNode;
}

const classesPorVariante: Record<VarianteAlerta, string> = {
  informacao: styles.informacao,
  atencao: styles.alertaAtencao,
  erro: styles.erro,
};

const iconesPorVariante: Record<VarianteAlerta, string> = {
  informacao: "i",
  atencao: "!",
  erro: "!",
};

export function Alerta({ variante = "informacao", titulo, children }: PropriedadesAlerta) {
  return (
    <div role={variante === "erro" ? "alert" : "status"} className={juntarClasses(styles.alerta, classesPorVariante[variante])}>
      <span aria-hidden="true" className={styles.icone}>
        {iconesPorVariante[variante]}
      </span>
      <div className={styles.conteudo}>
        {titulo && <span className={styles.titulo}>{titulo}</span>}
        <span>{children}</span>
      </div>
    </div>
  );
}
