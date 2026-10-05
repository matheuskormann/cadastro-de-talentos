import { ambiente } from "@/config/ambiente";
import { clienteHttp } from "@/lib/http/clienteHttp";
import type { Avaliacao, SalvarAvaliacao } from "../types/avaliacao";
import type { CandidatoDetalhe, CandidatoResumo, SalvarCandidato } from "../types/candidato";

const caminhoCandidatos = "/api/candidatos";

export function listarCandidatos() {
  return clienteHttp.obter<CandidatoResumo[]>(caminhoCandidatos);
}

export function obterCandidato(id: string) {
  return clienteHttp.obter<CandidatoDetalhe>(`${caminhoCandidatos}/${id}`);
}

export function cadastrarCandidato(dadosCandidato: SalvarCandidato, arquivoCurriculo?: File | null) {
  if (!arquivoCurriculo) {
    return clienteHttp.enviar<CandidatoDetalhe>(caminhoCandidatos, dadosCandidato);
  }

  const formulario = new FormData();
  formulario.append("dados", JSON.stringify(dadosCandidato));
  formulario.append("curriculo", arquivoCurriculo);

  return clienteHttp.enviar<CandidatoDetalhe>(caminhoCandidatos, formulario);
}

export function atualizarCandidato(id: string, dadosCandidato: SalvarCandidato) {
  return clienteHttp.atualizar<CandidatoDetalhe>(`${caminhoCandidatos}/${id}`, dadosCandidato);
}

export function removerCandidato(id: string) {
  return clienteHttp.remover(`${caminhoCandidatos}/${id}`);
}

export function salvarAvaliacao(candidatoId: string, avaliacao: SalvarAvaliacao) {
  return clienteHttp.atualizar<Avaliacao>(`${caminhoCandidatos}/${candidatoId}/avaliacao`, avaliacao);
}

export function obterUrlCurriculo(candidatoId: string) {
  return `${ambiente.urlApi}${caminhoCandidatos}/${candidatoId}/curriculo`;
}
