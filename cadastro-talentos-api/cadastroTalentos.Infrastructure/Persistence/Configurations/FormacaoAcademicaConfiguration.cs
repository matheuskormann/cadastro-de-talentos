using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class FormacaoAcademicaConfiguration : IEntityTypeConfiguration<FormacaoAcademica>
{
    public void Configure(EntityTypeBuilder<FormacaoAcademica> builder)
    {
        builder.ToTable("FormacoesAcademicas");
        builder.HasKey(formacao => formacao.Id);

        builder.Property(formacao => formacao.Instituicao).HasMaxLength(150).IsRequired();
        builder.Property(formacao => formacao.Curso).HasMaxLength(150);
        builder.Property(formacao => formacao.Nivel).HasConversion<string>().HasMaxLength(20);
    }
}
