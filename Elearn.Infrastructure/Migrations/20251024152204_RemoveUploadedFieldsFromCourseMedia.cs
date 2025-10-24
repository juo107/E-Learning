using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elearn.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUploadedFieldsFromCourseMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UploadedAt",
                table: "CourseMedias");

            migrationBuilder.DropColumn(
                name: "UploadedBy",
                table: "CourseMedias");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UploadedAt",
                table: "CourseMedias",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UploadedBy",
                table: "CourseMedias",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
