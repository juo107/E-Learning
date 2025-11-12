using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        private readonly ElearnDbContext _context;

        public PaymentRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByOrderIdAsync(Guid orderId)
        {
            return await _context.Payments
                .Where(p => !p.IsDeleted && p.OrderId == orderId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentByOrderIdAndStatusAsync(Guid orderId, PaymentStatus status)
        {
            return await _context.Payments
                .Where(p => !p.IsDeleted && p.OrderId == orderId && p.Status == status)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(PaymentStatus status)
        {
            return await _context.Payments
                .Where(p => !p.IsDeleted && p.Status == status)
                .Include(p => p.Order)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}

