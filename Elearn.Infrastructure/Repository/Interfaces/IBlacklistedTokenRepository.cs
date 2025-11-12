using Elearn.Domain.Entities.Identity;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IBlacklistedTokenRepository : IGenericRepository<BlacklistedToken>
    {
        /// <summary>
        /// Kiểm tra token có trong blacklist không
        /// </summary>
        Task<bool> IsTokenBlacklistedAsync(string token);

        /// <summary>
        /// Thêm token vào blacklist
        /// </summary>
        Task AddTokenToBlacklistAsync(string token, string userId, DateTime expiresAt, string? reason = null);

        /// <summary>
        /// Xóa các token đã hết hạn khỏi blacklist (cleanup)
        /// </summary>
        Task<int> CleanupExpiredTokensAsync();
    }
}

