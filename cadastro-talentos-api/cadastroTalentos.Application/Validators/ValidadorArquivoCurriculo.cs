using cadastroTalentos.Application.Dtos.Curriculos;
using FluentValidation;
using FluentValidation.Results;

namespace cadastroTalentos.Application.Validators;

public static class ValidadorArquivoCurriculo
{
    public const long TamanhoMaximoBytes = 5 * 1024 * 1024;
    public const string ExtensaoPermitida = ".pdf";
    public const string TipoConteudoPdf = "application/pdf";

    private const string campoArquivo = "curriculo";
    private static readonly byte[] assinaturaPdf = "%PDF-"u8.ToArray();

    public static void Validar(ArquivoCurriculo? arquivo)
    {
        if (arquivo is null || arquivo.TamanhoBytes == 0)
        {
            throw CriarErro("Envie o arquivo do currículo em PDF.");
        }

        if (arquivo.TamanhoBytes > TamanhoMaximoBytes)
        {
            throw CriarErro("O arquivo excede o tamanho máximo de 5 MB.");
        }

        var extensao = Path.GetExtension(arquivo.NomeOriginal);

        if (!string.Equals(extensao, ExtensaoPermitida, StringComparison.OrdinalIgnoreCase) || !PossuiAssinaturaPdf(arquivo.Conteudo))
        {
            throw CriarErro("O arquivo enviado não é um PDF válido.");
        }
    }

    private static bool PossuiAssinaturaPdf(Stream conteudo)
    {
        var bytesIniciais = new byte[assinaturaPdf.Length];

        conteudo.Position = 0;
        var bytesLidos = conteudo.ReadAtLeast(bytesIniciais, bytesIniciais.Length, throwOnEndOfStream: false);
        conteudo.Position = 0;

        return bytesLidos == assinaturaPdf.Length && bytesIniciais.AsSpan().SequenceEqual(assinaturaPdf);
    }

    private static ValidationException CriarErro(string mensagem)
    {
        return new ValidationException([new ValidationFailure(campoArquivo, mensagem)]);
    }
}
