using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Domain.Entities
{
    public class CourseMedia : BaseEntity
    {
        [Required]
        public Guid CourseId { get; set; }
        
        [Required]
        public MediaType MediaType { get; set; } = MediaType.Image;
        
        [Required]
        [MaxLength(1000)]
        public string MediaUrl { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? ThumbnailUrl { get; set; }
        
        [MaxLength(255)]
        public string? AltText { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int OrderIndex { get; set; } = 0;
        
        public int? Width { get; set; }
        
        public int? Height { get; set; }
        
        public int? FileSizeKB { get; set; }
        
        [Required]
        public MediaStatus Status { get; set; } = MediaStatus.Active;

        //Clodinary 
        //public string PublicId { get; set; } = string.Empty;       // ID Cloudinary để xóa file
        //public string FileFormat { get; set; } = string.Empty;     // jpg, png, webp, mp4,...
        //public long FileSizeBytes { get; set; }                    // dung lượng tính theo bytes
        //public string CloudResourceType { get; set; } = "image";   // image | video


        // Navigation property
        public Course? Course { get; set; }
    }
}

