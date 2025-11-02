using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Promotion
{
    public class PromotionDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public PromotionType Type { get; set; }
        public decimal Value { get; set; }
        public PromotionScope Scope { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? MaxUsageCount { get; set; }
        public int UsageCount { get; set; }
        public string? Code { get; set; }
        public bool RequireCode { get; set; }
        public bool IsActive { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public decimal? MaximumDiscountAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // List of course IDs if Scope = SpecificCourses
        public List<Guid>? CourseIds { get; set; }
    }
}

