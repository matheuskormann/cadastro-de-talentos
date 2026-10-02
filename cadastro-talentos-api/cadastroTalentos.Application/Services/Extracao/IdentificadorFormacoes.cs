using System.Text.RegularExpressions;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Services.Extracao;

internal static partial class IdentificadorFormacoes
{
    private const int linhasComplementares = 2;

    private static readonly (string[] Termos, NivelFormacao Nivel)[] termosPorNivel =
    [
        (["doutorado", "phd"], NivelFormacao.Doutorado),
        (["mestrado"], NivelFormacao.Mestrado),
        (["pos-graduacao", "pos graduacao", "especializacao", "mba"], NivelFormacao.PosGraduacao),
        (["tecnologo", "tecnologia em", "superior de tecnologia"], NivelFormacao.Tecnologo),
        (["bacharel", "graduacao", "licenciatura", "ensino superior", "superior em", "superior completo", "superior incompleto", "engenharia"], NivelFormacao.Graduacao),
        (["tecnico"], NivelFormacao.Tecnico),
        (["ensino medio", "segundo grau", "2o grau"], NivelFormacao.Medio),
        (["ensino fundamental", "primeiro grau", "1o grau"], NivelFormacao.Fundamental)
    ];

    public static List<FormacaoAcademicaDto> Identificar(List<string> linhasSecao)
    {
        var formacoes = new List<FormacaoAcademicaDto>();

        for (var indice = 0; indice < linhasSecao.Count; indice++)
        {
            var linha = linhasSecao[indice];

            if (IdentificarNivel(linha) is not { } nivel)
            {
                continue;
            }

            var linhasSeguintes = linhasSecao
                .Skip(indice + 1)
                .Take(linhasComplementares)
                .TakeWhile(linhaSeguinte => IdentificarNivel(linhaSeguinte) is null);

            var contexto = string.Join(' ', linhasSeguintes.Prepend(linha));
            var periodo = AnalisadorPeriodo.Identificar(contexto);
            var anos = AnalisadorPeriodo.IdentificarAnos(contexto);
            var emAndamento = periodo?.EmAberto == true || RegexEmAndamento().IsMatch(contexto);
            var instituicao = RegexInstituicao().Match(contexto).Value.Trim(TextoCurriculo.Separadores);

            DateOnly? dataInicio = periodo?.Inicio;
            DateOnly? dataConclusao = periodo?.Fim;

            if (periodo is null && anos.Count > 0)
            {
                dataInicio = anos.Count > 1 ? new DateOnly(anos[0], 1, 1) : null;
                dataConclusao = emAndamento ? null : new DateOnly(anos[^1], 1, 1);
            }

            formacoes.Add(new FormacaoAcademicaDto(
                TextoCurriculo.Limitar(instituicao, 150),
                IdentificarCurso(linha, instituicao, periodo, nivel),
                nivel,
                dataInicio,
                dataConclusao,
                emAndamento));
        }

        return formacoes;
    }

    private static NivelFormacao? IdentificarNivel(string linha)
    {
        var linhaNormalizada = TextoCurriculo.Normalizar(linha);

        foreach (var (termos, nivel) in termosPorNivel)
        {
            if (termos.Any(linhaNormalizada.Contains))
            {
                return nivel;
            }
        }

        return null;
    }

    private static string? IdentificarCurso(string linha, string instituicao, Periodo? periodo, NivelFormacao nivel)
    {
        var curso = linha;

        if (periodo is not null)
        {
            curso = curso.Replace(periodo.TextoCorrespondente, string.Empty);
        }

        if (instituicao.Length > 0)
        {
            curso = curso.Replace(instituicao, string.Empty);
        }

        curso = RegexEmAndamento().Replace(curso, string.Empty);
        curso = string.Join(' ', curso.Split(' ').Where(palavra => AnalisadorPeriodo.IdentificarAnos(palavra).Count == 0));
        curso = curso.Trim(TextoCurriculo.Separadores);

        var ensinoBasico = nivel is NivelFormacao.Fundamental or NivelFormacao.Medio;

        return curso.Length == 0 || ensinoBasico ? null : TextoCurriculo.Limitar(curso, 150);
    }

    [GeneratedRegex(@"\b(?:cursando|em\s+andamento|em\s+curso)\b", RegexOptions.IgnoreCase)]
    private static partial Regex RegexEmAndamento();

    [GeneratedRegex(@"\b(?:Universidade|Faculdade|Funda[çc][ãa]o|Centro\s+Universit[áa]rio|Instituto|Escola|Col[ée]gio|SENAI|SENAC|ETEC|FATEC|PUC|Uni\p{Lu}\p{L}+|U\p{Lu}{2,6}|IF\p{Lu}{2})(?:(?!\s[-–—]\s)[^,;|()\d\n])*")]
    private static partial Regex RegexInstituicao();
}
