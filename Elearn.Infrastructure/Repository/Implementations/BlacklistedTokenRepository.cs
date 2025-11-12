using Elearn.Domain.Entities.Identity;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class BlacklistedTokenRepository : GenericRepository<BlacklistedToken>, IBlacklistedTokenRepository
    {
        private readonly ElearnDbContext _context;

        public BlacklistedTokenRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> IsTokenBlacklistedAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            return await _context.BlacklistedTokens
                .AnyAsync(bt => !bt.IsDeleted && bt.Token == token && bt.ExpiresAt > DateTime.UtcNow);
        }

        public async Task AddTokenToBlacklistAsync(string token, string userId, DateTime expiresAt, string? reason = null)
        {
            var blacklistedToken = new BlacklistedToken
            {
                Token = token,
                UserId = userId,
                ExpiresAt = expiresAt,
                BlacklistedAt = DateTime.UtcNow,
                Reason = reason ?? "Logout",
                CreatedBy = userId
            };

            await _context.BlacklistedTokens.AddAsync(blacklistedToken);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _context.BlacklistedTokens
                .Where(bt => !bt.IsDeleted && bt.ExpiresAt <= DateTime.UtcNow)
                .ToListAsync();

            foreach (var token in expiredTokens)
            {
                token.IsDeleted = true;
                token.DeletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return expiredTokens.Count;
        }
    }
}

