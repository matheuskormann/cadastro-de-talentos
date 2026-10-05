import type { Opcao } from "@/components/ui/Select/Select";
import type { NivelCompetencia, NivelFormacao, OrigemCadastro, TipoCompetencia } from "../types/candidato";
import type { MetodoExtracao } from "../types/curriculo";

export const rotulosNivelFormacao: Record<NivelFormacao, string> = {
  Fundamental: "Ensino fundamental",
  Medio: "Ensino médio",
  Tecnico: "Técnico",
  Tecnologo: "Tecnólogo",
  Graduacao: "Graduação",
  PosGraduacao: "Pós-graduação / MBA",
  Mestrado: "Mestrado",
  Doutorado: "Doutorado",
};

export const rotulosTipoCompetencia: Record<TipoCompetencia, string> = {
  Tecnica: "Técnica",
  Comportamental: "Comportamental",
  Idioma: "Idioma",
};

export const rotulosNivelCompetencia: Record<NivelCompetencia, string> = {
  Basico: "Básico",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
  Fluente: "Fluente",
};

export const rotulosOrigemCadastro: Record<OrigemCadastro, string> = {
  Manual: "Cadastro manual",
  Curriculo: "Currículo em PDF",
};

export const rotulosMetodoExtracao: Record<MetodoExtracao, string> = {
  InteligenciaArtificial: "Inteligência artificial",
  Regex: "Regras automáticas",
};

function criarOpcoes<Valor extends string>(rotulos: Record<Valor, string>): Opcao<Valor>[] {
  return (Object.keys(rotulos) as Valor[]).map((valor) => ({ valor, rotulo: rotulos[valor] }));
}

export const opcoesNivelFormacao = criarOpcoes(rotulosNivelFormacao);
export const opcoesTipoCompetencia = criarOpcoes(rotulosTipoCompetencia);
export const opcoesNivelCompetencia = criarOpcoes(rotulosNivelCompetencia);

const unidadesFederativas = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const opcoesEstado: Opcao[] = unidadesFederativas.map((sigla) => ({ valor: sigla, rotulo: sigla }));

export const notaMinima = 0;
export const notaMaxima = 10;
export const tamanhoMaximoCurriculoBytes = 5 * 1024 * 1024;
