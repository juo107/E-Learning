namespace Elearn.Domain.Entities.Enums
{
    /// <summary>
    /// Trạng thái của item trong giỏ hàng
    /// </summary>
    public enum CartItemStatus
    {
        /// <summary>
        /// Đang active trong giỏ hàng
        /// </summary>
        Active = 0,
        
        /// <summary>
        /// Đã chuyển sang wishlist
        /// </summary>
        MovedToWishlist = 1,
        
        /// <summary>
        /// Đã hết hạn (auto-expire sau X ngày)
        /// </summary>
        Expired = 2,
        
        /// <summary>
        /// Đã được checkout (chuyển thành OrderItem)
        /// </summary>
        CheckedOut = 3
    }
}

