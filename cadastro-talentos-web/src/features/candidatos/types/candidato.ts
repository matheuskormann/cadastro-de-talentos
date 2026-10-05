import type { Avaliacao, SalvarAvaliacao } from "./avaliacao";

export type OrigemCadastro = "Manual" | "Curriculo";

export type NivelFormacao =
  | "Fundamental"
  | "Medio"
  | "Tecnico"
  | "Tecnologo"
  | "Graduacao"
  | "PosGraduacao"
  | "Mestrado"
  | "Doutorado";

export type TipoCompetencia = "Tecnica" | "Comportamental" | "Idioma";

export type NivelCompetencia = "Basico" | "Intermediario" | "Avancado" | "Fluente";

export interface ExperienciaProfissional {
  empresa: string;
  cargo: string;
  dataInicio: string | null;
  dataFim: string | null;
  empregoAtual: boolean;
  descricao: string | null;
}

export interface FormacaoAcademica {
  instituicao: string;
  curso: string | null;
  nivel: NivelFormacao;
  dataInicio: string | null;
  dataConclusao: string | null;
  emAndamento: boolean;
}

export interface Competencia {
  nome: string;
  tipo: TipoCompetencia;
  nivel: NivelCompetencia | null;
}

interface CurriculoAnexado {
  nomeOriginal: string;
  tamanhoBytes: number;
  dataEnvio: string;
}

export interface CandidatoResumo {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  idade: number | null;
  idadeEstimada: boolean;
  origemCadastro: OrigemCadastro;
  possuiCurriculo: boolean;
  avaliacao: Avaliacao | null;
  dataCadastro: string;
}

export interface CandidatoDetalhe {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
  dataNascimentoEstimada: boolean;
  idade: number | null;
  cidade: string | null;
  estado: string | null;
  sobre: string | null;
  origemCadastro: OrigemCadastro;
  dataCadastro: string;
  dataAtualizacao: string | null;
  experiencias: ExperienciaProfissional[];
  formacoes: FormacaoAcademica[];
  competencias: Competencia[];
  curriculo: CurriculoAnexado | null;
  avaliacao: Avaliacao | null;
}

export interface SalvarCandidato {
  nomeCompleto: string;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
  dataNascimentoEstimada: boolean;
  cidade: string | null;
  estado: string | null;
  sobre: string | null;
  experiencias: ExperienciaProfissional[];
  formacoes: FormacaoAcademica[];
  competencias: Competencia[];
  avaliacao?: SalvarAvaliacao | null;
}
