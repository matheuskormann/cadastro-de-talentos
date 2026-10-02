namespace cadastroTalentos.Presentation.Requests;

public class CadastrarCandidatoComCurriculoRequest
{
    public string Dados { get; set; } = string.Empty;
    public IFormFile? Curriculo { get; set; }
}
