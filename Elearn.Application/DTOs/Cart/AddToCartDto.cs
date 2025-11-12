namespace Elearn.Application.DTOs.Cart
{
    /// <summary>
    /// DTO để thêm khóa học vào giỏ hàng
    /// </summary>
    public class AddToCartDto
    {
        /// <summary>
        /// Mã khóa học
        /// </summary>
        public Guid CourseId { get; set; }

        /// <summary>
        /// SessionId cho user chưa đăng nhập (optional)
        /// </summary>
        public string? SessionId { get; set; }
    }
}

