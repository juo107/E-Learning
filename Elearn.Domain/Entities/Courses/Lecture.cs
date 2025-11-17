using Elearn.Domain.Entities.Enums;
using Elearn.Domain.Entities.Courses;

namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Bảng Lecture (Bài học) - Thuộc Section
    /// </summary>
    public class Lecture : BaseEntity
    {
        // Foreign key to Section
        public Guid SectionId { get; set; }
        public Section? Section { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public LectureType Type { get; set; } = LectureType.Video;
        public int? Duration { get; set; } // Thời lượng (giây)
        public string? VideoUrl { get; set; }
        public string? Content { get; set; } // Nội dung text (nếu type = Text)
        public int OrderIndex { get; set; }
        public bool IsPreviewable { get; set; } = false;

        ////Cloudinary
        //public string? PublicId { get; set; }                        // ID Cloudinary
        //public string? FileFormat { get; set; }                      // mp4/mov
        //public long? FileSizeBytes { get; set; }                     // bytes
        //public string? CloudResourceType { get; set; } = "video";    // video


        // Navigation property to Resources
        public ICollection<Resource> Resources { get; set; } = new List<Resource>();

        // Navigation property to LectureContents
        public ICollection<LectureContent> LectureContents { get; set; } = new List<LectureContent>();
    }
}

