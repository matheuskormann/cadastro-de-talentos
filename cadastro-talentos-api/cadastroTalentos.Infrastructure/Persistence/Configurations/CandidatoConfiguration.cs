using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class CandidatoConfiguration : IEntityTypeConfiguration<Candidato>
{
    public void Configure(EntityTypeBuilder<Candidato> builder)
    {
        builder.ToTable("Candidatos");
        builder.HasKey(candidato => candidato.Id);

        builder.Property(candidato => candidato.NomeCompleto).HasMaxLength(150).IsRequired();
        builder.Property(candidato => candidato.Email).HasMaxLength(254).IsRequired();
        builder.Property(candidato => candidato.Telefone).HasMaxLength(20);
        builder.Property(candidato => candidato.Cidade).HasMaxLength(100);
        builder.Property(candidato => candidato.Estado).HasMaxLength(2).IsFixedLength().IsUnicode(false);
        builder.Property(candidato => candidato.Sobre).HasMaxLength(2000);
        builder.Property(candidato => candidato.OrigemCadastro).HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(candidato => candidato.Email).IsUnique();

        builder.HasMany(candidato => candidato.Experiencias)
            .WithOne()
            .HasForeignKey(experiencia => experiencia.CandidatoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(candidato => candidato.Formacoes)
            .WithOne()
            .HasForeignKey(formacao => formacao.CandidatoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(candidato => candidato.Competencias)
            .WithOne()
            .HasForeignKey(competencia => competencia.CandidatoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(candidato => candidato.Curriculo)
            .WithOne()
            .HasForeignKey<CurriculoCandidato>(curriculo => curriculo.CandidatoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(candidato => candidato.Avaliacao)
            .WithOne()
            .HasForeignKey<AvaliacaoCandidato>(avaliacao => avaliacao.CandidatoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
