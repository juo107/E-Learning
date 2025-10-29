using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Course
{
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string CourseCode { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public CourseLevel Level { get; set; }
        public CourseLanguage Language { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime CreatedAt { get; set; }
        public float? DiscountPercent { get; set; }
        public decimal? FinalPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
        
        // Media fields from CourseMedia
        public string? ThumbnailUrl { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public string? PromoVideoUrl { get; set; }
    }
}
