namespace Elearn.Application.DTOs.Resource
{
    public class CreateResourceDto
    {
        public Guid LectureId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string ResourceType { get; set; } = "Pdf"; // Pdf, Zip, Code, Image, Link
        public int? FileSizeKB { get; set; }
    }
}

