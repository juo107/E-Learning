using Elearn.Domain.Entities.Enums;
using Elearn.Domain.Entities.Identity;

namespace Elearn.Domain.Entities
{
    public class Order : BaseEntity
    {
        // Mã đơn hàng (unique)
        public string OrderCode { get; set; } = string.Empty;
        
        // Mã người dùng
        public string UserId { get; set; } = string.Empty;
        
        // Trạng thái đơn hàng
        public OrderStatus Status { get; set; } = OrderStatus.Created;
        
        // Loại tiền tệ
        public string Currency { get; set; } = string.Empty;
        
        // Tổng tiền trước giảm giá
        public decimal Subtotal { get; set; }
        
        // Số tiền giảm giá
        public decimal Discount { get; set; }
        
        // Tổng tiền sau giảm giá
        public decimal TotalAmount { get; set; }
        
        // Địa chỉ IP của khách hàng
        public string? ClientIp { get; set; }
        
        // Navigation properties
        public ApplicationUser? User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}

