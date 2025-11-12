namespace Elearn.Application.DTOs.Order
{
    /// <summary>
    /// DTO để tạo order từ danh sách course IDs (mua ngay)
    /// </summary>
    public class CreateOrderDto
    {
        /// <summary>
        /// Danh sách mã khóa học
        /// </summary>
        public List<Guid> CourseIds { get; set; } = new();

        /// <summary>
        /// Mã coupon (optional)
        /// </summary>
        public string? CouponCode { get; set; }
    }
}

