using cadastroTalentos.Application.Dtos.Candidatos;
using FluentValidation;

namespace cadastroTalentos.Application.Validators;

public class ExperienciaProfissionalValidator : AbstractValidator<ExperienciaProfissionalDto>
{
    public ExperienciaProfissionalValidator()
    {
        RuleFor(experiencia => experiencia.Empresa)
            .NotEmpty().WithMessage("A empresa é obrigatória.")
            .MaximumLength(150).WithMessage("A empresa deve ter no máximo 150 caracteres.");

        RuleFor(experiencia => experiencia.Cargo)
            .NotEmpty().WithMessage("O cargo é obrigatório.")
            .MaximumLength(100).WithMessage("O cargo deve ter no máximo 100 caracteres.");

        RuleFor(experiencia => experiencia.Descricao)
            .MaximumLength(1000).WithMessage("A descrição deve ter no máximo 1000 caracteres.");

        RuleFor(experiencia => experiencia.DataFim)
            .GreaterThanOrEqualTo(experiencia => experiencia.DataInicio)
            .WithMessage("A data de saída não pode ser anterior à data de início.")
            .When(experiencia => !experiencia.EmpregoAtual && experiencia.DataInicio is not null && experiencia.DataFim is not null);
    }
}
