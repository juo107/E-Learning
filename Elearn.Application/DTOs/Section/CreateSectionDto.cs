namespace Elearn.Application.DTOs.Section
{
    public class CreateSectionDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
        public bool IsPreviewable { get; set; } = false;
    }
}

