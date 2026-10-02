using cadastroTalentos.Application.Dtos.Curriculos;

namespace cadastroTalentos.Presentation.Extensions;

public static class ArquivoExtensions
{
    public static ArquivoCurriculo ParaArquivoCurriculo(this IFormFile arquivo, Stream conteudo)
    {
        return new ArquivoCurriculo(arquivo.FileName, arquivo.ContentType, arquivo.Length, conteudo);
    }
}
