using Elearn.Domain.Entities.Enums;
using Elearn.Domain.Entities.Identity;

namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Entity lưu thông tin item trong giỏ hàng
    /// </summary>
    public class CartItem : BaseEntity
    {
        // Người dùng đã đăng nhập
        public string? UserId { get; set; }

        // Người chưa đăng nhập -> lưu SessionId hoặc DeviceId
        public string? SessionId { get; set; }

        // Khóa học
        public Guid CourseId { get; set; }

        // Giá tại thời điểm thêm giỏ hàng (để so sánh khi checkout)
        public decimal PriceAtAdd { get; set; }

        // Mã coupon nếu user áp dụng vào item này
        public string? AppliedCouponCode { get; set; }

        // Trạng thái (đang active, moved-to-wishlist, expired)
        public CartItemStatus Status { get; set; } = CartItemStatus.Active;

        // Ngày thêm vào giỏ
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ApplicationUser? User { get; set; }
        public Course? Course { get; set; }
    }
}

