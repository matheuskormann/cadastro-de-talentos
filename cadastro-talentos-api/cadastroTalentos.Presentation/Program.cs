using System.Text.Json.Serialization;
using cadastroTalentos.Application;
using cadastroTalentos.Infrastructure;
using cadastroTalentos.Presentation.Middlewares;
using DotNetEnv;

const string politicaCorsFrontend = "Frontend";

Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

var origensPermitidas = builder.Configuration.GetSection("Cors:OrigensPermitidas").Get<string[]>() ?? [];

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

builder.Services
    .AddControllers(opcoes => opcoes.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
    .AddJsonOptions(opcoes => opcoes.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.ConfigureHttpJsonOptions(opcoes => opcoes.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<TratadorExcecoesGlobal>();

builder.Services.AddCors(opcoes =>
    opcoes.AddPolicy(politicaCorsFrontend, politica =>
        politica.WithOrigins(origensPermitidas).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(opcoes =>
    {
        opcoes.SwaggerEndpoint("/openapi/v1.json", "Cadastro de Talentos API");
        opcoes.DocumentTitle = "Cadastro de Talentos API";
    });
}

app.UseHttpsRedirection();

app.UseCors(politicaCorsFrontend);

app.UseAuthorization();

app.MapControllers();

app.Run();
