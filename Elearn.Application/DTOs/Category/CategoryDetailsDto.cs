using Elearn.Application.DTOs.Course;

namespace Elearn.Application.DTOs.Category
{
    public class CategoryDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
        public List<CategoryDto>? SubCategories { get; set; }
        public List<CourseDto>? Courses { get; set; }
    }
}
