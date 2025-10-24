namespace Elearn.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        
        // Foreign key to Category
        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
        
        // Discount fields
        public float? DiscountPercent { get; set; }
        public decimal? FinalPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
        
        // Navigation property to CourseMedia
        public ICollection<CourseMedia> CourseMedias { get; set; } = new List<CourseMedia>();
    }
}
