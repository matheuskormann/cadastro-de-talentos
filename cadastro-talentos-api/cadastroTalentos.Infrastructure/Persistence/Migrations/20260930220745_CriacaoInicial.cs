using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cadastroTalentos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Candidatos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NomeCompleto = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(254)", maxLength: 254, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DataNascimento = table.Column<DateOnly>(type: "date", nullable: true),
                    DataNascimentoEstimada = table.Column<bool>(type: "bit", nullable: false),
                    Cidade = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "char(2)", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    Sobre = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    OrigemCadastro = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidatos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AvaliacoesCandidato",
                columns: table => new
                {
                    CandidatoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NotaExperiencia = table.Column<byte>(type: "tinyint", nullable: false),
                    NotaFormacao = table.Column<byte>(type: "tinyint", nullable: false),
                    NotaComunicacao = table.Column<byte>(type: "tinyint", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvaliacoesCandidato", x => x.CandidatoId);
                    table.CheckConstraint("CK_AvaliacoesCandidato_NotaComunicacao", "[NotaComunicacao] BETWEEN 0 AND 10");
                    table.CheckConstraint("CK_AvaliacoesCandidato_NotaExperiencia", "[NotaExperiencia] BETWEEN 0 AND 10");
                    table.CheckConstraint("CK_AvaliacoesCandidato_NotaFormacao", "[NotaFormacao] BETWEEN 0 AND 10");
                    table.ForeignKey(
                        name: "FK_AvaliacoesCandidato_Candidatos_CandidatoId",
                        column: x => x.CandidatoId,
                        principalTable: "Candidatos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Competencias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CandidatoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Nivel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competencias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Competencias_Candidatos_CandidatoId",
                        column: x => x.CandidatoId,
                        principalTable: "Candidatos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CurriculosCandidato",
                columns: table => new
                {
                    CandidatoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NomeOriginal = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ChaveArmazenamento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TipoConteudo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TamanhoBytes = table.Column<long>(type: "bigint", nullable: false),
                    DataEnvio = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurriculosCandidato", x => x.CandidatoId);
                    table.ForeignKey(
                        name: "FK_CurriculosCandidato_Candidatos_CandidatoId",
                        column: x => x.CandidatoId,
                        principalTable: "Candidatos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExperienciasProfissionais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CandidatoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Empresa = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Cargo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    DataFim = table.Column<DateOnly>(type: "date", nullable: true),
                    EmpregoAtual = table.Column<bool>(type: "bit", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExperienciasProfissionais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExperienciasProfissionais_Candidatos_CandidatoId",
                        column: x => x.CandidatoId,
                        principalTable: "Candidatos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormacoesAcademicas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CandidatoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Instituicao = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Curso = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Nivel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DataInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    DataConclusao = table.Column<DateOnly>(type: "date", nullable: true),
                    EmAndamento = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormacoesAcademicas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormacoesAcademicas_Candidatos_CandidatoId",
                        column: x => x.CandidatoId,
                        principalTable: "Candidatos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Candidatos_Email",
                table: "Candidatos",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Competencias_CandidatoId",
                table: "Competencias",
                column: "CandidatoId");

            migrationBuilder.CreateIndex(
                name: "IX_CurriculosCandidato_ChaveArmazenamento",
                table: "CurriculosCandidato",
                column: "ChaveArmazenamento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExperienciasProfissionais_CandidatoId",
                table: "ExperienciasProfissionais",
                column: "CandidatoId");

            migrationBuilder.CreateIndex(
                name: "IX_FormacoesAcademicas_CandidatoId",
                table: "FormacoesAcademicas",
                column: "CandidatoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvaliacoesCandidato");

            migrationBuilder.DropTable(
                name: "Competencias");

            migrationBuilder.DropTable(
                name: "CurriculosCandidato");

            migrationBuilder.DropTable(
                name: "ExperienciasProfissionais");

            migrationBuilder.DropTable(
                name: "FormacoesAcademicas");

            migrationBuilder.DropTable(
                name: "Candidatos");
        }
    }
}
