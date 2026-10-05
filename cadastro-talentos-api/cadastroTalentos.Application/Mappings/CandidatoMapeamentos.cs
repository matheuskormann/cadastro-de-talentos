using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Core.Entities;
using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Application.Mappings;

public static class CandidatoMapeamentos
{
    public static Candidato ParaEntidade(this SalvarCandidatoDto dto, OrigemCadastro origemCadastro)
    {
        var candidato = new Candidato { OrigemCadastro = origemCadastro };
        candidato.AtualizarCom(dto);
        return candidato;
    }

    public static void AtualizarCom(this Candidato candidato, SalvarCandidatoDto dto)
    {
        candidato.NomeCompleto = dto.NomeCompleto.Trim();
        candidato.Email = NormalizarEmail(dto.Email);
        candidato.Telefone = dto.Telefone?.Trim();
        candidato.DataNascimento = dto.DataNascimento;
        candidato.DataNascimentoEstimada = dto.DataNascimento is not null && dto.DataNascimentoEstimada;
        candidato.Cidade = dto.Cidade?.Trim();
        candidato.Estado = dto.Estado?.Trim().ToUpperInvariant();
        candidato.Sobre = dto.Sobre?.Trim();

        candidato.Experiencias.Clear();
        candidato.Experiencias.AddRange((dto.Experiencias ?? []).Select(experiencia => experiencia.ParaEntidade()));

        candidato.Formacoes.Clear();
        candidato.Formacoes.AddRange((dto.Formacoes ?? []).Select(formacao => formacao.ParaEntidade()));

        candidato.Competencias.Clear();
        candidato.Competencias.AddRange((dto.Competencias ?? []).Select(competencia => competencia.ParaEntidade()));

        if (dto.Avaliacao is not null)
        {
            candidato.Avaliacao ??= new AvaliacaoCandidato();
            candidato.Avaliacao.AtualizarCom(dto.Avaliacao);
        }
    }

    public static string NormalizarEmail(string email) => email.Trim().ToLowerInvariant();

    public static CandidatoResumoDto ParaResumoDto(this Candidato candidato, DateOnly dataReferencia) => new(
        candidato.Id,
        candidato.NomeCompleto,
        candidato.Email,
        candidato.Telefone,
        candidato.Cidade,
        candidato.Estado,
        candidato.CalcularIdade(dataReferencia),
        candidato.DataNascimentoEstimada,
        candidato.OrigemCadastro,
        candidato.Curriculo is not null,
        candidato.Avaliacao?.ParaDto(),
        candidato.DataCadastro);

    public static CandidatoDetalheDto ParaDetalheDto(this Candidato candidato, DateOnly dataReferencia) => new(
        candidato.Id,
        candidato.NomeCompleto,
        candidato.Email,
        candidato.Telefone,
        candidato.DataNascimento,
        candidato.DataNascimentoEstimada,
        candidato.CalcularIdade(dataReferencia),
        candidato.Cidade,
        candidato.Estado,
        candidato.Sobre,
        candidato.OrigemCadastro,
        candidato.DataCadastro,
        candidato.DataAtualizacao,
        candidato.Experiencias.Select(experiencia => experiencia.ParaDto()).ToList(),
        candidato.Formacoes.Select(formacao => formacao.ParaDto()).ToList(),
        candidato.Competencias.Select(competencia => competencia.ParaDto()).ToList(),
        candidato.Curriculo?.ParaDto(),
        candidato.Avaliacao?.ParaDto());

    private static ExperienciaProfissional ParaEntidade(this ExperienciaProfissionalDto dto) => new()
    {
        Empresa = dto.Empresa.Trim(),
        Cargo = dto.Cargo.Trim(),
        DataInicio = dto.DataInicio,
        DataFim = dto.EmpregoAtual ? null : dto.DataFim,
        EmpregoAtual = dto.EmpregoAtual,
        Descricao = dto.Descricao?.Trim()
    };

    private static FormacaoAcademica ParaEntidade(this FormacaoAcademicaDto dto) => new()
    {
        Instituicao = dto.Instituicao.Trim(),
        Curso = dto.Curso?.Trim(),
        Nivel = dto.Nivel,
        DataInicio = dto.DataInicio,
        DataConclusao = dto.EmAndamento ? null : dto.DataConclusao,
        EmAndamento = dto.EmAndamento
    };

    private static Competencia ParaEntidade(this CompetenciaDto dto) => new()
    {
        Nome = dto.Nome.Trim(),
        Tipo = dto.Tipo,
        Nivel = dto.Nivel
    };

    private static ExperienciaProfissionalDto ParaDto(this ExperienciaProfissional experiencia) => new(
        experiencia.Empresa,
        experiencia.Cargo,
        experiencia.DataInicio,
        experiencia.DataFim,
        experiencia.EmpregoAtual,
        experiencia.Descricao);

    private static FormacaoAcademicaDto ParaDto(this FormacaoAcademica formacao) => new(
        formacao.Instituicao,
        formacao.Curso,
        formacao.Nivel,
        formacao.DataInicio,
        formacao.DataConclusao,
        formacao.EmAndamento);

    private static CompetenciaDto ParaDto(this Competencia competencia) => new(
        competencia.Nome,
        competencia.Tipo,
        competencia.Nivel);
}
