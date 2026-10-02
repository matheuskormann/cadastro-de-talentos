namespace cadastroTalentos.Presentation.Requests;

public class ExtrairCurriculoRequest
{
    public IFormFile? Arquivo { get; set; }
    public bool UsarIa { get; set; } = true;
}
