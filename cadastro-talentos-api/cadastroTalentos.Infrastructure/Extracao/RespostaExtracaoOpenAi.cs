using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Infrastructure.Extracao;

internal record RespostaExtracaoOpenAi(
    string? NomeCompleto,
    string? Email,
    string? Telefone,
    string? DataNascimento,
    int? Idade,
    string? Cidade,
    string? Estado,
    string? Sobre,
    List<ExperienciaExtraida>? Experiencias,
    List<FormacaoExtraida>? Formacoes,
    List<CompetenciaExtraida>? Competencias,
    AvaliacaoExtraida? Avaliacao);

internal record AvaliacaoExtraida(
    int NotaExperiencia,
    string? JustificativaExperiencia,
    int NotaFormacao,
    string? JustificativaFormacao,
    int NotaComunicacao,
    string? JustificativaComunicacao);

internal record ExperienciaExtraida(
    string? Empresa,
    string? Cargo,
    string? DataInicio,
    string? DataFim,
    bool EmpregoAtual,
    string? Descricao);

internal record FormacaoExtraida(
    string? Instituicao,
    string? Curso,
    NivelFormacao Nivel,
    string? DataInicio,
    string? DataConclusao,
    bool EmAndamento);

internal record CompetenciaExtraida(
    string? Nome,
    TipoCompetencia Tipo,
    NivelCompetencia? Nivel);
