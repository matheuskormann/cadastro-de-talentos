using cadastroTalentos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cadastroTalentos.Infrastructure.Persistence.Configurations;

public class AvaliacaoCandidatoConfiguration : IEntityTypeConfiguration<AvaliacaoCandidato>
{
    private static readonly string[] colunasNota = ["NotaExperiencia", "NotaFormacao", "NotaComunicacao"];

    public void Configure(EntityTypeBuilder<AvaliacaoCandidato> builder)
    {
        builder.ToTable("AvaliacoesCandidato", tabela =>
        {
            foreach (var colunaNota in colunasNota)
            {
                tabela.HasCheckConstraint(
                    $"CK_AvaliacoesCandidato_{colunaNota}",
                    $"[{colunaNota}] BETWEEN {AvaliacaoCandidato.NotaMinima} AND {AvaliacaoCandidato.NotaMaxima}");
            }
        });

        builder.HasKey(avaliacao => avaliacao.CandidatoId);

        builder.Property(avaliacao => avaliacao.Comentario).HasMaxLength(2000);
        builder.Ignore(avaliacao => avaliacao.NotaGeral);
    }
}
