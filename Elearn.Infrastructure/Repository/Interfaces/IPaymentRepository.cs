using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        /// <summary>
        /// Lấy payments theo OrderId
        /// </summary>
        Task<IEnumerable<Payment>> GetPaymentsByOrderIdAsync(Guid orderId);

        /// <summary>
        /// Lấy payment theo OrderId và Status
        /// </summary>
        Task<Payment?> GetPaymentByOrderIdAndStatusAsync(Guid orderId, PaymentStatus status);

        /// <summary>
        /// Lấy payments theo Status
        /// </summary>
        Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(PaymentStatus status);
    }
}

