using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elearn.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscountFieldsToCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountExpiresAt",
                table: "Courses",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "DiscountPercent",
                table: "Courses",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FinalPrice",
                table: "Courses",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountExpiresAt",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "FinalPrice",
                table: "Courses");
        }
    }
}
