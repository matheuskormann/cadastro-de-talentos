namespace cadastroTalentos.Application.Dtos.Avaliacoes;

public record AvaliacaoSugeridaDto(
    byte NotaExperiencia,
    byte NotaFormacao,
    byte NotaComunicacao,
    string? Comentario);
