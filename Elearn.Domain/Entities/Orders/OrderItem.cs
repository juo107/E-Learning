using Elearn.Domain.Entities.Identity;

namespace Elearn.Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        // Mã đơn hàng
        public Guid OrderId { get; set; }
        
        // Mã khóa học
        public Guid CourseId { get; set; }
        
        // Số lượng (mặc định 1)
        public int Quantity { get; set; } = 1;
        
        // Giá đơn vị
        public decimal UnitPrice { get; set; }
        
        // Số tiền giảm giá
        public decimal DiscountAmount { get; set; }
        
        // Tổng tiền
        public decimal TotalPrice { get; set; }
        
        // Mã giảng viên (optional)
        public string? InstructorId { get; set; }
        
        // JSON snapshot giá tại thời điểm đặt hàng
        public string? PriceSnapshotJson { get; set; }
        
        // Navigation properties
        public Order? Order { get; set; }
        public Course? Course { get; set; }
        public ApplicationUser? Instructor { get; set; }
    }
}

