using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.CourseMedia
{
    public class CourseMediaDto
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public MediaType MediaType { get; set; }
        public string MediaUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? AltText { get; set; }
        public bool IsPrimary { get; set; }
        public int OrderIndex { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? FileSizeKB { get; set; }
        public MediaStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
