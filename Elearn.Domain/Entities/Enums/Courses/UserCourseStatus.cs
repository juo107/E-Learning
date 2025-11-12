namespace Elearn.Domain.Entities.Enums
{
    /// <summary>
    /// Trạng thái của khóa học mà người dùng đã mua
    /// </summary>
    public enum UserCourseStatus
    {
        /// <summary>
        /// Đang hoạt động, có thể truy cập
        /// </summary>
        Active = 0,
        
        /// <summary>
        /// Đang chờ thanh toán
        /// </summary>
        PendingPayment = 1,
        
        /// <summary>
        /// Đã được hoàn tiền
        /// </summary>
        Refunded = 2,
        
        /// <summary>
        /// Đã bị thu hồi (vi phạm, etc.)
        /// </summary>
        Revoked = 3,
        
        /// <summary>
        /// Đã hết hạn truy cập
        /// </summary>
        Expired = 4
    }
}

