using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Dtos.Curriculos;

public record ResultadoExtracaoCurriculoDto(
    DadosExtraidosCurriculoDto Dados,
    MetodoExtracao MetodoUtilizado,
    IReadOnlyList<string> CamposNaoIdentificados,
    string? Aviso);
