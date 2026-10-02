using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Dtos.Candidatos;

public record CompetenciaDto(
    string Nome,
    TipoCompetencia Tipo,
    NivelCompetencia? Nivel);
