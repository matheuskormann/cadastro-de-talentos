using System.Text.RegularExpressions;
using cadastroTalentos.Application.Dtos.Candidatos;

namespace cadastroTalentos.Application.Services.Extracao;

internal static partial class IdentificadorExperiencias
{
    private const int tamanhoMaximoLinhaTitulo = 60;

    private record BlocoExperiencia(int Inicio, int IndicePeriodo, string Titulo, string? Empresa, Periodo Periodo);

    public static List<ExperienciaProfissionalDto> Identificar(List<string> linhasSecao)
    {
        var blocos = SepararBlocos(linhasSecao);
        var experiencias = new List<ExperienciaProfissionalDto>();

        for (var posicao = 0; posicao < blocos.Count; posicao++)
        {
            var bloco = blocos[posicao];
            var fimDescricao = posicao + 1 < blocos.Count ? blocos[posicao + 1].Inicio : linhasSecao.Count;
            var linhasDescricao = linhasSecao.Skip(bloco.IndicePeriodo + 1).Take(fimDescricao - bloco.IndicePeriodo - 1);
            var descricao = UnirLinhasDescricao(linhasDescricao);
            var (cargo, empresa) = SepararCargoEmpresa(bloco);

            experiencias.Add(new ExperienciaProfissionalDto(
                TextoCurriculo.Limitar(empresa, 150),
                TextoCurriculo.Limitar(cargo, 100),
                bloco.Periodo.Inicio,
                bloco.Periodo.Fim,
                bloco.Periodo.EmAberto,
                descricao.Length == 0 ? null : TextoCurriculo.Limitar(descricao, 1000)));
        }

        return experiencias;
    }

    private static List<BlocoExperiencia> SepararBlocos(List<string> linhasSecao)
    {
        var blocos = new List<BlocoExperiencia>();
        var limiteAnterior = -1;

        for (var indicePeriodo = 0; indicePeriodo < linhasSecao.Count; indicePeriodo++)
        {
            if (AnalisadorPeriodo.Identificar(linhasSecao[indicePeriodo]) is not { } periodo)
            {
                continue;
            }

            var textoSemPeriodo = linhasSecao[indicePeriodo].Replace(periodo.TextoCorrespondente, string.Empty).Trim(TextoCurriculo.Separadores);
            var inicioBloco = indicePeriodo;
            var titulo = RegexRotuloPeriodo().Replace(textoSemPeriodo, string.Empty);
            string? empresa = null;

            if (titulo.Length < 3 && indicePeriodo - 1 > limiteAnterior)
            {
                inicioBloco = indicePeriodo - 1;
                titulo = linhasSecao[inicioBloco];

                var indiceCandidatoEmpresa = indicePeriodo - 2;
                var tituloPossuiSeparador = RegexSeparadorTitulo().IsMatch(titulo);

                if (!tituloPossuiSeparador && indiceCandidatoEmpresa > limiteAnterior && PareceLinhaDeTitulo(linhasSecao[indiceCandidatoEmpresa]))
                {
                    inicioBloco = indiceCandidatoEmpresa;
                    empresa = linhasSecao[indiceCandidatoEmpresa];
                }
            }

            blocos.Add(new BlocoExperiencia(inicioBloco, indicePeriodo, titulo, empresa, periodo));
            limiteAnterior = indicePeriodo;
        }

        return blocos;
    }

    private static (string Cargo, string Empresa) SepararCargoEmpresa(BlocoExperiencia bloco)
    {
        var partesTitulo = RegexSeparadorTitulo().Split(bloco.Titulo, 2);
        var cargo = partesTitulo[0].Trim(TextoCurriculo.Separadores);
        var empresa = bloco.Empresa ?? (partesTitulo.Length > 1 ? partesTitulo[1].Trim(TextoCurriculo.Separadores) : string.Empty);

        return !RegexCargo().IsMatch(cargo) && RegexCargo().IsMatch(empresa)
            ? (empresa, cargo)
            : (cargo, empresa);
    }

    private static bool PareceLinhaDeTitulo(string linha)
    {
        return linha.Length <= tamanhoMaximoLinhaTitulo
            && char.IsUpper(linha[0])
            && !linha.EndsWith('.')
            && TextoCurriculo.RemoverMarcador(linha) == linha;
    }

    private static string UnirLinhasDescricao(IEnumerable<string> linhasDescricao)
    {
        var itens = new List<string>();

        foreach (var linha in linhasDescricao)
        {
            var linhaSemMarcador = TextoCurriculo.RemoverMarcador(linha);
            var iniciaNovoItem = itens.Count == 0 || linhaSemMarcador != linha;

            if (iniciaNovoItem)
            {
                itens.Add(linhaSemMarcador);
            }
            else
            {
                itens[^1] = $"{itens[^1]} {linha}";
            }
        }

        return string.Join('\n', itens);
    }

    [GeneratedRegex(@"\s+[-–—|@]\s+|\s+na\s+empresa\s+", RegexOptions.IgnoreCase)]
    private static partial Regex RegexSeparadorTitulo();

    [GeneratedRegex(@"^(?:per[ií]odo|data|dura[çc][ãa]o)\s*:?\s*$", RegexOptions.IgnoreCase)]
    private static partial Regex RegexRotuloPeriodo();

    [GeneratedRegex(@"\b(?:desenvolvedor|analista|gerente|coordenador|assistente|auxiliar|estagi[áa]ri|aprendiz|atendente|vendedor|designer|engenheir|t[ée]cnic|supervisor|diretor|consultor|programador|operador|l[íi]der|especialista|arquitet|professor|recepcionista|secret[áa]ri)", RegexOptions.IgnoreCase)]
    private static partial Regex RegexCargo();
}
