using System.ComponentModel.DataAnnotations;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Promotion
{
    public class CreatePromotionDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = default!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public PromotionType Type { get; set; } = PromotionType.Percentage;

        [Required]
        [Range(0.01, 100, ErrorMessage = "Value must be between 0.01 and 100")]
        public decimal Value { get; set; }

        [Required]
        public PromotionScope Scope { get; set; }

        public Guid? CategoryId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "MaxUsageCount must be greater than 0")]
        public int? MaxUsageCount { get; set; }

        [MaxLength(50)]
        public string? Code { get; set; }

        public bool RequireCode { get; set; } = false;

        public bool IsActive { get; set; } = true;

        [Range(0, double.MaxValue, ErrorMessage = "MinimumOrderAmount must be greater than or equal to 0")]
        public decimal? MinimumOrderAmount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "MaximumDiscountAmount must be greater than or equal to 0")]
        public decimal? MaximumDiscountAmount { get; set; }

        // List of course IDs if Scope = SpecificCourses
        public List<Guid>? CourseIds { get; set; }
    }
}

