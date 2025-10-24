using System.ComponentModel.DataAnnotations;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.CourseMedia
{
    public class UpdateCourseMediaDto
    {
        public MediaType? MediaType { get; set; }
        
        [MaxLength(1000)]
        public string? MediaUrl { get; set; }
        
        [MaxLength(1000)]
        public string? ThumbnailUrl { get; set; }
        
        [MaxLength(255)]
        public string? AltText { get; set; }
        
        public bool? IsPrimary { get; set; }
        
        public int? OrderIndex { get; set; }
        
        public int? Width { get; set; }
        
        public int? Height { get; set; }
        
        public int? FileSizeKB { get; set; }
        
        public MediaStatus? Status { get; set; }
    }
}
