using cadastroTalentos.Application.Dtos.Avaliacoes;

namespace cadastroTalentos.Application.Dtos.Candidatos;

public record SalvarCandidatoDto(
    string NomeCompleto,
    string Email,
    string? Telefone,
    DateOnly? DataNascimento,
    bool DataNascimentoEstimada,
    string? Cidade,
    string? Estado,
    string? Sobre,
    IReadOnlyList<ExperienciaProfissionalDto> Experiencias,
    IReadOnlyList<FormacaoAcademicaDto> Formacoes,
    IReadOnlyList<CompetenciaDto> Competencias,
    SalvarAvaliacaoDto? Avaliacao = null);
