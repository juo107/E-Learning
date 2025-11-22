using Elearn.Domain.Entities.Identity;

namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Bảng CourseReview - Đánh giá khóa học
    /// </summary>
    public class CourseReview : BaseEntity
    {
        // Foreign key to Course
        public Guid CourseId { get; set; }
        public Course? Course { get; set; }
        
        // Foreign key to User (Student)
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }
        
        // Rating from 1 to 5
        public int Rating { get; set; }
        
        // Review comment
        public string? Comment { get; set; }
        
        // Moderation fields
        public bool IsApproved { get; set; } = false; // ContentAdmin approves
        public bool IsHidden { get; set; } = false; // ContentAdmin can hide
        
        // Optional: Helpful count
        public int HelpfulCount { get; set; } = 0;
    }
}

