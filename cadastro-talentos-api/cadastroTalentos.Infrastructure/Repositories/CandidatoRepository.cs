using cadastroTalentos.Core.Entities;
using cadastroTalentos.Core.Interfaces;
using cadastroTalentos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace cadastroTalentos.Infrastructure.Repositories;

public class CandidatoRepository(CadastroTalentosDbContext contexto) : ICandidatoRepository
{
    public async Task<IReadOnlyList<Candidato>> ListarAsync(string? busca, CancellationToken cancellationToken)
    {
        var consulta = contexto.Candidatos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termoBusca = busca.Trim();
            consulta = consulta.Where(candidato => candidato.NomeCompleto.Contains(termoBusca) || candidato.Email.Contains(termoBusca));
        }

        return await consulta
            .Include(candidato => candidato.Curriculo)
            .Include(candidato => candidato.Avaliacao)
            .OrderByDescending(candidato => candidato.DataCadastro)
            .ToListAsync(cancellationToken);
    }

    public Task<Candidato?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return contexto.Candidatos
            .Include(candidato => candidato.Experiencias)
            .Include(candidato => candidato.Formacoes)
            .Include(candidato => candidato.Competencias)
            .Include(candidato => candidato.Curriculo)
            .Include(candidato => candidato.Avaliacao)
            .AsSplitQuery()
            .FirstOrDefaultAsync(candidato => candidato.Id == id, cancellationToken);
    }

    public Task<bool> ExisteEmailAsync(string email, Guid? candidatoIgnoradoId, CancellationToken cancellationToken)
    {
        return contexto.Candidatos.AnyAsync(
            candidato => candidato.Email == email && candidato.Id != candidatoIgnoradoId,
            cancellationToken);
    }

    public async Task AdicionarAsync(Candidato candidato, CancellationToken cancellationToken)
    {
        await contexto.Candidatos.AddAsync(candidato, cancellationToken);
    }

    public void Remover(Candidato candidato)
    {
        contexto.Candidatos.Remove(candidato);
    }

    public Task SalvarAlteracoesAsync(CancellationToken cancellationToken)
    {
        return contexto.SaveChangesAsync(cancellationToken);
    }
}
