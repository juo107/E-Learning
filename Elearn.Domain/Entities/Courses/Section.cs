namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Bảng Section (Chương / Phần) - Thuộc khóa học
    /// </summary>
    public class Section : BaseEntity
    {
        // Foreign key to Course
        public Guid CourseId { get; set; }
        public Course? Course { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
        public bool IsPreviewable { get; set; } = false;
        
        // Navigation property to Lectures
        public ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();
    }
}

