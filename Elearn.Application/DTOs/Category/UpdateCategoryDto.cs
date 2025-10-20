namespace Elearn.Application.DTOs.Category
{
    public class UpdateCategoryDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? ParentCategoryId { get; set; }
    }
}