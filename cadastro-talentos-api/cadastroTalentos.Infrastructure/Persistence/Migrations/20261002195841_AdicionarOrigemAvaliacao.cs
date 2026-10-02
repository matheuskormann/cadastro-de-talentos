using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cadastroTalentos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarOrigemAvaliacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SugeridaPorIa",
                table: "AvaliacoesCandidato",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SugeridaPorIa",
                table: "AvaliacoesCandidato");
        }
    }
}
