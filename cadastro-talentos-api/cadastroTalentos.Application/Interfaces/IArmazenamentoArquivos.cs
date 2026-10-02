namespace cadastroTalentos.Application.Interfaces;

public interface IArmazenamentoArquivos
{
    Task<string> SalvarAsync(Stream conteudo, string extensao, CancellationToken cancellationToken);
    Stream? Abrir(string chaveArmazenamento);
    void Remover(string chaveArmazenamento);
}
