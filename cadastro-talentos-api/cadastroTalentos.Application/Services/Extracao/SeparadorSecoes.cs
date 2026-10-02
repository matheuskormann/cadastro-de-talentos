namespace cadastroTalentos.Application.Services.Extracao;

internal enum SecaoCurriculo
{
    Cabecalho,
    Sobre,
    Experiencias,
    Formacoes,
    Competencias,
    CompetenciasComportamentais,
    Idiomas,
    Outros
}

internal static class SeparadorSecoes
{
    private const int tamanhoMaximoTitulo = 40;
    private static readonly char[] caracteresDecorativos = [' ', ':', '-', '–', '•', '*', '#', '|', '_', '.'];

    private static readonly Dictionary<SecaoCurriculo, string[]> titulosPorSecao = new()
    {
        [SecaoCurriculo.Sobre] =
        [
            "sobre", "sobre mim", "resumo", "resumo profissional", "perfil", "perfil profissional",
            "objetivo", "objetivos", "objetivo profissional", "apresentacao", "quem sou"
        ],
        [SecaoCurriculo.Experiencias] =
        [
            "experiencia", "experiencias", "experiencia profissional", "experiencias profissionais",
            "historico profissional", "atuacao profissional", "carreira", "trajetoria profissional"
        ],
        [SecaoCurriculo.Formacoes] =
        [
            "formacao", "formacao academica", "formacoes academicas", "educacao", "escolaridade",
            "formacao escolar", "historico academico"
        ],
        [SecaoCurriculo.Competencias] =
        [
            "habilidades", "competencias", "conhecimentos", "habilidades tecnicas", "competencias tecnicas",
            "conhecimentos tecnicos", "tecnologias", "skills", "hard skills",
            "habilidades e competencias", "qualificacoes"
        ],
        [SecaoCurriculo.CompetenciasComportamentais] =
        [
            "soft skills", "habilidades comportamentais", "competencias comportamentais",
            "habilidades interpessoais", "caracteristicas pessoais"
        ],
        [SecaoCurriculo.Idiomas] = ["idiomas", "linguas", "idioma"],
        [SecaoCurriculo.Outros] =
        [
            "cursos", "cursos complementares", "certificacoes", "certificados", "projetos", "contato", "contatos",
            "dados pessoais", "informacoes pessoais", "informacoes adicionais", "referencias", "atividades complementares",
            "premios", "voluntariado", "links"
        ]
    };

    public static Dictionary<SecaoCurriculo, List<string>> Separar(IEnumerable<string> linhas)
    {
        var secoes = Enum.GetValues<SecaoCurriculo>().ToDictionary(secao => secao, _ => new List<string>());
        var secaoAtual = SecaoCurriculo.Cabecalho;

        foreach (var linha in linhas)
        {
            if (IdentificarTitulo(linha) is { } secaoIdentificada)
            {
                secaoAtual = secaoIdentificada;
                continue;
            }

            secoes[secaoAtual].Add(linha);
        }

        return secoes;
    }

    private static SecaoCurriculo? IdentificarTitulo(string linha)
    {
        var titulo = TextoCurriculo.Normalizar(linha).Trim(caracteresDecorativos);

        if (titulo.Length is 0 or > tamanhoMaximoTitulo)
        {
            return null;
        }

        foreach (var (secao, titulos) in titulosPorSecao)
        {
            if (titulos.Contains(titulo))
            {
                return secao;
            }
        }

        return null;
    }
}
