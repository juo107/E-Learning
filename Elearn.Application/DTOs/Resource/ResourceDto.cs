namespace Elearn.Application.DTOs.Resource
{
    public class ResourceDto
    {
        public Guid Id { get; set; }
        public Guid LectureId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string ResourceType { get; set; } = string.Empty; // Pdf, Zip, Code, Image, Link
        public int? FileSizeKB { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

