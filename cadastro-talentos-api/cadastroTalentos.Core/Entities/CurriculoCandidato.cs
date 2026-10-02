namespace cadastroTalentos.Core.Entities;

public class CurriculoCandidato
{
    public Guid CandidatoId { get; set; }
    public string NomeOriginal { get; set; } = string.Empty;
    public string ChaveArmazenamento { get; set; } = string.Empty;
    public string TipoConteudo { get; set; } = string.Empty;
    public long TamanhoBytes { get; set; }
    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;
}
