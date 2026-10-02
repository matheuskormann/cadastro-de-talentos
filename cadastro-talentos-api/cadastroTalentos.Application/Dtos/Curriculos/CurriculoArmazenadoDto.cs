namespace cadastroTalentos.Application.Dtos.Curriculos;

public record CurriculoArmazenadoDto(
    string NomeOriginal,
    string TipoConteudo,
    Stream Conteudo);
