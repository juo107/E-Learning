namespace Elearn.Application.DTOs.Course
{
    public class CourseDetailsDto
    {
        public Guid Id { get; set; }
        public string CourseCode { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public float? DiscountPercent { get; set; }
        public decimal? FinalPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
        
        // Media fields from CourseMedia
        public string? ThumbnailUrl { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public string? PromoVideoUrl { get; set; }
    }
}
