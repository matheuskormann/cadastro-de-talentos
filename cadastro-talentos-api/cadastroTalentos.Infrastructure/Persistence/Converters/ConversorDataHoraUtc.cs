using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace cadastroTalentos.Infrastructure.Persistence.Converters;

public class ConversorDataHoraUtc() : ValueConverter<DateTime, DateTime>(
    valor => valor.ToUniversalTime(),
    valor => DateTime.SpecifyKind(valor, DateTimeKind.Utc));
