using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Dtos.Candidatos;

public record CandidatoDetalheDto(
    Guid Id,
    string NomeCompleto,
    string Email,
    string? Telefone,
    DateOnly? DataNascimento,
    bool DataNascimentoEstimada,
    int? Idade,
    string? Cidade,
    string? Estado,
    string? Sobre,
    OrigemCadastro OrigemCadastro,
    DateTime DataCadastro,
    DateTime? DataAtualizacao,
    IReadOnlyList<ExperienciaProfissionalDto> Experiencias,
    IReadOnlyList<FormacaoAcademicaDto> Formacoes,
    IReadOnlyList<CompetenciaDto> Competencias,
    CurriculoDto? Curriculo,
    AvaliacaoDto? Avaliacao);
