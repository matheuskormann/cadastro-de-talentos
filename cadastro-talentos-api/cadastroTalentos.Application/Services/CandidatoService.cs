using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Application.Dtos.Candidatos;
using cadastroTalentos.Application.Dtos.Curriculos;
using cadastroTalentos.Application.Exceptions;
using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Application.Mappings;
using cadastroTalentos.Application.Validators;
using cadastroTalentos.Core.Entities;
using cadastroTalentos.Core.Enums;
using cadastroTalentos.Core.Interfaces;
using FluentValidation;

namespace cadastroTalentos.Application.Services;

public class CandidatoService(
    ICandidatoRepository candidatoRepository,
    IArmazenamentoArquivos armazenamentoArquivos,
    IValidator<SalvarCandidatoDto> validadorCandidato,
    IValidator<SalvarAvaliacaoDto> validadorAvaliacao) : ICandidatoService
{
    public async Task<IReadOnlyList<CandidatoResumoDto>> ListarAsync(string? busca, CancellationToken cancellationToken)
    {
        var candidatos = await candidatoRepository.ListarAsync(busca, cancellationToken);
        var dataAtual = ObterDataAtual();

        return candidatos.Select(candidato => candidato.ParaResumoDto(dataAtual)).ToList();
    }

    public async Task<CandidatoDetalheDto> ObterPorIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var candidato = await ObterCandidatoExistenteAsync(id, cancellationToken);

        return candidato.ParaDetalheDto(ObterDataAtual());
    }

    public async Task<CandidatoDetalheDto> CadastrarAsync(SalvarCandidatoDto dto, ArquivoCurriculo? arquivoCurriculo, CancellationToken cancellationToken)
    {
        await validadorCandidato.ValidateAndThrowAsync(dto, cancellationToken);

        if (arquivoCurriculo is not null)
        {
            ValidadorArquivoCurriculo.Validar(arquivoCurriculo);
        }

        await GarantirEmailDisponivelAsync(dto.Email, null, cancellationToken);

        var origemCadastro = arquivoCurriculo is null ? OrigemCadastro.Manual : OrigemCadastro.Curriculo;
        var candidato = dto.ParaEntidade(origemCadastro);

        if (arquivoCurriculo is not null)
        {
            candidato.Curriculo = await ArmazenarCurriculoAsync(arquivoCurriculo, cancellationToken);
        }

        try
        {
            await candidatoRepository.AdicionarAsync(candidato, cancellationToken);
            await candidatoRepository.SalvarAlteracoesAsync(cancellationToken);
        }
        catch
        {
            RemoverArquivoCurriculo(candidato.Curriculo);
            throw;
        }

        return candidato.ParaDetalheDto(ObterDataAtual());
    }

    public async Task<CandidatoDetalheDto> AtualizarAsync(Guid id, SalvarCandidatoDto dto, CancellationToken cancellationToken)
    {
        await validadorCandidato.ValidateAndThrowAsync(dto, cancellationToken);

        var candidato = await ObterCandidatoExistenteAsync(id, cancellationToken);
        await GarantirEmailDisponivelAsync(dto.Email, id, cancellationToken);

        candidato.AtualizarCom(dto);
        candidato.DataAtualizacao = DateTime.UtcNow;

        await candidatoRepository.SalvarAlteracoesAsync(cancellationToken);

        return candidato.ParaDetalheDto(ObterDataAtual());
    }

    public async Task RemoverAsync(Guid id, CancellationToken cancellationToken)
    {
        var candidato = await ObterCandidatoExistenteAsync(id, cancellationToken);

        candidatoRepository.Remover(candidato);
        await candidatoRepository.SalvarAlteracoesAsync(cancellationToken);

        RemoverArquivoCurriculo(candidato.Curriculo);
    }

    public async Task<AvaliacaoDto> SalvarAvaliacaoAsync(Guid candidatoId, SalvarAvaliacaoDto dto, CancellationToken cancellationToken)
    {
        await validadorAvaliacao.ValidateAndThrowAsync(dto, cancellationToken);

        var candidato = await ObterCandidatoExistenteAsync(candidatoId, cancellationToken);

        candidato.Avaliacao ??= new AvaliacaoCandidato();
        candidato.Avaliacao.AtualizarCom(dto);

        await candidatoRepository.SalvarAlteracoesAsync(cancellationToken);

        return candidato.Avaliacao.ParaDto();
    }

    private async Task<Candidato> ObterCandidatoExistenteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await candidatoRepository.ObterPorIdAsync(id, cancellationToken)
            ?? throw new RecursoNaoEncontradoException("Candidato não encontrado.");
    }

    private async Task GarantirEmailDisponivelAsync(string email, Guid? candidatoIgnoradoId, CancellationToken cancellationToken)
    {
        var emailNormalizado = CandidatoMapeamentos.NormalizarEmail(email);

        if (await candidatoRepository.ExisteEmailAsync(emailNormalizado, candidatoIgnoradoId, cancellationToken))
        {
            throw new ConflitoException("Já existe um candidato cadastrado com este e-mail.");
        }
    }

    private async Task<CurriculoCandidato> ArmazenarCurriculoAsync(ArquivoCurriculo arquivoCurriculo, CancellationToken cancellationToken)
    {
        var chaveArmazenamento = await armazenamentoArquivos.SalvarAsync(
            arquivoCurriculo.Conteudo,
            ValidadorArquivoCurriculo.ExtensaoPermitida,
            cancellationToken);

        return new CurriculoCandidato
        {
            NomeOriginal = Path.GetFileName(arquivoCurriculo.NomeOriginal),
            ChaveArmazenamento = chaveArmazenamento,
            TipoConteudo = ValidadorArquivoCurriculo.TipoConteudoPdf,
            TamanhoBytes = arquivoCurriculo.TamanhoBytes
        };
    }

    private void RemoverArquivoCurriculo(CurriculoCandidato? curriculo)
    {
        if (curriculo is not null)
        {
            armazenamentoArquivos.Remover(curriculo.ChaveArmazenamento);
        }
    }

    private static DateOnly ObterDataAtual() => DateOnly.FromDateTime(DateTime.Today);
}
