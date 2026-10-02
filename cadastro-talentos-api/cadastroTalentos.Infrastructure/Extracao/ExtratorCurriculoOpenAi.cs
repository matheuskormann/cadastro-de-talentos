using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Core.Entities;
using cadastroTalentos.Core.Enums;
using Microsoft.Extensions.Options;
using OpenAI.Chat;

namespace cadastroTalentos.Infrastructure.Extracao;

public class ExtratorCurriculoOpenAi(IOptions<OpenAiOpcoes> opcoes) : IExtratorDadosCurriculo
{
    private static readonly string[] formatosData = ["yyyy-MM-dd", "yyyy-MM", "yyyy"];

    private static readonly JsonSerializerOptions opcoesJson = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly OpenAiOpcoes configuracao = opcoes.Value;

    public MetodoExtracao Metodo => MetodoExtracao.InteligenciaArtificial;

    public async Task<DadosExtraidosCurriculoDto> ExtrairAsync(string textoCurriculo, CancellationToken cancellationToken)
    {
        var chaveApi = ObterChaveApi();
        var clienteChat = new ChatClient(configuracao.Modelo, chaveApi);

        var opcoesResposta = new ChatCompletionOptions
        {
            ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                EsquemaExtracaoCurriculo.Nome,
                BinaryData.FromString(EsquemaExtracaoCurriculo.JsonSchema),
                jsonSchemaIsStrict: true)
        };

        ChatMessage[] mensagens =
        [
            new SystemChatMessage(EsquemaExtracaoCurriculo.InstrucoesSistema),
            new UserChatMessage(LimitarTexto(textoCurriculo, configuracao.LimiteCaracteresCurriculo))
        ];

        using var controleTempoLimite = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        controleTempoLimite.CancelAfter(TimeSpan.FromSeconds(configuracao.TempoLimiteSegundos));

        ChatCompletion resposta = await clienteChat.CompleteChatAsync(mensagens, opcoesResposta, controleTempoLimite.Token);

        var respostaExtracao = JsonSerializer.Deserialize<RespostaExtracaoOpenAi>(resposta.Content[0].Text, opcoesJson)
            ?? throw new InvalidOperationException("A resposta da OpenAI veio vazia.");

        return ConverterParaDto(respostaExtracao);
    }

    private string ObterChaveApi()
    {
        var chaveApi = string.IsNullOrWhiteSpace(configuracao.ChaveApi)
            ? Environment.GetEnvironmentVariable("OPENAI_API_KEY")
            : configuracao.ChaveApi;

        return string.IsNullOrWhiteSpace(chaveApi)
            ? throw new InvalidOperationException("A chave da API da OpenAI não foi configurada.")
            : chaveApi;
    }

    private static DadosExtraidosCurriculoDto ConverterParaDto(RespostaExtracaoOpenAi resposta) => new()
    {
        NomeCompleto = LimitarTexto(resposta.NomeCompleto, 150),
        Email = LimitarTexto(resposta.Email, 254)?.ToLowerInvariant(),
        Telefone = LimitarTexto(resposta.Telefone, 20),
        DataNascimento = ConverterData(resposta.DataNascimento),
        Idade = resposta.Idade,
        Cidade = LimitarTexto(resposta.Cidade, 100),
        Estado = LimitarTexto(resposta.Estado, 2)?.ToUpperInvariant(),
        Sobre = LimitarTexto(resposta.Sobre, 2000),
        Experiencias = (resposta.Experiencias ?? [])
            .Select(experiencia => new ExperienciaProfissionalDto(
                LimitarTexto(experiencia.Empresa, 150) ?? string.Empty,
                LimitarTexto(experiencia.Cargo, 100) ?? string.Empty,
                ConverterData(experiencia.DataInicio),
                experiencia.EmpregoAtual ? null : ConverterData(experiencia.DataFim),
                experiencia.EmpregoAtual,
                LimitarTexto(experiencia.Descricao, 1000)))
            .ToList(),
        Formacoes = (resposta.Formacoes ?? [])
            .Select(formacao => new FormacaoAcademicaDto(
                LimitarTexto(formacao.Instituicao, 150) ?? string.Empty,
                LimitarTexto(formacao.Curso, 150),
                formacao.Nivel,
                ConverterData(formacao.DataInicio),
                formacao.EmAndamento ? null : ConverterData(formacao.DataConclusao),
                formacao.EmAndamento))
            .ToList(),
        Competencias = (resposta.Competencias ?? [])
            .Where(competencia => !string.IsNullOrWhiteSpace(competencia.Nome))
            .Select(competencia => new CompetenciaDto(LimitarTexto(competencia.Nome, 100)!, competencia.Tipo, competencia.Nivel))
            .ToList(),
        AvaliacaoSugerida = ConverterAvaliacao(resposta.Avaliacao)
    };

    private static AvaliacaoSugeridaDto? ConverterAvaliacao(AvaliacaoExtraida? avaliacao)
    {
        if (avaliacao is null)
        {
            return null;
        }

        var comentario = string.Join('\n',
            $"Experiência: {avaliacao.JustificativaExperiencia}",
            $"Formação: {avaliacao.JustificativaFormacao}",
            $"Comunicação (texto do currículo): {avaliacao.JustificativaComunicacao}");

        return new AvaliacaoSugeridaDto(
            LimitarNota(avaliacao.NotaExperiencia),
            LimitarNota(avaliacao.NotaFormacao),
            LimitarNota(avaliacao.NotaComunicacao),
            LimitarTexto(comentario, 2000));
    }

    private static byte LimitarNota(int nota)
    {
        return (byte)Math.Clamp(nota, AvaliacaoCandidato.NotaMinima, AvaliacaoCandidato.NotaMaxima);
    }

    private static DateOnly? ConverterData(string? texto)
    {
        return DateOnly.TryParseExact(texto?.Trim(), formatosData, CultureInfo.InvariantCulture, DateTimeStyles.None, out var data)
            ? data
            : null;
    }

    private static string? LimitarTexto(string? texto, int tamanhoMaximo)
    {
        var textoLimpo = texto?.Trim();

        if (string.IsNullOrEmpty(textoLimpo))
        {
            return null;
        }

        return textoLimpo.Length <= tamanhoMaximo ? textoLimpo : textoLimpo[..tamanhoMaximo];
    }
}
