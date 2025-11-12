namespace Elearn.Domain.Entities.Enums
{
    public enum OrderStatus
    {
        /// <summary>
        /// Đơn hàng đã được tạo
        /// </summary>
        Created = 0,
        
        /// <summary>
        /// Đang chờ thanh toán
        /// </summary>
        PendingPayment = 1,
        
        /// <summary>
        /// Đã thanh toán
        /// </summary>
        Paid = 2,
        
        /// <summary>
        /// Thanh toán thất bại
        /// </summary>
        Failed = 3,
        
        /// <summary>
        /// Đơn hàng đã bị hủy
        /// </summary>
        Cancelled = 4,
        
        /// <summary>
        /// Đơn hàng đã hết hạn
        /// </summary>
        Expired = 5
    }
}

