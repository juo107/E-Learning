namespace Elearn.Application.DTOs.Lecture
{
    public class CreateLectureDto
    {
        public Guid SectionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = "Video"; // Video, Text, Quiz, Assignment
        public int? Duration { get; set; } // Thời lượng (giây)
        public string? VideoUrl { get; set; }
        public string? Content { get; set; }
        public int OrderIndex { get; set; }
        public bool IsPreviewable { get; set; } = false;
    }
}

