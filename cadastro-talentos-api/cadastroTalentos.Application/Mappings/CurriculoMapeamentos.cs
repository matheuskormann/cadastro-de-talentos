using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Core.Entities;

namespace cadastroTalentos.Application.Mappings;

public static class CurriculoMapeamentos
{
    public static CurriculoDto ParaDto(this CurriculoCandidato curriculo) => new(
        curriculo.NomeOriginal,
        curriculo.TamanhoBytes,
        curriculo.DataEnvio);
}
