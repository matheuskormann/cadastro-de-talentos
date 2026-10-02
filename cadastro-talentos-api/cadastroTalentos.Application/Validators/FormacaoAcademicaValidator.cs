using cadastroTalentos.Application.Dtos.Candidatos;
using FluentValidation;

namespace cadastroTalentos.Application.Validators;

public class FormacaoAcademicaValidator : AbstractValidator<FormacaoAcademicaDto>
{
    public FormacaoAcademicaValidator()
    {
        RuleFor(formacao => formacao.Instituicao)
            .NotEmpty().WithMessage("A instituição é obrigatória.")
            .MaximumLength(150).WithMessage("A instituição deve ter no máximo 150 caracteres.");

        RuleFor(formacao => formacao.Curso)
            .MaximumLength(150).WithMessage("O curso deve ter no máximo 150 caracteres.");

        RuleFor(formacao => formacao.Nivel)
            .IsInEnum().WithMessage("Informe um nível de formação válido.");

        RuleFor(formacao => formacao.DataConclusao)
            .GreaterThanOrEqualTo(formacao => formacao.DataInicio)
            .WithMessage("A data de conclusão não pode ser anterior à data de início.")
            .When(formacao => !formacao.EmAndamento && formacao.DataInicio is not null && formacao.DataConclusao is not null);
    }
}
