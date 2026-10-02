namespace cadastroTalentos.Infrastructure.Extracao;

internal static class EsquemaExtracaoCurriculo
{
    public const string Nome = "dados_curriculo";

    public const string InstrucoesSistema =
        """
        Você extrai dados estruturados de currículos em português.
        Regras:
        - Use somente informações presentes no texto. Nunca invente dados; quando não encontrar, retorne null (ou lista vazia).
        - Escreva nomes próprios com apenas as iniciais maiúsculas (por exemplo, "Maria da Silva"), mesmo que o currículo use caixa alta.
        - Datas no formato AAAA-MM-DD. Se houver apenas mês e ano, use o dia 01; se houver apenas o ano, use 01 de janeiro.
        - Preencha "dataNascimento" apenas se a data estiver explícita. Se o currículo informar só a idade, preencha "idade".
        - "estado" é a sigla da UF com duas letras maiúsculas.
        - "sobre" é o resumo ou objetivo profissional do candidato, com no máximo 2000 caracteres.
        - Em experiências, "empregoAtual" é true quando o candidato ainda trabalha no local; nesse caso "dataFim" é null.
        - Em formações, "emAndamento" é true quando o curso não foi concluído; nesse caso "dataConclusao" é null.
        - Em competências, classifique como "Tecnica" (ferramentas, linguagens, conhecimentos), "Comportamental" (soft skills) ou "Idioma".

        Além de extrair os dados, preencha "avaliacao" com notas inteiras de 0 a 10, usando somente o que está escrito no currículo.
        As notas são uma sugestão inicial que será revisada por um recrutador.
        - "notaExperiencia": considere o tempo total de experiência, a progressão de cargos e o nível de detalhe das atividades.
          Referência: sem experiência, 0 a 2; até 2 anos, 3 a 5; de 2 a 5 anos, 5 a 7; de 5 a 10 anos, 7 a 9; mais de 10 anos com liderança, 9 a 10.
        - "notaFormacao": considere o nível mais alto e se foi concluído.
          Referência: fundamental, 1 a 2; médio, 3 a 4; técnico ou tecnólogo, 5 a 6; graduação em andamento, 5 a 6; graduação concluída, 7;
          pós-graduação, 8; mestrado, 9; doutorado, 10. Cursos complementares e certificações podem somar 1 ponto.
        - "notaComunicacao": considere apenas a clareza, a organização e a correção do texto do currículo. Não é possível avaliar a comunicação oral.
        - Cada justificativa deve ter uma frase curta e objetiva, citando o que no currículo levou à nota.
        - Não considere idade, gênero, nome, cidade, estado civil nem qualquer característica pessoal na avaliação.
        """;

    public const string JsonSchema =
        """
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["nomeCompleto", "email", "telefone", "dataNascimento", "idade", "cidade", "estado", "sobre", "experiencias", "formacoes", "competencias", "avaliacao"],
          "properties": {
            "nomeCompleto": { "type": ["string", "null"] },
            "email": { "type": ["string", "null"] },
            "telefone": { "type": ["string", "null"] },
            "dataNascimento": { "type": ["string", "null"] },
            "idade": { "type": ["integer", "null"] },
            "cidade": { "type": ["string", "null"] },
            "estado": { "type": ["string", "null"] },
            "sobre": { "type": ["string", "null"] },
            "experiencias": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["empresa", "cargo", "dataInicio", "dataFim", "empregoAtual", "descricao"],
                "properties": {
                  "empresa": { "type": ["string", "null"] },
                  "cargo": { "type": ["string", "null"] },
                  "dataInicio": { "type": ["string", "null"] },
                  "dataFim": { "type": ["string", "null"] },
                  "empregoAtual": { "type": "boolean" },
                  "descricao": { "type": ["string", "null"] }
                }
              }
            },
            "formacoes": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["instituicao", "curso", "nivel", "dataInicio", "dataConclusao", "emAndamento"],
                "properties": {
                  "instituicao": { "type": ["string", "null"] },
                  "curso": { "type": ["string", "null"] },
                  "nivel": { "type": "string", "enum": ["Fundamental", "Medio", "Tecnico", "Tecnologo", "Graduacao", "PosGraduacao", "Mestrado", "Doutorado"] },
                  "dataInicio": { "type": ["string", "null"] },
                  "dataConclusao": { "type": ["string", "null"] },
                  "emAndamento": { "type": "boolean" }
                }
              }
            },
            "competencias": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["nome", "tipo", "nivel"],
                "properties": {
                  "nome": { "type": ["string", "null"] },
                  "tipo": { "type": "string", "enum": ["Tecnica", "Comportamental", "Idioma"] },
                  "nivel": { "type": ["string", "null"], "enum": ["Basico", "Intermediario", "Avancado", "Fluente", null] }
                }
              }
            },
            "avaliacao": {
              "type": "object",
              "additionalProperties": false,
              "required": ["notaExperiencia", "justificativaExperiencia", "notaFormacao", "justificativaFormacao", "notaComunicacao", "justificativaComunicacao"],
              "properties": {
                "notaExperiencia": { "type": "integer" },
                "justificativaExperiencia": { "type": "string" },
                "notaFormacao": { "type": "integer" },
                "justificativaFormacao": { "type": "string" },
                "notaComunicacao": { "type": "integer" },
                "justificativaComunicacao": { "type": "string" }
              }
            }
          }
        }
        """;
}
