namespace cadastroTalentos.Application.Dtos.Avaliacoes;

public record SalvarAvaliacaoDto(
    byte NotaExperiencia,
    byte NotaFormacao,
    byte NotaComunicacao,
    string? Comentario,
    bool SugeridaPorIa = false);
