using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Core.Interfaces;
using cadastroTalentos.Infrastructure.Armazenamento;
using cadastroTalentos.Infrastructure.Extracao;
using cadastroTalentos.Infrastructure.Pdf;
using cadastroTalentos.Infrastructure.Persistence;
using cadastroTalentos.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace cadastroTalentos.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection servicos, IConfiguration configuracao)
    {
        var stringConexao = configuracao.GetConnectionString("CadastroTalentos")
            ?? throw new InvalidOperationException("A connection string 'CadastroTalentos' não foi configurada.");

        servicos.AddDbContext<CadastroTalentosDbContext>(opcoes => opcoes.UseSqlServer(stringConexao));
        servicos.AddScoped<ICandidatoRepository, CandidatoRepository>();

        servicos.Configure<ArmazenamentoOpcoes>(configuracao.GetSection(ArmazenamentoOpcoes.Secao));
        servicos.Configure<OpenAiOpcoes>(configuracao.GetSection(OpenAiOpcoes.Secao));

        servicos.AddSingleton<IArmazenamentoArquivos, ArmazenamentoLocal>();
        servicos.AddSingleton<ILeitorPdf, LeitorPdfPig>();
        servicos.AddSingleton<IExtratorDadosCurriculo, ExtratorCurriculoOpenAi>();

        return servicos;
    }
}
