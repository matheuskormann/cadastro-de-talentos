using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Candidatos;

namespace cadastroTalentos.Application.Dtos.Curriculos;

public record DadosExtraidosCurriculoDto
{
    public string? NomeCompleto { get; init; }
    public string? Email { get; init; }
    public string? Telefone { get; init; }
    public DateOnly? DataNascimento { get; init; }
    public bool DataNascimentoEstimada { get; init; }
    public int? Idade { get; init; }
    public string? Cidade { get; init; }
    public string? Estado { get; init; }
    public string? Sobre { get; init; }
    public IReadOnlyList<ExperienciaProfissionalDto> Experiencias { get; init; } = [];
    public IReadOnlyList<FormacaoAcademicaDto> Formacoes { get; init; } = [];
    public IReadOnlyList<CompetenciaDto> Competencias { get; init; } = [];
    public AvaliacaoSugeridaDto? AvaliacaoSugerida { get; init; }
}
