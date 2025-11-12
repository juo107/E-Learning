using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly ElearnDbContext _context;

        public OrderRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Order?> GetByOrderCodeAsync(string orderCode)
        {
            if (string.IsNullOrWhiteSpace(orderCode))
                return null;

            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Payments)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => !o.IsDeleted && o.OrderCode == orderCode);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return Enumerable.Empty<Order>();

            return await _context.Orders
                .Where(o => !o.IsDeleted && o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _context.Orders
                .Where(o => !o.IsDeleted && o.Status == status)
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> ExistsByOrderCodeAsync(string orderCode)
        {
            if (string.IsNullOrWhiteSpace(orderCode))
                return false;

            return await _context.Orders
                .AnyAsync(o => !o.IsDeleted && o.OrderCode == orderCode);
        }
    }
}

