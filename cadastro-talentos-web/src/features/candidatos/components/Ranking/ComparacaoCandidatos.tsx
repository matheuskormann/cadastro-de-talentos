import type { CSSProperties } from "react";
import { Botao } from "@/components/ui/Botao/Botao";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import { Etiqueta } from "@/components/ui/Etiqueta/Etiqueta";
import { juntarClasses } from "@/lib/classes";
import type { CandidatoAvaliado } from "../../utils/avaliacao";
import { criteriosNotas, rotulosCriterio, type CriterioAvaliacao } from "../../utils/avaliacao";
import { formatarLocalizacao } from "../../utils/formatacao";
import { BarraNota } from "../BarraNota/BarraNota";
import styles from "./Ranking.module.css";

interface PropriedadesComparacaoCandidatos {
  candidatos: CandidatoAvaliado[];
  aoLimpar: () => void;
}

const criteriosComparados: CriterioAvaliacao[] = ["notaGeral", ...criteriosNotas];

export function ComparacaoCandidatos({ candidatos, aoLimpar }: PropriedadesComparacaoCandidatos) {
  const maioresNotas = Object.fromEntries(
    criteriosComparados.map((criterio) => [criterio, Math.max(...candidatos.map((candidato) => candidato.avaliacao[criterio]))]),
  ) as Record<CriterioAvaliacao, number>;

  return (
    <Cartao
      titulo="Comparação"
      descricao="A maior nota de cada critério aparece em destaque."
      acao={
        <Botao variante="texto" tamanho="pequeno" onClick={aoLimpar}>
          Limpar seleção
        </Botao>
      }
    >
      <div className={styles.comparacao} style={{ "--colunas-comparacao": candidatos.length } as CSSProperties}>
        <span className={styles.cantoComparacao} />
        {candidatos.map((candidato) => (
          <div key={candidato.id} className={juntarClasses(styles.comparacaoCandidato, styles.cabecalhoComparacao)}>
            <span className={styles.nome}>{candidato.nomeCompleto}</span>
            <span className={styles.detalhe}>{formatarLocalizacao(candidato.cidade, candidato.estado) ?? "—"}</span>
          </div>
        ))}

        {criteriosComparados.map((criterio) => (
          <ComparacaoLinha key={criterio} criterio={criterio} candidatos={candidatos} maiorNota={maioresNotas[criterio]} />
        ))}
      </div>
    </Cartao>
  );
}

interface PropriedadesComparacaoLinha {
  criterio: CriterioAvaliacao;
  candidatos: CandidatoAvaliado[];
  maiorNota: number;
}

function ComparacaoLinha({ criterio, candidatos, maiorNota }: PropriedadesComparacaoLinha) {
  return (
    <>
      <span className={styles.comparacaoRotulo}>{rotulosCriterio[criterio]}</span>
      {candidatos.map((candidato) => {
        const nota = candidato.avaliacao[criterio];
        const melhor = nota === maiorNota;

        return (
          <div key={candidato.id} className={styles.comparacaoCelula}>
            <span className={styles.comparacaoNomeCelular}>{candidato.nomeCompleto}</span>
            <BarraNota compacta rotulo={`${rotulosCriterio[criterio]} de ${candidato.nomeCompleto}`} nota={nota} destaque={melhor} />
            {melhor && candidatos.length > 1 && (
              <Etiqueta variante="destaque" tamanho="pequeno">
                Maior nota
              </Etiqueta>
            )}
          </div>
        );
      })}
    </>
  );
}
