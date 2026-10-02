using cadastroTalentos.Application.Interfaces;
using cadastroTalentos.Application.Services;
using cadastroTalentos.Application.Services.Extracao;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace cadastroTalentos.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection servicos)
    {
        servicos.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        servicos.AddScoped<ICandidatoService, CandidatoService>();
        servicos.AddScoped<ICurriculoService, CurriculoService>();
        servicos.AddSingleton<IExtratorDadosCurriculo, ExtratorCurriculoRegex>();

        return servicos;
    }
}
