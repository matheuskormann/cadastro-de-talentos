import type { AvaliacaoSugerida } from "./avaliacao";
import type { Competencia, ExperienciaProfissional, FormacaoAcademica } from "./candidato";

export type MetodoExtracao = "InteligenciaArtificial" | "Regex";

export interface DadosExtraidosCurriculo {
  nomeCompleto: string | null;
  email: string | null;
  telefone: string | null;
  dataNascimento: string | null;
  dataNascimentoEstimada: boolean;
  idade: number | null;
  cidade: string | null;
  estado: string | null;
  sobre: string | null;
  experiencias: ExperienciaProfissional[];
  formacoes: FormacaoAcademica[];
  competencias: Competencia[];
  avaliacaoSugerida: AvaliacaoSugerida | null;
}

export interface ResultadoExtracaoCurriculo {
  dados: DadosExtraidosCurriculo;
  metodoUtilizado: MetodoExtracao;
  camposNaoIdentificados: string[];
  aviso: string | null;
}
