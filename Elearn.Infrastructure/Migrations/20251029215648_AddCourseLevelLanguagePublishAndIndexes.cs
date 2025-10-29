using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elearn.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseLevelLanguagePublishAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories",
                newName: "IX_Category_ParentCategoryId");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Courses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Language",
                table: "Courses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Courses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "Courses",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Course_Category_IsPublished_CreatedAt",
                table: "Courses",
                columns: new[] { "CategoryId", "IsPublished", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Course_IsPublished_CreatedAt",
                table: "Courses",
                columns: new[] { "IsPublished", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Course_IsPublished_Price",
                table: "Courses",
                columns: new[] { "IsPublished", "Price" });

            migrationBuilder.CreateIndex(
                name: "IX_Course_Level_Language_IsPublished",
                table: "Courses",
                columns: new[] { "Level", "Language", "IsPublished" });

            migrationBuilder.CreateIndex(
                name: "IX_Course_PublishedAt",
                table: "Courses",
                column: "PublishedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CourseCode",
                table: "Courses",
                column: "CourseCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Course_Category_IsPublished_CreatedAt",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Course_IsPublished_CreatedAt",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Course_IsPublished_Price",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Course_Level_Language_IsPublished",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Course_PublishedAt",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_CourseCode",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "Courses");

            migrationBuilder.RenameIndex(
                name: "IX_Category_ParentCategoryId",
                table: "Categories",
                newName: "IX_Categories_ParentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses",
                column: "CategoryId");
        }
    }
}
