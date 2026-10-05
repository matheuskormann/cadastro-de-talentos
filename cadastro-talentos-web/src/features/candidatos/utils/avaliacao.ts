import type { Avaliacao } from "../types/avaliacao";
import type { CandidatoResumo } from "../types/candidato";

export type CandidatoAvaliado = CandidatoResumo & { avaliacao: Avaliacao };

export type CriterioAvaliacao = "notaGeral" | "notaExperiencia" | "notaFormacao" | "notaComunicacao";

export const rotulosCriterio: Record<CriterioAvaliacao, string> = {
  notaGeral: "Nota geral",
  notaExperiencia: "Experiência",
  notaFormacao: "Formação",
  notaComunicacao: "Comunicação",
};

export const criteriosNotas: Exclude<CriterioAvaliacao, "notaGeral">[] = ["notaExperiencia", "notaFormacao", "notaComunicacao"];

export function calcularNotaGeral(...notas: (number | null)[]) {
  if (notas.some((nota) => nota === null)) {
    return null;
  }

  const soma = (notas as number[]).reduce((total, nota) => total + nota, 0);
  return Math.round((soma / notas.length) * 10) / 10;
}

export function possuiAvaliacao(candidato: CandidatoResumo): candidato is CandidatoAvaliado {
  return candidato.avaliacao !== null;
}

export function ordenarPorCriterio(candidatos: CandidatoAvaliado[], criterio: CriterioAvaliacao) {
  return [...candidatos].sort(
    (primeiro, segundo) =>
      segundo.avaliacao[criterio] - primeiro.avaliacao[criterio] ||
      segundo.avaliacao.notaGeral - primeiro.avaliacao.notaGeral ||
      primeiro.nomeCompleto.localeCompare(segundo.nomeCompleto, "pt-BR"),
  );
}

export function calcularPosicoes(candidatosOrdenados: CandidatoAvaliado[], criterio: CriterioAvaliacao) {
  return candidatosOrdenados.map(
    (candidato) => candidatosOrdenados.findIndex((outro) => outro.avaliacao[criterio] === candidato.avaliacao[criterio]) + 1,
  );
}
