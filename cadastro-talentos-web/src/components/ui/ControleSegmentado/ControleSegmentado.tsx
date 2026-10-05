"use client";

import { juntarClasses } from "@/lib/classes";
import type { Opcao } from "../Select/Select";
import styles from "./ControleSegmentado.module.css";

interface PropriedadesControleSegmentado<Valor extends string> {
  opcoes: Opcao<Valor>[];
  valor: Valor;
  aoAlterar: (valor: Valor) => void;
  rotuloAcessivel: string;
}

export function ControleSegmentado<Valor extends string>({ opcoes, valor, aoAlterar, rotuloAcessivel }: PropriedadesControleSegmentado<Valor>) {
  return (
    <div role="radiogroup" aria-label={rotuloAcessivel} className={styles.trilho}>
      {opcoes.map((opcao) => {
        const selecionado = opcao.valor === valor;

        return (
          <button
            key={opcao.valor}
            type="button"
            role="radio"
            aria-checked={selecionado}
            className={juntarClasses(styles.segmento, selecionado && styles.selecionado)}
            onClick={() => aoAlterar(opcao.valor)}
          >
            {opcao.rotulo}
          </button>
        );
      })}
    </div>
  );
}

export { styles as estilosControleSegmentado };
