using System.ComponentModel.DataAnnotations;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.CourseMedia
{
    public class CreateCourseMediaDto
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
    }
}
