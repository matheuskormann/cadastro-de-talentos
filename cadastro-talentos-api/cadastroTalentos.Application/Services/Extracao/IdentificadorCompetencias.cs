using System.Text.RegularExpressions;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Services.Extracao;

internal static partial class IdentificadorCompetencias
{
    private const int limiteCompetencias = 40;
    private const int tamanhoMinimoNome = 2;
    private const int tamanhoMaximoNome = 60;
    private const string padraoNivel = "b[áa]sico|intermedi[áa]rio|avan[çc]ado|fluente|nativo";

    private static readonly HashSet<string> idiomasConhecidos =
    [
        "portugues", "ingles", "espanhol", "frances", "alemao", "italiano", "mandarim", "chines", "japones",
        "coreano", "russo", "arabe", "hebraico", "holandes", "grego", "latim", "libras"
    ];

    public static List<CompetenciaDto> Identificar(List<string> linhasSecao, TipoCompetencia tipo)
    {
        return UnirLinhasQuebradas(linhasSecao)
            .Select(linha => RemoverRotulo(TextoCurriculo.RemoverMarcador(linha)))
            .SelectMany(linha => RegexSeparadorLista().Split(linha))
            .Select(item => CriarCompetencia(item, tipo))
            .Where(competencia => competencia.Nome.Length is >= tamanhoMinimoNome and <= tamanhoMaximoNome)
            .DistinctBy(competencia => competencia.Nome.ToLowerInvariant())
            .Take(limiteCompetencias)
            .ToList();
    }

    public static List<CompetenciaDto> IdentificarIdiomas(List<string> linhasSecao)
    {
        return Identificar(linhasSecao, TipoCompetencia.Idioma)
            .Where(idioma => idiomasConhecidos.Contains(TextoCurriculo.Normalizar(idioma.Nome).Split(' ')[0]))
            .ToList();
    }

    private static List<string> UnirLinhasQuebradas(List<string> linhasSecao)
    {
        var linhasUnidas = new List<string>();

        foreach (var linha in linhasSecao)
        {
            var continuaLinhaAnterior = linhasUnidas.Count > 0
                && RegexSeparadorLista().IsMatch(linhasUnidas[^1])
                && !RegexTerminaComSeparador().IsMatch(linhasUnidas[^1])
                && !RegexComecaComSeparador().IsMatch(linha)
                && !RegexRotulo().IsMatch(linha);

            if (continuaLinhaAnterior)
            {
                linhasUnidas[^1] = $"{linhasUnidas[^1]} {linha}";
            }
            else
            {
                linhasUnidas.Add(linha);
            }
        }

        return linhasUnidas;
    }

    private static string RemoverRotulo(string linha)
    {
        var linhaSemRotulo = RegexRotulo().Replace(linha, string.Empty);
        var restaApenasNivel = RegexNivel().Replace(linhaSemRotulo, string.Empty).Trim(TextoCurriculo.Separadores).Length == 0;

        return restaApenasNivel ? linha : linhaSemRotulo;
    }

    private static CompetenciaDto CriarCompetencia(string item, TipoCompetencia tipo)
    {
        var correspondenciaNivel = RegexNivel().Match(item);
        var nome = RegexNivel().Replace(item, string.Empty).Trim(TextoCurriculo.Separadores);

        return new CompetenciaDto(nome, tipo, ConverterNivel(correspondenciaNivel));
    }

    private static NivelCompetencia? ConverterNivel(Match correspondenciaNivel)
    {
        if (!correspondenciaNivel.Success)
        {
            return null;
        }

        return TextoCurriculo.Normalizar(correspondenciaNivel.Value).Trim('(', ')') switch
        {
            "basico" => NivelCompetencia.Basico,
            "intermediario" => NivelCompetencia.Intermediario,
            "avancado" => NivelCompetencia.Avancado,
            "fluente" or "nativo" => NivelCompetencia.Fluente,
            _ => null
        };
    }

    [GeneratedRegex(@"^[\p{L}\s/]{2,30}:\s*")]
    private static partial Regex RegexRotulo();

    [GeneratedRegex(@"\s*[,;•·|]\s*")]
    private static partial Regex RegexSeparadorLista();

    [GeneratedRegex(@"[,;•·|]\s*$")]
    private static partial Regex RegexTerminaComSeparador();

    [GeneratedRegex(@"^\s*[,;•·|\-–*▪●○>]")]
    private static partial Regex RegexComecaComSeparador();

    [GeneratedRegex($@"\(?\b(?:{padraoNivel})\b\)?", RegexOptions.IgnoreCase)]
    private static partial Regex RegexNivel();
}
