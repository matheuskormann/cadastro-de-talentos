using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Application.Exceptions;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Application.Validators;
using cadastroTalentos.Core.Enums;
using cadastroTalentos.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace cadastroTalentos.Application.Services;

public class CurriculoService(
    ILeitorPdf leitorPdf,
    IEnumerable<IExtratorDadosCurriculo> extratores,
    ICandidatoRepository candidatoRepository,
    IArmazenamentoArquivos armazenamentoArquivos,
    ILogger<CurriculoService> logger) : ICurriculoService
{
    private const string avisoIaIndisponivel =
        "Não foi possível usar a inteligência artificial. Os dados foram identificados por regras automáticas; revise antes de salvar.";

    public async Task<ResultadoExtracaoCurriculoDto> ExtrairDadosAsync(ArquivoCurriculo? arquivo, bool usarIa, CancellationToken cancellationToken)
    {
        ValidadorArquivoCurriculo.Validar(arquivo);

        var textoCurriculo = leitorPdf.ExtrairTexto(arquivo!.Conteudo);

        if (string.IsNullOrWhiteSpace(textoCurriculo))
        {
            throw new LeituraCurriculoException(
                "Não foi possível ler o texto do currículo. O PDF pode ser uma imagem digitalizada. Preencha os dados manualmente.");
        }

        var (dadosExtraidos, metodoUtilizado) = await ExtrairAsync(textoCurriculo, usarIa, cancellationToken);
        var dadosNormalizados = EstimarDataNascimento(dadosExtraidos);
        var aviso = usarIa && metodoUtilizado == MetodoExtracao.Regex ? avisoIaIndisponivel : null;

        return new ResultadoExtracaoCurriculoDto(dadosNormalizados, metodoUtilizado, ListarCamposNaoIdentificados(dadosNormalizados), aviso);
    }

    public async Task<CurriculoArmazenadoDto> ObterArquivoAsync(Guid candidatoId, CancellationToken cancellationToken)
    {
        var candidato = await candidatoRepository.ObterPorIdAsync(candidatoId, cancellationToken)
            ?? throw new RecursoNaoEncontradoException("Candidato não encontrado.");

        var curriculo = candidato.Curriculo
            ?? throw new RecursoNaoEncontradoException("Este candidato não possui currículo anexado.");

        var conteudo = armazenamentoArquivos.Abrir(curriculo.ChaveArmazenamento)
            ?? throw new RecursoNaoEncontradoException("O arquivo do currículo não foi encontrado no armazenamento.");

        return new CurriculoArmazenadoDto(curriculo.NomeOriginal, curriculo.TipoConteudo, conteudo);
    }

    private async Task<(DadosExtraidosCurriculoDto Dados, MetodoExtracao Metodo)> ExtrairAsync(string textoCurriculo, bool usarIa, CancellationToken cancellationToken)
    {
        if (usarIa)
        {
            try
            {
                var dadosIa = await ObterExtrator(MetodoExtracao.InteligenciaArtificial).ExtrairAsync(textoCurriculo, cancellationToken);
                return (dadosIa, MetodoExtracao.InteligenciaArtificial);
            }
            catch (Exception excecao) when (excecao is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
            {
                logger.LogWarning(excecao, "Falha na extração por IA; aplicando extração por regex");
            }
        }

        var dadosRegex = await ObterExtrator(MetodoExtracao.Regex).ExtrairAsync(textoCurriculo, cancellationToken);
        return (dadosRegex, MetodoExtracao.Regex);
    }

    private IExtratorDadosCurriculo ObterExtrator(MetodoExtracao metodo)
    {
        return extratores.First(extrator => extrator.Metodo == metodo);
    }

    private static DadosExtraidosCurriculoDto EstimarDataNascimento(DadosExtraidosCurriculoDto dados)
    {
        if (dados.DataNascimento is not null)
        {
            return dados with { DataNascimentoEstimada = false };
        }

        if (dados.Idade is not { } idade)
        {
            return dados;
        }

        var dataEstimada = DateOnly.FromDateTime(DateTime.Today).AddYears(-idade);

        return dados with { DataNascimento = dataEstimada, DataNascimentoEstimada = true };
    }

    private static List<string> ListarCamposNaoIdentificados(DadosExtraidosCurriculoDto dados)
    {
        var camposPreenchidos = new Dictionary<string, bool>
        {
            ["nomeCompleto"] = !string.IsNullOrWhiteSpace(dados.NomeCompleto),
            ["email"] = !string.IsNullOrWhiteSpace(dados.Email),
            ["telefone"] = !string.IsNullOrWhiteSpace(dados.Telefone),
            ["dataNascimento"] = dados.DataNascimento is not null,
            ["cidade"] = !string.IsNullOrWhiteSpace(dados.Cidade),
            ["estado"] = !string.IsNullOrWhiteSpace(dados.Estado),
            ["sobre"] = !string.IsNullOrWhiteSpace(dados.Sobre),
            ["experiencias"] = dados.Experiencias.Count > 0,
            ["formacoes"] = dados.Formacoes.Count > 0,
            ["competencias"] = dados.Competencias.Count > 0
        };

        return camposPreenchidos.Where(campo => !campo.Value).Select(campo => campo.Key).ToList();
    }
}
