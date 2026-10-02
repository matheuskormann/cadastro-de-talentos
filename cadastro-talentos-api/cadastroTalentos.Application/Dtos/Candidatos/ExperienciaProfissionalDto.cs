namespace cadastroTalentos.Application.Dtos.Candidatos;

public record ExperienciaProfissionalDto(
    string Empresa,
    string Cargo,
    DateOnly? DataInicio,
    DateOnly? DataFim,
    bool EmpregoAtual,
    string? Descricao);
