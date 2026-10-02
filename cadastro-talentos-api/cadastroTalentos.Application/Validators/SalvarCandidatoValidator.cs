using cadastroTalentos.Application.Dtos.Candidatos;
using FluentValidation;

namespace cadastroTalentos.Application.Validators;

public class SalvarCandidatoValidator : AbstractValidator<SalvarCandidatoDto>
{
    private const string padraoEmail = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
    private const string padraoTelefone = @"^[\d\s()+-]{8,20}$";

    private static readonly HashSet<string> unidadesFederativas =
    [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
        "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    public SalvarCandidatoValidator()
    {
        RuleFor(candidato => candidato.NomeCompleto)
            .NotEmpty().WithMessage("O nome completo é obrigatório.")
            .MaximumLength(150).WithMessage("O nome completo deve ter no máximo 150 caracteres.");

        RuleFor(candidato => candidato.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .MaximumLength(254).WithMessage("O e-mail deve ter no máximo 254 caracteres.")
            .Matches(padraoEmail).WithMessage("Informe um e-mail em formato válido.");

        RuleFor(candidato => candidato.Telefone)
            .Matches(padraoTelefone).WithMessage("Informe um telefone válido, apenas com números, espaços, parênteses, + ou -.")
            .When(candidato => !string.IsNullOrWhiteSpace(candidato.Telefone));

        RuleFor(candidato => candidato.DataNascimento)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today)).WithMessage("A data de nascimento não pode ser futura.")
            .GreaterThan(new DateOnly(1900, 1, 1)).WithMessage("Informe uma data de nascimento válida.")
            .When(candidato => candidato.DataNascimento is not null);

        RuleFor(candidato => candidato.Cidade)
            .MaximumLength(100).WithMessage("A cidade deve ter no máximo 100 caracteres.");

        RuleFor(candidato => candidato.Estado)
            .Must(estado => unidadesFederativas.Contains(estado!.Trim().ToUpperInvariant()))
            .WithMessage("Informe a sigla de uma UF válida, por exemplo: SC.")
            .When(candidato => !string.IsNullOrWhiteSpace(candidato.Estado));

        RuleFor(candidato => candidato.Sobre)
            .MaximumLength(2000).WithMessage("O campo sobre deve ter no máximo 2000 caracteres.");

        RuleForEach(candidato => candidato.Experiencias).SetValidator(new ExperienciaProfissionalValidator());
        RuleForEach(candidato => candidato.Formacoes).SetValidator(new FormacaoAcademicaValidator());
        RuleForEach(candidato => candidato.Competencias).SetValidator(new CompetenciaValidator());

        RuleFor(candidato => candidato.Avaliacao!)
            .SetValidator(new SalvarAvaliacaoValidator())
            .When(candidato => candidato.Avaliacao is not null);
    }
}
