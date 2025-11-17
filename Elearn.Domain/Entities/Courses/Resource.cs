using Elearn.Domain.Entities.Enums;

namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Bảng Resource (Tài nguyên đính kèm) - Thuộc Lecture
    /// </summary>
    public class Resource : BaseEntity
    {
        // Foreign key to Lecture
        public Guid LectureId { get; set; }
        public Lecture? Lecture { get; set; }
        
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public ResourceType ResourceType { get; set; } = ResourceType.Pdf;
        public int? FileSizeKB { get; set; }

        // Clodinary
        //public string PublicId { get; set; } = string.Empty;          // Cloudinary id
        //public string FileFormat { get; set; } = string.Empty;        // pdf, docx, zip...
        //public long FileSizeBytes { get; set; }                        // bytes
        //public string CloudResourceType { get; set; } = "raw";         // raw (PDF, DOCX)

    }
}

