export interface Avaliacao {
  notaExperiencia: number;
  notaFormacao: number;
  notaComunicacao: number;
  notaGeral: number;
  comentario: string | null;
  sugeridaPorIa: boolean;
  dataAtualizacao: string;
}

export interface SalvarAvaliacao {
  notaExperiencia: number;
  notaFormacao: number;
  notaComunicacao: number;
  comentario: string | null;
  sugeridaPorIa: boolean;
}

export interface AvaliacaoSugerida {
  notaExperiencia: number;
  notaFormacao: number;
  notaComunicacao: number;
  comentario: string | null;
}
