using cadastroTalentos.Core.Enums;

namespace cadastroTalentos.Core.Entities;

public class Candidato
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public bool DataNascimentoEstimada { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? Sobre { get; set; }
    public OrigemCadastro OrigemCadastro { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public DateTime? DataAtualizacao { get; set; }

    public List<ExperienciaProfissional> Experiencias { get; set; } = [];
    public List<FormacaoAcademica> Formacoes { get; set; } = [];
    public List<Competencia> Competencias { get; set; } = [];
    public CurriculoCandidato? Curriculo { get; set; }
    public AvaliacaoCandidato? Avaliacao { get; set; }

    public int? CalcularIdade(DateOnly dataReferencia)
    {
        if (DataNascimento is not { } dataNascimento)
        {
            return null;
        }

        var idade = dataReferencia.Year - dataNascimento.Year;

        if (dataNascimento > dataReferencia.AddYears(-idade))
        {
            idade--;
        }

        return idade;
    }
}
