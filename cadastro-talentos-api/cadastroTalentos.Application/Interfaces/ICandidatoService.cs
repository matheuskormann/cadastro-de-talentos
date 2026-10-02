using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Application.Dtos.Curriculos;

namespace cadastroTalentos.Application.Interfaces;

public interface ICandidatoService
{
    Task<IReadOnlyList<CandidatoResumoDto>> ListarAsync(string? busca, CancellationToken cancellationToken);
    Task<CandidatoDetalheDto> ObterPorIdAsync(Guid id, CancellationToken cancellationToken);
    Task<CandidatoDetalheDto> CadastrarAsync(SalvarCandidatoDto dto, ArquivoCurriculo? arquivoCurriculo, CancellationToken cancellationToken);
    Task<CandidatoDetalheDto> AtualizarAsync(Guid id, SalvarCandidatoDto dto, CancellationToken cancellationToken);
    Task RemoverAsync(Guid id, CancellationToken cancellationToken);
    Task<AvaliacaoDto> SalvarAvaliacaoAsync(Guid candidatoId, SalvarAvaliacaoDto dto, CancellationToken cancellationToken);
}
