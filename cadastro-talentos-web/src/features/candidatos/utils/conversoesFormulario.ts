import type { ErrosPorCampo } from "@/lib/http/ErroApi";
import { opcoesEstado } from "../constants/opcoes";
import type {
  AvaliacaoFormulario,
  CompetenciaFormulario,
  ExperienciaFormulario,
  FormacaoFormulario,
  ValoresFormularioCandidato,
} from "../schemas/esquemaCandidato";
import type { Avaliacao, AvaliacaoSugerida } from "../types/avaliacao";
import type { CandidatoDetalhe, NivelFormacao, SalvarCandidato } from "../types/candidato";
import type { DadosExtraidosCurriculo } from "../types/curriculo";
import { formatarTelefone } from "./formatacao";

export type CampoExtraivel = "nomeCompleto" | "email" | "telefone" | "dataNascimento" | "cidade" | "estado" | "sobre";

const camposExtraiveis: CampoExtraivel[] = ["nomeCompleto", "email", "telefone", "dataNascimento", "cidade", "estado", "sobre"];

const avaliacaoVazia: AvaliacaoFormulario = {
  incluir: false,
  notaExperiencia: null,
  notaFormacao: null,
  notaComunicacao: null,
  comentario: "",
  sugeridaPorIa: false,
};

export const valoresIniciaisCandidato: ValoresFormularioCandidato = {
  nomeCompleto: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  dataNascimentoEstimada: false,
  cidade: "",
  estado: null,
  sobre: "",
  experiencias: [],
  formacoes: [],
  competencias: [],
  avaliacao: avaliacaoVazia,
};

export function criarExperienciaVazia(): ExperienciaFormulario {
  return { empresa: "", cargo: "", dataInicio: "", dataFim: "", empregoAtual: false, descricao: "" };
}

export function criarFormacaoVazia(): FormacaoFormulario {
  return { instituicao: "", curso: "", nivel: null, dataInicio: "", dataConclusao: "", emAndamento: false };
}

export function criarCompetenciaVazia(): CompetenciaFormulario {
  return { nome: "", tipo: "Tecnica", nivel: null };
}

function paraMes(data: string | null) {
  return data ? data.slice(0, 7) : "";
}

function deMes(mes: string) {
  return mes ? `${mes}-01` : null;
}

function textoOuNulo(texto: string | undefined) {
  const textoLimpo = texto?.trim() ?? "";
  return textoLimpo.length > 0 ? textoLimpo : null;
}

function converterExperiencias(experiencias: DadosExtraidosCurriculo["experiencias"]): ExperienciaFormulario[] {
  return experiencias.map((experiencia) => ({
    empresa: experiencia.empresa,
    cargo: experiencia.cargo,
    dataInicio: paraMes(experiencia.dataInicio),
    dataFim: paraMes(experiencia.dataFim),
    empregoAtual: experiencia.empregoAtual,
    descricao: experiencia.descricao ?? "",
  }));
}

function converterFormacoes(formacoes: DadosExtraidosCurriculo["formacoes"]): FormacaoFormulario[] {
  return formacoes.map((formacao) => ({
    instituicao: formacao.instituicao,
    curso: formacao.curso ?? "",
    nivel: formacao.nivel,
    dataInicio: paraMes(formacao.dataInicio),
    dataConclusao: paraMes(formacao.dataConclusao),
    emAndamento: formacao.emAndamento,
  }));
}

function converterAvaliacao(avaliacao: Avaliacao | AvaliacaoSugerida, sugeridaPorIa: boolean): AvaliacaoFormulario {
  return {
    incluir: true,
    notaExperiencia: avaliacao.notaExperiencia,
    notaFormacao: avaliacao.notaFormacao,
    notaComunicacao: avaliacao.notaComunicacao,
    comentario: avaliacao.comentario ?? "",
    sugeridaPorIa,
  };
}

export function converterDetalheParaFormulario(candidato: CandidatoDetalhe): ValoresFormularioCandidato {
  return {
    nomeCompleto: candidato.nomeCompleto,
    email: candidato.email,
    telefone: candidato.telefone ? formatarTelefone(candidato.telefone) : "",
    dataNascimento: candidato.dataNascimento ?? "",
    dataNascimentoEstimada: candidato.dataNascimentoEstimada,
    cidade: candidato.cidade ?? "",
    estado: candidato.estado,
    sobre: candidato.sobre ?? "",
    experiencias: converterExperiencias(candidato.experiencias),
    formacoes: converterFormacoes(candidato.formacoes),
    competencias: candidato.competencias.map((competencia) => ({ ...competencia })),
    avaliacao: candidato.avaliacao ? converterAvaliacao(candidato.avaliacao, candidato.avaliacao.sugeridaPorIa) : avaliacaoVazia,
  };
}

export function mesclarDadosExtraidos(valoresAtuais: ValoresFormularioCandidato, dados: DadosExtraidosCurriculo) {
  const valoresExtraidos: Record<CampoExtraivel, string | null> = {
    nomeCompleto: dados.nomeCompleto,
    email: dados.email,
    telefone: dados.telefone ? formatarTelefone(dados.telefone) : null,
    dataNascimento: dados.dataNascimento,
    cidade: dados.cidade,
    estado: opcoesEstado.some((opcao) => opcao.valor === dados.estado) ? dados.estado : null,
    sobre: dados.sobre,
  };

  const camposPreenchidos = camposExtraiveis.filter((campo) => valoresExtraidos[campo] && !valoresAtuais[campo]);
  const valoresMesclados: ValoresFormularioCandidato = { ...valoresAtuais };

  for (const campo of camposPreenchidos) {
    Object.assign(valoresMesclados, { [campo]: valoresExtraidos[campo] });
  }

  if (camposPreenchidos.includes("dataNascimento")) {
    valoresMesclados.dataNascimentoEstimada = dados.dataNascimentoEstimada;
  }

  if (valoresAtuais.experiencias.length === 0) {
    valoresMesclados.experiencias = converterExperiencias(dados.experiencias);
  }

  if (valoresAtuais.formacoes.length === 0) {
    valoresMesclados.formacoes = converterFormacoes(dados.formacoes);
  }

  if (valoresAtuais.competencias.length === 0) {
    valoresMesclados.competencias = dados.competencias.map((competencia) => ({ ...competencia }));
  }

  if (dados.avaliacaoSugerida && !valoresAtuais.avaliacao.incluir) {
    valoresMesclados.avaliacao = converterAvaliacao(dados.avaliacaoSugerida, true);
  }

  return { valoresMesclados, camposPreenchidos };
}

export function converterFormularioParaEnvio(valores: ValoresFormularioCandidato): SalvarCandidato {
  const { avaliacao } = valores;

  return {
    nomeCompleto: valores.nomeCompleto.trim(),
    email: valores.email.trim(),
    telefone: textoOuNulo(valores.telefone),
    dataNascimento: valores.dataNascimento || null,
    dataNascimentoEstimada: Boolean(valores.dataNascimento) && valores.dataNascimentoEstimada,
    cidade: textoOuNulo(valores.cidade),
    estado: valores.estado,
    sobre: textoOuNulo(valores.sobre),
    experiencias: valores.experiencias.map((experiencia) => ({
      empresa: experiencia.empresa.trim(),
      cargo: experiencia.cargo.trim(),
      dataInicio: deMes(experiencia.dataInicio),
      dataFim: experiencia.empregoAtual ? null : deMes(experiencia.dataFim),
      empregoAtual: experiencia.empregoAtual,
      descricao: textoOuNulo(experiencia.descricao),
    })),
    formacoes: valores.formacoes.map((formacao) => ({
      instituicao: formacao.instituicao.trim(),
      curso: textoOuNulo(formacao.curso),
      nivel: formacao.nivel as NivelFormacao,
      dataInicio: deMes(formacao.dataInicio),
      dataConclusao: formacao.emAndamento ? null : deMes(formacao.dataConclusao),
      emAndamento: formacao.emAndamento,
    })),
    competencias: valores.competencias.map((competencia) => ({
      nome: competencia.nome.trim(),
      tipo: competencia.tipo,
      nivel: competencia.nivel,
    })),
    avaliacao: avaliacao.incluir
      ? {
          notaExperiencia: avaliacao.notaExperiencia ?? 0,
          notaFormacao: avaliacao.notaFormacao ?? 0,
          notaComunicacao: avaliacao.notaComunicacao ?? 0,
          comentario: textoOuNulo(avaliacao.comentario),
          sugeridaPorIa: avaliacao.sugeridaPorIa,
        }
      : null,
  };
}

function converterCaminhoErroApi(caminho: string) {
  return caminho.replace(/\[(\d+)\]/g, ".$1");
}

export function separarErrosApi(errosPorCampo: ErrosPorCampo) {
  const { curriculo, dados, ...errosFormulario } = errosPorCampo;

  return {
    erroCurriculo: curriculo?.[0],
    erroDados: dados?.[0],
    errosFormulario: Object.entries(errosFormulario).map(([caminho, mensagens]) => ({
      caminho: converterCaminhoErroApi(caminho),
      mensagem: mensagens[0],
    })),
  };
}
