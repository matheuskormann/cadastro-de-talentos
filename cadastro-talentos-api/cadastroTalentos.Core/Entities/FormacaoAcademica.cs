using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Core.Entities;

public class FormacaoAcademica
{
    public Guid Id { get; set; }
    public Guid CandidatoId { get; set; }
    public string Instituicao { get; set; } = string.Empty;
    public string? Curso { get; set; }
    public NivelFormacao Nivel { get; set; }
    public DateOnly? DataInicio { get; set; }
    public DateOnly? DataConclusao { get; set; }
    public bool EmAndamento { get; set; }
}
