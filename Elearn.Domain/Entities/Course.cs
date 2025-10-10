namespace Elearn.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
