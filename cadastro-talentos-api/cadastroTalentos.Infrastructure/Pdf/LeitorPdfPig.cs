using cadastroTalentos.Application.Exceptions;
using cadastroTalentos.Application.Interfaces;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace cadastroTalentos.Infrastructure.Pdf;

public class LeitorPdfPig : ILeitorPdf
{
    public string ExtrairTexto(Stream conteudoPdf)
    {
        try
        {
            conteudoPdf.Position = 0;

            using var documento = PdfDocument.Open(conteudoPdf);
            var textoPaginas = documento.GetPages().Select(pagina => ContentOrderTextExtractor.GetText(pagina));

            return string.Join('\n', textoPaginas).Replace("\r", string.Empty);
        }
        catch (Exception excecao)
        {
            throw new LeituraCurriculoException(
                "Não foi possível ler o currículo. O arquivo pode estar corrompido ou protegido. Preencha os dados manualmente.",
                excecao);
        }
        finally
        {
            conteudoPdf.Position = 0;
        }
    }
}
