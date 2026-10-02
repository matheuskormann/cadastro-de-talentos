namespace cadastroTalentos.Application.Dtos.Curriculos;

public record CurriculoDto(
    string NomeOriginal,
    long TamanhoBytes,
    DateTime DataEnvio);
