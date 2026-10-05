import { z } from "zod";
import { notaMaxima, notaMinima, opcoesEstado } from "../constants/opcoes";

const padraoEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const padraoTelefone = /^[\d\s()+-]{8,20}$/;
const siglasEstado = opcoesEstado.map((opcao) => opcao.valor);

const niveisFormacao = ["Fundamental", "Medio", "Tecnico", "Tecnologo", "Graduacao", "PosGraduacao", "Mestrado", "Doutorado"] as const;
const tiposCompetencia = ["Tecnica", "Comportamental", "Idioma"] as const;
const niveisCompetencia = ["Basico", "Intermediario", "Avancado", "Fluente"] as const;

function obterDataAtual() {
  return new Date().toISOString().slice(0, 10);
}

function textoLimitado(tamanhoMaximo: number, nomeCampo: string) {
  return z.string().trim().max(tamanhoMaximo, `${nomeCampo} deve ter no máximo ${tamanhoMaximo} caracteres.`);
}

function textoObrigatorio(tamanhoMaximo: number, mensagemObrigatorio: string, nomeCampo: string) {
  return textoLimitado(tamanhoMaximo, nomeCampo).min(1, mensagemObrigatorio);
}

function periodoValido(inicio: string, fim: string, emAberto: boolean) {
  return emAberto || !inicio || !fim || fim >= inicio;
}

const esquemaExperiencia = z
  .object({
    empresa: textoObrigatorio(150, "A empresa é obrigatória.", "A empresa"),
    cargo: textoObrigatorio(100, "O cargo é obrigatório.", "O cargo"),
    dataInicio: z.string(),
    dataFim: z.string(),
    empregoAtual: z.boolean(),
    descricao: textoLimitado(1000, "A descrição"),
  })
  .refine((experiencia) => periodoValido(experiencia.dataInicio, experiencia.dataFim, experiencia.empregoAtual), {
    message: "A data de saída não pode ser anterior à data de início.",
    path: ["dataFim"],
  });

const esquemaFormacao = z
  .object({
    instituicao: textoObrigatorio(150, "A instituição é obrigatória.", "A instituição"),
    curso: textoLimitado(150, "O curso"),
    nivel: z.enum(niveisFormacao).nullable().refine((nivel) => nivel !== null, "Selecione o nível da formação."),
    dataInicio: z.string(),
    dataConclusao: z.string(),
    emAndamento: z.boolean(),
  })
  .refine((formacao) => periodoValido(formacao.dataInicio, formacao.dataConclusao, formacao.emAndamento), {
    message: "A data de conclusão não pode ser anterior à data de início.",
    path: ["dataConclusao"],
  });

const esquemaCompetencia = z.object({
  nome: textoObrigatorio(100, "Informe a competência.", "A competência"),
  tipo: z.enum(tiposCompetencia),
  nivel: z.enum(niveisCompetencia).nullable(),
});

const esquemaNota = z.number().int().min(notaMinima).max(notaMaxima).nullable();

const esquemaAvaliacao = z
  .object({
    incluir: z.boolean(),
    notaExperiencia: esquemaNota,
    notaFormacao: esquemaNota,
    notaComunicacao: esquemaNota,
    comentario: textoLimitado(2000, "O comentário"),
    sugeridaPorIa: z.boolean(),
  })
  .superRefine((avaliacao, contexto) => {
    if (!avaliacao.incluir) {
      return;
    }

    const notas = ["notaExperiencia", "notaFormacao", "notaComunicacao"] as const;

    for (const nota of notas) {
      if (avaliacao[nota] === null) {
        contexto.addIssue({ code: "custom", message: "Selecione uma nota de 0 a 10.", path: [nota] });
      }
    }
  });

export const esquemaCandidato = z.object({
  nomeCompleto: textoObrigatorio(150, "O nome completo é obrigatório.", "O nome completo"),
  email: textoObrigatorio(254, "O e-mail é obrigatório.", "O e-mail").regex(padraoEmail, "Informe um e-mail em formato válido."),
  telefone: z
    .string()
    .trim()
    .refine((telefone) => !telefone || padraoTelefone.test(telefone), "Informe um telefone válido."),
  dataNascimento: z
    .string()
    .refine((data) => !data || data <= obterDataAtual(), "A data de nascimento não pode ser futura.")
    .refine((data) => !data || data > "1900-01-01", "Informe uma data de nascimento válida."),
  dataNascimentoEstimada: z.boolean(),
  cidade: textoLimitado(100, "A cidade"),
  estado: z
    .string()
    .nullable()
    .refine((estado) => estado === null || siglasEstado.includes(estado), "Informe uma UF válida."),
  sobre: textoLimitado(2000, "O campo sobre"),
  experiencias: z.array(esquemaExperiencia),
  formacoes: z.array(esquemaFormacao),
  competencias: z.array(esquemaCompetencia),
  avaliacao: esquemaAvaliacao,
});

export type ValoresFormularioCandidato = z.input<typeof esquemaCandidato>;
export type ExperienciaFormulario = ValoresFormularioCandidato["experiencias"][number];
export type FormacaoFormulario = ValoresFormularioCandidato["formacoes"][number];
export type CompetenciaFormulario = ValoresFormularioCandidato["competencias"][number];
export type AvaliacaoFormulario = ValoresFormularioCandidato["avaliacao"];
