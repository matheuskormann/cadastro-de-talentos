using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Core.Entities;

namespace cadastroTalentos.Application.Mappings;

public static class AvaliacaoMapeamentos
{
    public static AvaliacaoDto ParaDto(this AvaliacaoCandidato avaliacao) => new(
        avaliacao.NotaExperiencia,
        avaliacao.NotaFormacao,
        avaliacao.NotaComunicacao,
        avaliacao.NotaGeral,
        avaliacao.Comentario,
        avaliacao.SugeridaPorIa,
        avaliacao.DataAtualizacao);

    public static void AtualizarCom(this AvaliacaoCandidato avaliacao, SalvarAvaliacaoDto dto)
    {
        avaliacao.NotaExperiencia = dto.NotaExperiencia;
        avaliacao.NotaFormacao = dto.NotaFormacao;
        avaliacao.NotaComunicacao = dto.NotaComunicacao;
        avaliacao.Comentario = dto.Comentario?.Trim();
        avaliacao.SugeridaPorIa = dto.SugeridaPorIa;
        avaliacao.DataAtualizacao = DateTime.UtcNow;
    }
}
