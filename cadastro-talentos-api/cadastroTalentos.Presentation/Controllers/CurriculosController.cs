using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Presentation.Extensions;
using cadastroTalentos.Presentation.Requests;
using Microsoft.AspNetCore.Mvc;

namespace cadastroTalentos.Presentation.Controllers;

[ApiController]
[Route("api/curriculos")]
[Produces("application/json")]
public class CurriculosController(ICurriculoService curriculoService) : ControllerBase
{
    [HttpPost("extracao")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType<ResultadoExtracaoCurriculoDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<ResultadoExtracaoCurriculoDto>> ExtrairDados([FromForm] ExtrairCurriculoRequest request, CancellationToken cancellationToken)
    {
        await using var conteudo = request.Arquivo?.OpenReadStream();
        var arquivoCurriculo = request.Arquivo?.ParaArquivoCurriculo(conteudo!);

        return Ok(await curriculoService.ExtrairDadosAsync(arquivoCurriculo, request.UsarIa, cancellationToken));
    }
}
