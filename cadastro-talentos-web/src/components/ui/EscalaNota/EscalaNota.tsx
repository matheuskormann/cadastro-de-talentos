"use client";

import { useId, type KeyboardEvent } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./EscalaNota.module.css";

interface PropriedadesEscalaNota {
  rotulo: string;
  valor: number | null;
  aoAlterar: (valor: number) => void;
  erro?: string;
}

const minimo = 0;
const maximo = 10;

export function EscalaNota({ rotulo, valor, aoAlterar, erro }: PropriedadesEscalaNota) {
  const idRotulo = useId();
  const notas = Array.from({ length: maximo - minimo + 1 }, (_, indice) => minimo + indice);

  function tratarTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    const atual = valor ?? minimo - 1;
    const novoValor =
      evento.key === "ArrowRight" || evento.key === "ArrowUp"
        ? Math.min(atual + 1, maximo)
        : evento.key === "ArrowLeft" || evento.key === "ArrowDown"
          ? Math.max(atual - 1, minimo)
          : null;

    if (novoValor === null) {
      return;
    }

    evento.preventDefault();
    aoAlterar(novoValor);
    evento.currentTarget.querySelector<HTMLButtonElement>(`[data-nota="${novoValor}"]`)?.focus();
  }

  return (
    <div className={styles.escala}>
      <div className={styles.cabecalho}>
        <span id={idRotulo} className={styles.rotulo}>
          {rotulo}
        </span>
        <span className={styles.valorAtual}>{valor ?? "—"}</span>
      </div>
      <div role="radiogroup" aria-labelledby={idRotulo} className={styles.opcoes} onKeyDown={tratarTeclado}>
        {notas.map((nota) => {
          const selecionada = nota === valor;
          const tabulavel = selecionada || (valor === null && nota === minimo);

          return (
            <button
              key={nota}
              type="button"
              role="radio"
              aria-checked={selecionada}
              tabIndex={tabulavel ? 0 : -1}
              data-nota={nota}
              className={juntarClasses(
                styles.opcao,
                valor !== null && nota < valor && styles.preenchida,
                selecionada && styles.selecionada,
              )}
              onClick={() => aoAlterar(nota)}
            >
              {nota}
            </button>
          );
        })}
      </div>
      {erro && (
        <span role="alert" className={styles.erro}>
          {erro}
        </span>
      )}
    </div>
  );
}
