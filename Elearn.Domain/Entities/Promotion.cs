using Elearn.Domain.Entities.Enums;

namespace Elearn.Domain.Entities
{
    public class Promotion : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        // Loại khuyến mãi
        public PromotionType Type { get; set; } = PromotionType.Percentage;
        
        // Giá trị khuyến mãi (phần trăm)
        public decimal Value { get; set; }
        
        // Phạm vi áp dụng
        public PromotionScope Scope { get; set; } = PromotionScope.All;
        
        // Category ID nếu Scope = Category
        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
        
        // Thời gian bắt đầu và kết thúc
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        // Số lượng sử dụng tối đa (null = không giới hạn)
        public int? MaxUsageCount { get; set; }
        
        // Số lần đã sử dụng
        public int UsageCount { get; set; } = 0;
        
        // Code khuyến mãi (nếu cần)
        public string? Code { get; set; }
        
        // Có yêu cầu code không
        public bool RequireCode { get; set; } = false;
        
        // Trạng thái active
        public bool IsActive { get; set; } = true;
        
        // Minimum order amount để áp dụng (nếu có)
        public decimal? MinimumOrderAmount { get; set; }
        
        // Maximum discount amount (để giới hạn số tiền giảm tối đa)
        public decimal? MaximumDiscountAmount { get; set; }
        
        // Navigation properties
        public ICollection<PromotionCourse> PromotionCourses { get; set; } = new List<PromotionCourse>();
    }
}

