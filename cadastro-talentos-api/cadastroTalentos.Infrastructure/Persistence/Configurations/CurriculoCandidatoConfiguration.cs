using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class CurriculoCandidatoConfiguration : IEntityTypeConfiguration<CurriculoCandidato>
{
    public void Configure(EntityTypeBuilder<CurriculoCandidato> builder)
    {
        builder.ToTable("CurriculosCandidato");
        builder.HasKey(curriculo => curriculo.CandidatoId);

        builder.Property(curriculo => curriculo.NomeOriginal).HasMaxLength(255).IsRequired();
        builder.Property(curriculo => curriculo.ChaveArmazenamento).HasMaxLength(100).IsRequired();
        builder.Property(curriculo => curriculo.TipoConteudo).HasMaxLength(100).IsRequired();

        builder.HasIndex(curriculo => curriculo.ChaveArmazenamento).IsUnique();
    }
}
