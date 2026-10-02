using cadastroTalentos.Core.Entities;
using cadastroTalentos.Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;

namespace cadastroTalentos.Infrastructure.Persistence;

public class CadastroTalentosDbContext(DbContextOptions<CadastroTalentosDbContext> opcoes) : DbContext(opcoes)
{
    public DbSet<Candidato> Candidatos => Set<Candidato>();
    public DbSet<ExperienciaProfissional> ExperienciasProfissionais => Set<ExperienciaProfissional>();
    public DbSet<FormacaoAcademica> FormacoesAcademicas => Set<FormacaoAcademica>();
    public DbSet<Competencia> Competencias => Set<Competencia>();
    public DbSet<CurriculoCandidato> CurriculosCandidato => Set<CurriculoCandidato>();
    public DbSet<AvaliacaoCandidato> AvaliacoesCandidato => Set<AvaliacaoCandidato>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CadastroTalentosDbContext).Assembly);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<DateTime>().HaveConversion<ConversorDataHoraUtc>();
    }
}
