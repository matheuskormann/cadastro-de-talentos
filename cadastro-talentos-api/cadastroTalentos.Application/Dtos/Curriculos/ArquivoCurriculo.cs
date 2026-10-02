namespace cadastroTalentos.Application.Dtos.Curriculos;

public record ArquivoCurriculo(
    string NomeOriginal,
    string TipoConteudo,
    long TamanhoBytes,
    Stream Conteudo);
