using Elearn.Application.Common;
using Elearn.Application.DTOs.Order;

namespace Elearn.Application.Services.Interfaces
{
    /// <summary>
    /// Service xử lý đơn hàng
    /// </summary>
    public interface IOrderService
    {
        /// <summary>
        /// Tạo order từ danh sách course IDs (mua ngay)
        /// </summary>
        Task<BaseResponse<OrderDto>> CreateOrderAsync(CreateOrderDto dto, string userId, string? ipAddress);

        /// <summary>
        /// Tạo order từ giỏ hàng
        /// </summary>
        Task<BaseResponse<OrderDto>> CreateOrderFromCartAsync(CreateOrderFromCartDto dto, string userId, string? ipAddress);

        /// <summary>
        /// Lấy order theo ID
        /// </summary>
        Task<BaseResponse<OrderDto>> GetOrderByIdAsync(Guid orderId, string userId);

        /// <summary>
        /// Lấy danh sách orders của user
        /// </summary>
        Task<BaseResponse<IEnumerable<OrderDto>>> GetUserOrdersAsync(string userId);
    }
}

