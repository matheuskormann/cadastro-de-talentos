# Desenvolvimento

## Organização do trabalho

Dividi o desenvolvimento em etapas: estrutura do backend e do frontend, modelagem do banco, cadastro e consulta de candidatos, leitura dos currículos, criação das telas e ajustes finais. Durante cada etapa, eu executava a aplicação e testava o que havia sido implementado antes de continuar.

## Principais decisões técnicas

- Usei o **PdfPig** para ler o PDF e transformar seu conteúdo em texto. A partir desse texto, os dados do currículo podem ser identificados e enviados ao formulário.
- Integrei a **API da OpenAI** para interpretar o texto e separar informações como dados pessoais, experiências, formações e competências. Isso tornou a extração mais confiável para currículos com formatos diferentes.
- Também mantive uma extração por **expressões regulares (regex)**. Ela funciona como alternativa quando a IA não está configurada ou fica indisponível, evitando que uma falha bloqueie o cadastro.
- Criei uma área de **avaliação**, na qual a IA pode sugerir notas. O recrutador pode revisar e alterar essas notas antes de salvar.
- Adicionei uma tela de **ranking** para facilitar a comparação entre os candidatos cadastrados.
- Os arquivos PDF são armazenados no servidor e seus dados ficam relacionados ao candidato no banco.
- O e-mail é normalizado e deve ser único, evitando cadastros duplicados.
- No frontend, criei componentes reutilizáveis para campos, botões, alertas, modais e outros elementos. Isso ajudou a manter o padrão visual e facilitou a criação das telas.

## Uso de inteligência artificial

Usei o **Claude Code, com o modelo Claude Opus 5.5**, como apoio durante o desenvolvimento. A aplicação também utiliza o **modelo gpt-4.1 da OpenAI** para interpretar currículos e sugerir avaliações.

A IA me ajudou principalmente nas seguintes etapas:

- **Modelagem do banco:** pedi um exemplo de estrutura para armazenar as experiências profissionais de um candidato. Usei a resposta como base e adaptei as tabelas ao projeto.
- **Extração com regex:** pedi ajuda para tornar a identificação dos dados do currículo mais robusta. Depois, testei o resultado com diferentes PDFs e fiz correções pontuais.
- **Validações:** pedi uma revisão das regras dos campos e complementei as validações após testar o formulário.
- **Responsividade:** usei a IA para revisar o comportamento das telas em celulares e tablets e fiz os ajustes necessários.

Exemplos de pedidos feitos:

- “Quero um exemplo de tabela para armazenar a experiência profissional do candidato.”
- “Ajude a melhorar a extração dos dados do currículo por regex.”
- “Revise as validações dos campos para verificar se falta alguma regra.”
- “Verifique se as telas funcionam bem em celulares, sem elementos cortados.”

As respostas foram usadas como ponto de partida. Revisei o código gerado, adaptei nomes e regras ao projeto e descartei sugestões que aumentavam a complexidade sem trazer benefício para o desafio.

## Correções e adaptações

No início, o modelo do candidato era mais simples. Durante o desenvolvimento, percebi que um candidato poderia ter várias experiências, formações e competências. Por isso, separei essas informações em tabelas relacionadas.

A extração somente com regex também começou a exigir muitas regras para lidar com formatos diferentes de currículo. A principal adaptação foi integrar a OpenAI para interpretar o texto, mantendo o regex como alternativa. Os testes com os PDFs fictícios ajudaram a corrigir erros de identificação de nomes, cargos e períodos profissionais.

## Verificação da solução

Testei os endpoints inicialmente pelo Swagger e, depois, pelo próprio frontend. Verifiquei o cadastro manual, o cadastro com PDF, a edição, a exclusão, a listagem e a tela de detalhes.

Também criei quatro currículos fictícios para comparar a extração feita pela IA e pelo regex. A cada alteração, executava novamente o projeto para encontrar e corrigir erros. Por fim, rodei o build do backend, o typecheck, o lint e o build do frontend.

## Tempo dedicado

Aproximadamente 16 horas, entre 29/09/2026 e 04/10/2026.

## Dificuldades e limitações

A principal dificuldade foi extrair dados de currículos que não seguem um formato padrão. A integração com a IA melhorou esse processo, mas mantive o regex para que a aplicação não dependa totalmente de um serviço externo.

Limitações atuais:

- O regex foi ajustado com quatro modelos de currículo e pode não reconhecer formatos muito diferentes.
- PDFs digitalizados como imagem não são lidos, pois a aplicação não possui OCR.
- A IA pode interpretar algum dado incorretamente, por isso o formulário permite revisar tudo antes de salvar.
- Quando o currículo informa apenas mês e ano, o dia é registrado como 01.
- A edição do candidato ainda não permite substituir o PDF anexado.

## Melhorias futuras

Com mais tempo, eu criaria um cadastro de vagas para comparar os candidatos com os requisitos de cada oportunidade. Isso daria mais contexto para as notas sugeridas pela IA. Também adicionaria registro das outras etapas do processo seletivo, como entrevistas, observações e decisão de contratação.
