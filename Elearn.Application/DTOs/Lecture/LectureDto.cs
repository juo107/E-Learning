namespace Elearn.Application.DTOs.Lecture
{
    public class LectureDto
    {
        public Guid Id { get; set; }
        public Guid SectionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Video, Text, Quiz, Assignment
        public int? Duration { get; set; } // Thời lượng (giây)
        public string? VideoUrl { get; set; }
        public string? Content { get; set; }
        public int OrderIndex { get; set; }
        public bool IsPreviewable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int ResourcesCount { get; set; }
    }
}

