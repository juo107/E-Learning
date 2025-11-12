namespace Elearn.Application.DTOs.Order
{
    /// <summary>
    /// DTO để tạo order từ giỏ hàng
    /// </summary>
    public class CreateOrderFromCartDto
    {
        /// <summary>
        /// Mã coupon (optional)
        /// </summary>
        public string? CouponCode { get; set; }
    }
}

