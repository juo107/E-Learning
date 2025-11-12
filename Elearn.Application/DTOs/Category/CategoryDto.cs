namespace Elearn.Application.DTOs.Category
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
        public int SubCategoriesCount { get; set; }
        public int CoursesCount { get; set; }
        /// <summary>
        /// SubCategories for mega menu (only populated when needed)
        /// </summary>
        public List<CategoryDto>? SubCategories { get; set; }
    }
}
