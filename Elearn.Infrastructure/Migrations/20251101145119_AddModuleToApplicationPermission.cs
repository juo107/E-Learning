using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elearn.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddModuleToApplicationPermission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Module",
                table: "ApplicationPermissions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Module",
                table: "ApplicationPermissions");
        }
    }
}
