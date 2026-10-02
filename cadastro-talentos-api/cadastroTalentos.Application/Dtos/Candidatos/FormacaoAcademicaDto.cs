using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Dtos.Candidatos;

public record FormacaoAcademicaDto(
    string Instituicao,
    string? Curso,
    NivelFormacao Nivel,
    DateOnly? DataInicio,
    DateOnly? DataConclusao,
    bool EmAndamento);
