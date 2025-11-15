namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Service để theo dõi và quản lý trạng thái kết nối Redis
    /// </summary>
    public interface IRedisHealthService
    {
        /// <summary>
        /// Kiểm tra xem Redis có đang kết nối được không
        /// </summary>
        bool IsHealthy { get; }

        /// <summary>
        /// Thời điểm Redis bị disconnect lần cuối
        /// </summary>
        DateTime? LastFailureTime { get; }

        /// <summary>
        /// Số lần retry đã thực hiện
        /// </summary>
        int RetryCount { get; }

        /// <summary>
        /// Thử kết nối lại Redis
        /// </summary>
        Task<bool> TryReconnectAsync();

        /// <summary>
        /// Đánh dấu Redis đã fail
        /// </summary>
        void MarkAsUnhealthy();

        /// <summary>
        /// Đánh dấu Redis đã healthy
        /// </summary>
        void MarkAsHealthy();
    }
}

