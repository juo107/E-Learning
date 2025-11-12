using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class CartItemRepository : GenericRepository<CartItem>, ICartItemRepository
    {
        private readonly ElearnDbContext _context;

        public CartItemRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsByUserIdAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return Enumerable.Empty<CartItem>();

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted && ci.UserId == userId)
                .Include(ci => ci.Course)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsBySessionIdAsync(string sessionId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
                return Enumerable.Empty<CartItem>();

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted && ci.SessionId == sessionId)
                .Include(ci => ci.Course)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsByUserIdAndStatusAsync(string userId, CartItemStatus status)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return Enumerable.Empty<CartItem>();

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted && ci.UserId == userId && ci.Status == status)
                .Include(ci => ci.Course)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsBySessionIdAndStatusAsync(string sessionId, CartItemStatus status)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
                return Enumerable.Empty<CartItem>();

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted && ci.SessionId == sessionId && ci.Status == status)
                .Include(ci => ci.Course)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();
        }

        public async Task<bool> CourseExistsInUserCartAsync(string userId, Guid courseId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return false;

            return await _context.CartItems
                .AnyAsync(ci => !ci.IsDeleted &&
                    ci.UserId == userId &&
                    ci.CourseId == courseId &&
                    ci.Status == CartItemStatus.Active);
        }

        public async Task<bool> CourseExistsInSessionCartAsync(string sessionId, Guid courseId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
                return false;

            return await _context.CartItems
                .AnyAsync(ci => !ci.IsDeleted &&
                    ci.SessionId == sessionId &&
                    ci.CourseId == courseId &&
                    ci.Status == CartItemStatus.Active);
        }

        public async Task<CartItem?> GetCartItemByUserIdAndCourseIdAsync(string userId, Guid courseId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return null;

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted &&
                    ci.UserId == userId &&
                    ci.CourseId == courseId &&
                    ci.Status == CartItemStatus.Active)
                .Include(ci => ci.Course)
                .FirstOrDefaultAsync();
        }

        public async Task<CartItem?> GetCartItemBySessionIdAndCourseIdAsync(string sessionId, Guid courseId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
                return null;

            return await _context.CartItems
                .Where(ci => !ci.IsDeleted &&
                    ci.SessionId == sessionId &&
                    ci.CourseId == courseId &&
                    ci.Status == CartItemStatus.Active)
                .Include(ci => ci.Course)
                .FirstOrDefaultAsync();
        }
    }
}

