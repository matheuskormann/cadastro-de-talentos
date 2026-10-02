namespace cadastroTalentos.Application.Exceptions;

public class LeituraCurriculoException(string mensagem, Exception? causa = null) : Exception(mensagem, causa);
