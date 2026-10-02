using System.Globalization;
using System.Text.RegularExpressions;

namespace cadastroTalentos.Application.Services.Extracao;

internal static partial class IdentificadorDadosPessoais
{
    private const int linhasAnalisadasParaNome = 10;
    private const int idadeMinima = 14;
    private const int idadeMaxima = 90;
    private const string padraoUf = "AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO";

    private static readonly CultureInfo culturaBrasileira = CultureInfo.GetCultureInfo("pt-BR");
    private static readonly HashSet<string> preposicoesDeNome = ["de", "da", "do", "das", "dos", "e"];

    public static string? IdentificarEmail(string texto)
    {
        return IdentificarPrimeiro(RegexEmail(), texto)?.ToLowerInvariant();
    }

    public static string? IdentificarTelefone(string texto)
    {
        return IdentificarPrimeiro(RegexTelefone(), texto);
    }

    public static string? IdentificarNome(List<string> linhas, string? email)
    {
        var nomeRotulado = linhas
            .Select(linha => RegexNomeRotulado().Match(linha))
            .FirstOrDefault(correspondencia => correspondencia.Success);

        var nome = nomeRotulado?.Groups["nome"].Value.Trim()
            ?? IdentificarNomePeloEmail(linhas, email)
            ?? linhas.Take(linhasAnalisadasParaNome).FirstOrDefault(PareceNomeDePessoa);

        if (nome is null)
        {
            return null;
        }

        var nomeFormatado = nome == nome.ToUpper(culturaBrasileira) ? FormatarNomeProprio(nome) : nome;

        return TextoCurriculo.Limitar(nomeFormatado, 150);
    }

    public static DateOnly? IdentificarDataNascimento(string texto)
    {
        var correspondencia = RegexDataNascimento().Match(texto);

        if (!correspondencia.Success)
        {
            return null;
        }

        var dataTexto = $"{correspondencia.Groups["dia"].Value}/{correspondencia.Groups["mes"].Value}/{correspondencia.Groups["ano"].Value}";

        return DateOnly.TryParseExact(dataTexto, "d/M/yyyy", culturaBrasileira, DateTimeStyles.None, out var dataNascimento)
            ? dataNascimento
            : null;
    }

    public static int? IdentificarIdade(string texto)
    {
        var correspondencia = RegexIdade().Match(texto);

        if (!correspondencia.Success)
        {
            return null;
        }

        var valorIdade = correspondencia.Groups["rotulada"].Success
            ? correspondencia.Groups["rotulada"].Value
            : correspondencia.Groups["anos"].Value;

        var idade = int.Parse(valorIdade);

        return idade is >= idadeMinima and <= idadeMaxima ? idade : null;
    }

    public static (string? Cidade, string? Estado) IdentificarLocalizacao(string texto)
    {
        var correspondencia = RegexCidadeEstado().Match(texto);

        return correspondencia.Success
            ? (TextoCurriculo.Limitar(correspondencia.Groups["cidade"].Value.Trim(), 100), correspondencia.Groups["uf"].Value)
            : (null, null);
    }

    private static string? IdentificarNomePeloEmail(List<string> linhas, string? email)
    {
        if (email is null)
        {
            return null;
        }

        var usuarioEmail = TextoCurriculo.Normalizar(email.Split('@')[0]);

        return linhas
            .Where(PareceNomeDePessoa)
            .Select(linha => (Linha: linha, PalavrasNoEmail: ContarPalavrasPresentes(linha, usuarioEmail)))
            .Where(item => item.PalavrasNoEmail > 0)
            .OrderByDescending(item => item.PalavrasNoEmail)
            .Select(item => item.Linha)
            .FirstOrDefault();
    }

    private static int ContarPalavrasPresentes(string linha, string usuarioEmail)
    {
        return TextoCurriculo.Normalizar(linha)
            .Split(' ')
            .Count(palavra => palavra.Length >= 3 && usuarioEmail.Contains(palavra));
    }

    private static string FormatarNomeProprio(string nome)
    {
        var palavras = nome.ToLower(culturaBrasileira)
            .Split(' ')
            .Select(palavra => preposicoesDeNome.Contains(palavra) ? palavra : culturaBrasileira.TextInfo.ToTitleCase(palavra));

        return string.Join(' ', palavras);
    }

    private static bool PareceNomeDePessoa(string linha)
    {
        if (linha.Length > 60 || RegexTextoNaoNome().IsMatch(linha))
        {
            return false;
        }

        var palavras = linha.Split(' ');

        return palavras.Length is >= 2 and <= 6 && palavras.All(palavra => RegexPalavraDeNome().IsMatch(palavra));
    }

    private static string? IdentificarPrimeiro(Regex regex, string texto)
    {
        var correspondencia = regex.Match(texto);

        return correspondencia.Success ? correspondencia.Value.Trim() : null;
    }

    [GeneratedRegex(@"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")]
    private static partial Regex RegexEmail();

    [GeneratedRegex(@"(?<!\d)(?:\+?55[\s.-]?)?\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}(?!\d)")]
    private static partial Regex RegexTelefone();

    [GeneratedRegex(@"^nome(?:\s+completo)?\s*:\s*(?<nome>.+)$", RegexOptions.IgnoreCase)]
    private static partial Regex RegexNomeRotulado();

    [GeneratedRegex(@"\d|@|https?:|www\.|curr[ií]cul|vitae|resume", RegexOptions.IgnoreCase)]
    private static partial Regex RegexTextoNaoNome();

    [GeneratedRegex(@"^[\p{L}][\p{L}'.-]*$")]
    private static partial Regex RegexPalavraDeNome();

    [GeneratedRegex(@"(?:nascimento|nascid[oa](?:\s+em)?|nasc\.)\D{0,15}(?<dia>\d{1,2})[/.-](?<mes>\d{1,2})[/.-](?<ano>(?:19|20)\d{2})", RegexOptions.IgnoreCase)]
    private static partial Regex RegexDataNascimento();

    [GeneratedRegex(@"\bidade\s*:?\s*(?<rotulada>\d{2})\b|\b(?<anos>\d{2})\s+anos\b(?!\s+(?:de|na|no|em|como|com)\b)", RegexOptions.IgnoreCase)]
    private static partial Regex RegexIdade();

    [GeneratedRegex($@"(?<cidade>\p{{Lu}}[\p{{Ll}}']+(?:[ -](?:d[aeo]s?\s)?\p{{Lu}}?[\p{{Ll}}']+){{0,4}})\s*[-–/,]\s*(?<uf>{padraoUf})\b")]
    private static partial Regex RegexCidadeEstado();
}
