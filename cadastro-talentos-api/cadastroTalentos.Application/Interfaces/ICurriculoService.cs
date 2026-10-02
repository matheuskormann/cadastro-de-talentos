using cadastroTalentos.Application.Dtos.Curriculos;

namespace cadastroTalentos.Application.Interfaces;

public interface ICurriculoService
{
    Task<ResultadoExtracaoCurriculoDto> ExtrairDadosAsync(ArquivoCurriculo? arquivo, bool usarIa, CancellationToken cancellationToken);
    Task<CurriculoArmazenadoDto> ObterArquivoAsync(Guid candidatoId, CancellationToken cancellationToken);
}
