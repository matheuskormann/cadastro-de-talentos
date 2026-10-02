using System.Text.RegularExpressions;

namespace cadastroTalentos.Application.Services.Extracao;

internal record Periodo(DateOnly? Inicio, DateOnly? Fim, bool EmAberto, string TextoCorrespondente);

internal static partial class AnalisadorPeriodo
{
    private const string padraoMes = "jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez";
    private const string padraoAno = @"(?:19|20)\d{2}";
    private const string padraoData = $@"(?:\d{{1,2}}/{padraoAno}|(?:{padraoMes})[a-zç]*\.?\s*(?:de\s+|/\s*)?{padraoAno}|{padraoAno})";
    private const string padraoEmAberto = @"(?:atual(?:mente)?|presente|hoje|o\s+momento|momento\s+atual|cursando|em\s+andamento)";

    private static readonly string[] mesesAbreviados = padraoMes.Split('|');

    [GeneratedRegex($@"(?<!\d)(?<inicio>{padraoData})\s*(?:-|–|—|a|à|até|ate)\s*(?:(?<fim>{padraoData})|(?<emAberto>{padraoEmAberto}))(?!\d)", RegexOptions.IgnoreCase)]
    private static partial Regex RegexPeriodo();

    [GeneratedRegex($@"^(?<mes>\d{{1,2}})/(?<ano>{padraoAno})$")]
    private static partial Regex RegexMesAnoNumerico();

    [GeneratedRegex($@"^(?<mes>{padraoMes})[a-zç]*\.?\s*(?:de\s+|/\s*)?(?<ano>{padraoAno})$", RegexOptions.IgnoreCase)]
    private static partial Regex RegexMesAnoPorExtenso();

    [GeneratedRegex($@"(?<!\d){padraoAno}(?!\d)")]
    private static partial Regex RegexAno();

    public static Periodo? Identificar(string texto)
    {
        var correspondencia = RegexPeriodo().Match(texto);

        if (!correspondencia.Success)
        {
            return null;
        }

        var emAberto = correspondencia.Groups["emAberto"].Success;
        var dataFim = emAberto ? null : ConverterData(correspondencia.Groups["fim"].Value);

        return new Periodo(ConverterData(correspondencia.Groups["inicio"].Value), dataFim, emAberto, correspondencia.Value);
    }

    public static IReadOnlyList<int> IdentificarAnos(string texto)
    {
        return RegexAno().Matches(texto).Select(correspondencia => int.Parse(correspondencia.Value)).ToList();
    }

    public static DateOnly? ConverterData(string texto)
    {
        var textoLimpo = texto.Trim();

        var mesAnoNumerico = RegexMesAnoNumerico().Match(textoLimpo);
        if (mesAnoNumerico.Success)
        {
            return CriarData(int.Parse(mesAnoNumerico.Groups["ano"].Value), int.Parse(mesAnoNumerico.Groups["mes"].Value));
        }

        var mesAnoPorExtenso = RegexMesAnoPorExtenso().Match(textoLimpo);
        if (mesAnoPorExtenso.Success)
        {
            var numeroMes = Array.IndexOf(mesesAbreviados, mesAnoPorExtenso.Groups["mes"].Value.ToLowerInvariant()) + 1;
            return CriarData(int.Parse(mesAnoPorExtenso.Groups["ano"].Value), numeroMes);
        }

        return int.TryParse(textoLimpo, out var ano) ? CriarData(ano, 1) : null;
    }

    private static DateOnly CriarData(int ano, int mes) => new(ano, Math.Clamp(mes, 1, 12), 1);
}
