using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class CompetenciaConfiguration : IEntityTypeConfiguration<Competencia>
{
    public void Configure(EntityTypeBuilder<Competencia> builder)
    {
        builder.ToTable("Competencias");
        builder.HasKey(competencia => competencia.Id);

        builder.Property(competencia => competencia.Nome).HasMaxLength(100).IsRequired();
        builder.Property(competencia => competencia.Tipo).HasConversion<string>().HasMaxLength(20);
        builder.Property(competencia => competencia.Nivel).HasConversion<string>().HasMaxLength(20);
    }
}
