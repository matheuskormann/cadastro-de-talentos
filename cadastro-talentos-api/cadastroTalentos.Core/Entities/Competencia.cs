using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Core.Entities;

public class Competencia
{
    public Guid Id { get; set; }
    public Guid CandidatoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public TipoCompetencia Tipo { get; set; }
    public NivelCompetencia? Nivel { get; set; }
}
