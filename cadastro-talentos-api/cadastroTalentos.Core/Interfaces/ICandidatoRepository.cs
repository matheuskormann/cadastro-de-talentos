using cadastroTalentos.Core.Entities;

namespace cadastroTalentos.Core.Interfaces;

public interface ICandidatoRepository
{
    Task<IReadOnlyList<Candidato>> ListarAsync(string? busca, CancellationToken cancellationToken);
    Task<Candidato?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> ExisteEmailAsync(string email, Guid? candidatoIgnoradoId, CancellationToken cancellationToken);
    Task AdicionarAsync(Candidato candidato, CancellationToken cancellationToken);
    void Remover(Candidato candidato);
    Task SalvarAlteracoesAsync(CancellationToken cancellationToken);
}
