export const rotas = {
  candidatos: "/candidatos",
  novoCandidato: "/candidatos/novo",
  ranking: "/ranking",
  detalheCandidato: (id: string) => `/candidatos?candidato=${id}`,
  editarCandidato: (id: string) => `/candidatos/${id}/editar`,
} as const;
