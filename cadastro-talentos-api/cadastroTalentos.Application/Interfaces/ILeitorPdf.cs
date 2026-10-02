namespace cadastroTalentos.Application.Interfaces;

public interface ILeitorPdf
{
    string ExtrairTexto(Stream conteudoPdf);
}
