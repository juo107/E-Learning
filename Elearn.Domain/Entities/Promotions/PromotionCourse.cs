namespace Elearn.Domain.Entities
{
    public class PromotionCourse : BaseEntity
    {
        public Guid PromotionId { get; set; }
        public Promotion Promotion { get; set; } = null!;
        
        public Guid CourseId { get; set; }
        public Course Course { get; set; } = null!;
    }
}

