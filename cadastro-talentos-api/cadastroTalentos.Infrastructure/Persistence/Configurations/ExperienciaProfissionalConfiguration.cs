using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class ExperienciaProfissionalConfiguration : IEntityTypeConfiguration<ExperienciaProfissional>
{
    public void Configure(EntityTypeBuilder<ExperienciaProfissional> builder)
    {
        builder.ToTable("ExperienciasProfissionais");
        builder.HasKey(experiencia => experiencia.Id);

        builder.Property(experiencia => experiencia.Empresa).HasMaxLength(150).IsRequired();
        builder.Property(experiencia => experiencia.Cargo).HasMaxLength(100).IsRequired();
        builder.Property(experiencia => experiencia.Descricao).HasMaxLength(1000);
    }
}
