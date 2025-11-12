using Elearn.Application.Common;
using Elearn.Application.DTOs.Cart;

namespace Elearn.Application.Services.Interfaces
{
    /// <summary>
    /// Service xử lý giỏ hàng
    /// </summary>
    public interface ICartService
    {
        /// <summary>
        /// Thêm khóa học vào giỏ hàng
        /// </summary>
        Task<BaseResponse<CartItemDto>> AddToCartAsync(AddToCartDto dto, string? userId, string? sessionId);

        /// <summary>
        /// Lấy danh sách items trong giỏ hàng
        /// </summary>
        Task<BaseResponse<IEnumerable<CartItemDto>>> GetCartItemsAsync(string? userId, string? sessionId);

        /// <summary>
        /// Xóa item khỏi giỏ hàng
        /// </summary>
        Task<BaseResponse<bool>> RemoveFromCartAsync(Guid cartItemId, string? userId, string? sessionId);

        /// <summary>
        /// Xóa tất cả items trong giỏ hàng
        /// </summary>
        Task<BaseResponse<bool>> ClearCartAsync(string? userId, string? sessionId);
    }
}

