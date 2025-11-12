namespace Elearn.Domain.Entities.Identity
{
    /// <summary>
    /// Entity lưu các JWT token đã bị blacklist (logout)
    /// </summary>
    public class BlacklistedToken : BaseEntity
    {
        /// <summary>
        /// JWT token (có thể lưu full token hoặc chỉ jti claim)
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// User ID của token này
        /// </summary>
        public string UserId { get; set; } = string.Empty;

        /// <summary>
        /// Thời gian hết hạn của token (từ exp claim)
        /// </summary>
        public DateTime ExpiresAt { get; set; }

        /// <summary>
        /// Thời gian logout/blacklist
        /// </summary>
        public DateTime BlacklistedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Lý do blacklist (logout, security breach, etc.)
        /// </summary>
        public string? Reason { get; set; }
    }
}

