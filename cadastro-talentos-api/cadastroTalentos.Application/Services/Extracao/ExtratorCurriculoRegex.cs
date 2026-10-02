using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Services.Extracao;

public class ExtratorCurriculoRegex : IExtratorDadosCurriculo
{
    private const int tamanhoMaximoSobre = 2000;

    public MetodoExtracao Metodo => MetodoExtracao.Regex;

    public Task<DadosExtraidosCurriculoDto> ExtrairAsync(string textoCurriculo, CancellationToken cancellationToken)
    {
        var linhas = TextoCurriculo.SepararLinhas(textoCurriculo);
        var secoes = SeparadorSecoes.Separar(linhas);
        var textoCompleto = string.Join('\n', linhas);

        var email = IdentificadorDadosPessoais.IdentificarEmail(textoCompleto);
        var (cidade, estado) = IdentificadorDadosPessoais.IdentificarLocalizacao(textoCompleto);

        var dadosExtraidos = new DadosExtraidosCurriculoDto
        {
            NomeCompleto = IdentificadorDadosPessoais.IdentificarNome(linhas, email),
            Email = email,
            Telefone = IdentificadorDadosPessoais.IdentificarTelefone(textoCompleto),
            DataNascimento = IdentificadorDadosPessoais.IdentificarDataNascimento(textoCompleto),
            Idade = IdentificadorDadosPessoais.IdentificarIdade(textoCompleto),
            Cidade = cidade,
            Estado = estado,
            Sobre = IdentificarSobre(secoes[SecaoCurriculo.Sobre]),
            Experiencias = IdentificadorExperiencias.Identificar(secoes[SecaoCurriculo.Experiencias]),
            Formacoes = IdentificadorFormacoes.Identificar(secoes[SecaoCurriculo.Formacoes]),
            Competencias =
            [
                .. IdentificadorCompetencias.Identificar(secoes[SecaoCurriculo.Competencias], TipoCompetencia.Tecnica),
                .. IdentificadorCompetencias.Identificar(secoes[SecaoCurriculo.CompetenciasComportamentais], TipoCompetencia.Comportamental),
                .. IdentificadorCompetencias.IdentificarIdiomas(secoes[SecaoCurriculo.Idiomas])
            ]
        };

        return Task.FromResult(dadosExtraidos);
    }

    private static string? IdentificarSobre(List<string> linhasSecao)
    {
        return linhasSecao.Count == 0 ? null : TextoCurriculo.Limitar(string.Join(' ', linhasSecao), tamanhoMaximoSobre);
    }
}
