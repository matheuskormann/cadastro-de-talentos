namespace cadastroTalentos.Core.Entities;

public class ExperienciaProfissional
{
    public Guid Id { get; set; }
    public Guid CandidatoId { get; set; }
    public string Empresa { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public DateOnly? DataInicio { get; set; }
    public DateOnly? DataFim { get; set; }
    public bool EmpregoAtual { get; set; }
    public string? Descricao { get; set; }
}
