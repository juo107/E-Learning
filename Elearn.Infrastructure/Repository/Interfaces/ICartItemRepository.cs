using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ICartItemRepository : IGenericRepository<CartItem>
    {
        /// <summary>
        /// Lấy cart items theo UserId
        /// </summary>
        Task<IEnumerable<CartItem>> GetCartItemsByUserIdAsync(string userId);

        /// <summary>
        /// Lấy cart items theo SessionId
        /// </summary>
        Task<IEnumerable<CartItem>> GetCartItemsBySessionIdAsync(string sessionId);

        /// <summary>
        /// Lấy cart items theo UserId và Status
        /// </summary>
        Task<IEnumerable<CartItem>> GetCartItemsByUserIdAndStatusAsync(string userId, CartItemStatus status);

        /// <summary>
        /// Lấy cart items theo SessionId và Status
        /// </summary>
        Task<IEnumerable<CartItem>> GetCartItemsBySessionIdAndStatusAsync(string sessionId, CartItemStatus status);

        /// <summary>
        /// Kiểm tra course đã có trong giỏ hàng của user chưa (status Active)
        /// </summary>
        Task<bool> CourseExistsInUserCartAsync(string userId, Guid courseId);

        /// <summary>
        /// Kiểm tra course đã có trong giỏ hàng của session chưa (status Active)
        /// </summary>
        Task<bool> CourseExistsInSessionCartAsync(string sessionId, Guid courseId);

        /// <summary>
        /// Lấy cart item theo UserId và CourseId (status Active)
        /// </summary>
        Task<CartItem?> GetCartItemByUserIdAndCourseIdAsync(string userId, Guid courseId);

        /// <summary>
        /// Lấy cart item theo SessionId và CourseId (status Active)
        /// </summary>
        Task<CartItem?> GetCartItemBySessionIdAndCourseIdAsync(string sessionId, Guid courseId);
    }
}

