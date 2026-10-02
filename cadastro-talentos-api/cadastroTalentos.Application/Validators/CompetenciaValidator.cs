using cadastroTalentos.Application.Dtos.Candidatos;
using FluentValidation;

namespace cadastroTalentos.Application.Validators;

public class CompetenciaValidator : AbstractValidator<CompetenciaDto>
{
    public CompetenciaValidator()
    {
        RuleFor(competencia => competencia.Nome)
            .NotEmpty().WithMessage("O nome da competência é obrigatório.")
            .MaximumLength(100).WithMessage("O nome da competência deve ter no máximo 100 caracteres.");

        RuleFor(competencia => competencia.Tipo)
            .IsInEnum().WithMessage("Informe um tipo de competência válido.");

        RuleFor(competencia => competencia.Nivel)
            .IsInEnum().WithMessage("Informe um nível de competência válido.")
            .When(competencia => competencia.Nivel is not null);
    }
}
