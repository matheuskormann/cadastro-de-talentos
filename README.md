# Cadastro de Talentos

Aplicação para a equipe de recrutamento cadastrar e consultar candidatos, com cadastro manual ou a partir de um currículo em PDF.

## Estrutura

```
desafioCurriculos/
├── cadastro-talentos-api/                 Backend ASP.NET Core
│   ├── cadastroTalentos.Core/             Entidades e contratos de domínio
│   ├── cadastroTalentos.Application/      Casos de uso, DTOs e validações
│   ├── cadastroTalentos.Infrastructure/   EF Core, migrations, leitura de PDF
│   ├── cadastroTalentos.Presentation/     API (controllers, configuração)
│   └── cadastroTalentos.sln
├── cadastro-talentos-web/                 Frontend Next.js (React)
│    └── src/
│       └── app/                           Rotas (App Router)
└── docs/                                  currículos de teste
```

## Tecnologias

| Camada   | Tecnologia                         | Versão  |
| -------- | ---------------------------------- | ------- |
| Backend  | .NET SDK / ASP.NET Core            | 9.0     |
| Backend  | Entity Framework Core (SqlServer)  | 9.0.9   |
| Backend  | FluentValidation                   | 12.1.1  |
| Backend  | PdfPig (leitura de PDF)            | 0.1.16  |
| Backend  | OpenAI (SDK oficial .NET)          | 2.5.0   |
| Backend  | Swashbuckle SwaggerUI              | 10.2.3  |
| Backend  | DotNetEnv                          | 3.2.0   |
| Banco    | SQL Server Express                 | —       |
| Frontend | Next.js                            | 16.3.7  |
| Frontend | React                              | 19.2.8  |
| Frontend | TypeScript                         | 5       |
| Runtime  | Node.js                            | 24.11.1 |

## Como executar

### Pré-requisitos

- .NET SDK 9
- Node.js 20+
- SQL Server (instância local `localhost\SQLEXPRESS`)

### 1. Backend

```bash
cd cadastro-talentos-api
dotnet tool restore
dotnet restore
dotnet ef database update --project cadastroTalentos.Infrastructure --startup-project cadastroTalentos.Presentation
dotnet run --project cadastroTalentos.Presentation
```

- `dotnet tool restore` instala o `dotnet-ef` na versão fixada no projeto (`.config/dotnet-tools.json`).
- `dotnet ef database update` cria o banco `CadastroTalentos` e aplica todas as migrations.
- API em `http://localhost:5112` — documentação Swagger em `http://localhost:5112/swagger`.
- Para a leitura do currículo com IA, copie `.env.example` para `.env` e informe `OPENAI_API_KEY`. Sem a chave, a leitura usa expressões regulares.

### 2. Frontend

Em outro terminal:

```bash
cd cadastro-talentos-web
cp .env.example .env.local
npm install
npm run dev
```

Aplicação em `http://localhost:3000`.


Mais detalhes em [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).

## Autor

**Matheus Kormann**
E-mail: [matheuskormann.s@gmail.com](mailto:matheuskormann.s@gmail.com)

