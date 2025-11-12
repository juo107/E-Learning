namespace Elearn.Domain.Entities.Enums
{
    public enum PaymentStatus
    {
        /// <summary>
        /// Thanh toán đã được khởi tạo
        /// </summary>
        Initiated = 0,
        
        /// <summary>
        /// Đã chuyển hướng đến trang thanh toán
        /// </summary>
        Redirected = 1,
        
        /// <summary>
        /// Thanh toán thành công
        /// </summary>
        Succeeded = 2,
        
        /// <summary>
        /// Thanh toán thất bại
        /// </summary>
        Failed = 3,
        
        /// <summary>
        /// Thanh toán đã bị hủy
        /// </summary>
        Cancelled = 4,
        
        /// <summary>
        /// Thanh toán đã hết hạn
        /// </summary>
        Expired = 5
    }
}

