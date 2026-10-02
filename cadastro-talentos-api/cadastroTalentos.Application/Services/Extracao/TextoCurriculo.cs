using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace cadastroTalentos.Application.Services.Extracao;

internal static partial class TextoCurriculo
{
    public static readonly char[] Separadores = [' ', '-', '–', '—', '|', ',', ';', ':', '(', ')', '•', '·', '*'];

    public static List<string> SepararLinhas(string texto)
    {
        return texto
            .Split('\n')
            .Select(linha => RegexEspacos().Replace(linha, " ").Trim())
            .Where(linha => linha.Length > 0)
            .ToList();
    }

    public static string Normalizar(string texto)
    {
        var textoDecomposto = texto.Normalize(NormalizationForm.FormD);
        var semAcentos = textoDecomposto.Where(caractere => CharUnicodeInfo.GetUnicodeCategory(caractere) != UnicodeCategory.NonSpacingMark);

        return new string(semAcentos.ToArray()).Normalize(NormalizationForm.FormC).ToLowerInvariant();
    }

    public static string RemoverMarcador(string linha) => RegexMarcador().Replace(linha, string.Empty);

    public static string Limitar(string texto, int tamanhoMaximo)
    {
        return texto.Length <= tamanhoMaximo ? texto : texto[..tamanhoMaximo].TrimEnd();
    }

    [GeneratedRegex(@"[ \t ]+")]
    private static partial Regex RegexEspacos();

    [GeneratedRegex(@"^[\s\-–*•·▪●○>]+")]
    private static partial Regex RegexMarcador();
}
