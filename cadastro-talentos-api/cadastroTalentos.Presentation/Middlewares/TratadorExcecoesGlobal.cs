using cadastroTalentos.Application.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace cadastroTalentos.Presentation.Middlewares;

public class TratadorExcecoesGlobal(
    IProblemDetailsService problemDetailsService,
    ILogger<TratadorExcecoesGlobal> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var problemDetails = exception switch
        {
            ValidationException excecaoValidacao => CriarProblemaValidacao(excecaoValidacao),
            RecursoNaoEncontradoException => CriarProblema(StatusCodes.Status404NotFound, "Recurso não encontrado", exception.Message),
            ConflitoException => CriarProblema(StatusCodes.Status409Conflict, "Conflito", exception.Message),
            LeituraCurriculoException => CriarProblema(StatusCodes.Status422UnprocessableEntity, "Falha na leitura do currículo", exception.Message),
            _ => null
        };

        if (problemDetails is null)
        {
            logger.LogError(exception, "Erro não tratado ao processar {Metodo} {Caminho}", httpContext.Request.Method, httpContext.Request.Path);
            problemDetails = CriarProblema(StatusCodes.Status500InternalServerError, "Erro interno", "Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }

        httpContext.Response.StatusCode = problemDetails.Status!.Value;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails,
            Exception = exception
        });
    }

    private static ProblemDetails CriarProblema(int status, string titulo, string detalhe) => new()
    {
        Status = status,
        Title = titulo,
        Detail = detalhe
    };

    private static ValidationProblemDetails CriarProblemaValidacao(ValidationException excecao)
    {
        var errosPorCampo = excecao.Errors
            .GroupBy(erro => ConverterParaCamelCase(erro.PropertyName))
            .ToDictionary(grupo => grupo.Key, grupo => grupo.Select(erro => erro.ErrorMessage).Distinct().ToArray());

        return new ValidationProblemDetails(errosPorCampo)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Dados inválidos",
            Detail = "Um ou mais campos não passaram na validação."
        };
    }

    private static string ConverterParaCamelCase(string caminhoPropriedade)
    {
        var partes = caminhoPropriedade.Split('.')
            .Select(parte => parte.Length == 0 ? parte : char.ToLowerInvariant(parte[0]) + parte[1..]);

        return string.Join('.', partes);
    }
}
