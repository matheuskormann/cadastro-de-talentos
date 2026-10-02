namespace cadastroTalentos.Infrastructure.Extracao;

public class OpenAiOpcoes
{
    public const string Secao = "OpenAi";

    public string ChaveApi { get; set; } = string.Empty;
    public string Modelo { get; set; } = "gpt-4.1";
    public int TempoLimiteSegundos { get; set; } = 30;
    public int LimiteCaracteresCurriculo { get; set; } = 20000;
}
