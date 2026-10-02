using cadastroTalentos.Application.Dtos.Avaliacoes;
using cadastroTalentos.Core.Entities;
using FluentValidation;

namespace cadastroTalentos.Application.Validators;

public class SalvarAvaliacaoValidator : AbstractValidator<SalvarAvaliacaoDto>
{
    private static readonly string mensagemNota =
        $"A nota deve estar entre {AvaliacaoCandidato.NotaMinima} e {AvaliacaoCandidato.NotaMaxima}.";

    public SalvarAvaliacaoValidator()
    {
        RuleFor(avaliacao => avaliacao.NotaExperiencia)
            .InclusiveBetween(AvaliacaoCandidato.NotaMinima, AvaliacaoCandidato.NotaMaxima).WithMessage(mensagemNota);

        RuleFor(avaliacao => avaliacao.NotaFormacao)
            .InclusiveBetween(AvaliacaoCandidato.NotaMinima, AvaliacaoCandidato.NotaMaxima).WithMessage(mensagemNota);

        RuleFor(avaliacao => avaliacao.NotaComunicacao)
            .InclusiveBetween(AvaliacaoCandidato.NotaMinima, AvaliacaoCandidato.NotaMaxima).WithMessage(mensagemNota);

        RuleFor(avaliacao => avaliacao.Comentario)
            .MaximumLength(2000).WithMessage("O comentário deve ter no máximo 2000 caracteres.");
    }
}
