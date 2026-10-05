using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Dtos.Candidatos;

public record CandidatoResumoDto(
    Guid Id,
    string NomeCompleto,
    string Email,
    string? Telefone,
    string? Cidade,
    string? Estado,
    int? Idade,
    bool IdadeEstimada,
    OrigemCadastro OrigemCadastro,
    bool PossuiCurriculo,
    AvaliacaoDto? Avaliacao,
    DateTime DataCadastro);
