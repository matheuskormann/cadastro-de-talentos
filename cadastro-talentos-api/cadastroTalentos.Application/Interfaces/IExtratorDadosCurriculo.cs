using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Interfaces;

public interface IExtratorDadosCurriculo
{
    MetodoExtracao Metodo { get; }
    Task<DadosExtraidosCurriculoDto> ExtrairAsync(string textoCurriculo, CancellationToken cancellationToken);
}
