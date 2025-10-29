using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Course
{
    public class UpdateCourseDto
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public Guid? CategoryId { get; set; }
        public CourseLevel? Level { get; set; }
        public CourseLanguage? Language { get; set; }
        public bool? IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public float? DiscountPercent { get; set; }
        public decimal? FinalPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
    }
}
