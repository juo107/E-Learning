using Elearn.Domain.Entities.Enums;
using Elearn.Domain.Entities.Identity;

namespace Elearn.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        
        // Course difficulty level
        public CourseLevel Level { get; set; } = CourseLevel.Beginner;

        // Course language (vi/en)
        public CourseLanguage Language { get; set; } = CourseLanguage.Vi;
        
        // Foreign key to Category
        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
        
        // Foreign key to InstructorProfile
        public int? InstructorProfileId { get; set; }
        public InstructorProfile? InstructorProfile { get; set; }
        
        // Publication state
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
        
        // Discount fields
        public float? DiscountPercent { get; set; }
        public decimal? FinalPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
        
        // Navigation property to CourseMedia
        public ICollection<CourseMedia> CourseMedias { get; set; } = new List<CourseMedia>();
        
        // Navigation property to Sections
        public ICollection<Section> Sections { get; set; } = new List<Section>();
    }
}

