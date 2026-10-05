using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cadastroTalentos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DesativarFechamentoAutomatico : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER DATABASE CURRENT SET AUTO_CLOSE OFF;", suppressTransaction: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER DATABASE CURRENT SET AUTO_CLOSE ON;", suppressTransaction: true);
        }
    }
}
