using System.Net.Mime;
using System.Text.Json;
using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Presentation.Extensions;
using cadastroTalentos.Presentation.Requests;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;

namespace cadastroTalentos.Presentation.Controllers;

[ApiController]
[Route("api/candidatos")]
[Produces("application/json")]
public class CandidatosController(
    ICandidatoService candidatoService,
    ICurriculoService curriculoService,
    IOptions<JsonOptions> opcoesJson) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<CandidatoResumoDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CandidatoResumoDto>>> Listar([FromQuery] string? busca, CancellationToken cancellationToken)
    {
        return Ok(await candidatoService.ListarAsync(busca, cancellationToken));
    }

    [HttpGet("{id:guid}", Name = nameof(ObterPorId))]
    [ProducesResponseType<CandidatoDetalheDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CandidatoDetalheDto>> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await candidatoService.ObterPorIdAsync(id, cancellationToken));
    }

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<CandidatoDetalheDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidatoDetalheDto>> Cadastrar(SalvarCandidatoDto dto, CancellationToken cancellationToken)
    {
        var candidato = await candidatoService.CadastrarAsync(dto, null, cancellationToken);

        return CreatedAtRoute(nameof(ObterPorId), new { id = candidato.Id }, candidato);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [ProducesResponseType<CandidatoDetalheDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidatoDetalheDto>> CadastrarComCurriculo([FromForm] CadastrarCandidatoComCurriculoRequest request, CancellationToken cancellationToken)
    {
        var dto = DesserializarDados(request.Dados);

        await using var conteudo = request.Curriculo?.OpenReadStream();
        var arquivoCurriculo = request.Curriculo?.ParaArquivoCurriculo(conteudo!);

        var candidato = await candidatoService.CadastrarAsync(dto, arquivoCurriculo, cancellationToken);

        return CreatedAtRoute(nameof(ObterPorId), new { id = candidato.Id }, candidato);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<CandidatoDetalheDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidatoDetalheDto>> Atualizar(Guid id, SalvarCandidatoDto dto, CancellationToken cancellationToken)
    {
        return Ok(await candidatoService.AtualizarAsync(id, dto, cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remover(Guid id, CancellationToken cancellationToken)
    {
        await candidatoService.RemoverAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpPut("{id:guid}/avaliacao")]
    [ProducesResponseType<AvaliacaoDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AvaliacaoDto>> SalvarAvaliacao(Guid id, SalvarAvaliacaoDto dto, CancellationToken cancellationToken)
    {
        return Ok(await candidatoService.SalvarAvaliacaoAsync(id, dto, cancellationToken));
    }

    [HttpGet("{id:guid}/curriculo")]
    [Produces(MediaTypeNames.Application.Pdf, "application/json")]
    [ProducesResponseType<FileStreamResult>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> BaixarCurriculo(Guid id, CancellationToken cancellationToken)
    {
        var curriculo = await curriculoService.ObterArquivoAsync(id, cancellationToken);

        var disposicaoConteudo = new ContentDispositionHeaderValue("inline");
        disposicaoConteudo.SetHttpFileName(curriculo.NomeOriginal);
        Response.Headers.ContentDisposition = disposicaoConteudo.ToString();

        return File(curriculo.Conteudo, curriculo.TipoConteudo);
    }

    private SalvarCandidatoDto DesserializarDados(string dados)
    {
        try
        {
            return JsonSerializer.Deserialize<SalvarCandidatoDto>(dados, opcoesJson.Value.JsonSerializerOptions)
                ?? throw new JsonException();
        }
        catch (JsonException)
        {
            throw new ValidationException([new ValidationFailure("dados", "O campo dados deve conter o JSON do candidato em formato válido.")]);
        }
    }
}
