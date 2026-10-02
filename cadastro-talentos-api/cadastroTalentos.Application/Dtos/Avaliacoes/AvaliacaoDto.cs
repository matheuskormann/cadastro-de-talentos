namespace cadastroTalentos.Application.Dtos.Avaliacoes;

public record AvaliacaoDto(
    byte NotaExperiencia,
    byte NotaFormacao,
    byte NotaComunicacao,
    decimal NotaGeral,
    string? Comentario,
    bool SugeridaPorIa,
    DateTime DataAtualizacao);
