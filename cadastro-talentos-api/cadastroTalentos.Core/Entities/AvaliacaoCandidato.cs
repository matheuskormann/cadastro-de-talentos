namespace cadastroTalentos.Core.Entities;

public class AvaliacaoCandidato
{
    public const byte NotaMinima = 0;
    public const byte NotaMaxima = 10;

    public Guid CandidatoId { get; set; }
    public byte NotaExperiencia { get; set; }
    public byte NotaFormacao { get; set; }
    public byte NotaComunicacao { get; set; }
    public string? Comentario { get; set; }
    public bool SugeridaPorIa { get; set; }
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    public decimal NotaGeral => Math.Round((NotaExperiencia + NotaFormacao + NotaComunicacao) / 3m, 1);
}
