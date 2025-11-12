using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        /// <summary>
        /// Lấy order theo OrderCode
        /// </summary>
        Task<Order?> GetByOrderCodeAsync(string orderCode);

        /// <summary>
        /// Lấy orders theo UserId
        /// </summary>
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);

        /// <summary>
        /// Lấy orders theo Status
        /// </summary>
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);

        /// <summary>
        /// Kiểm tra OrderCode có tồn tại
        /// </summary>
        Task<bool> ExistsByOrderCodeAsync(string orderCode);
    }
}

