using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Cart;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Microsoft.Extensions.Logging;

namespace Elearn.Application.Services.Implementations.Cart
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<CartService> _logger;

        public CartService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<CartService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<BaseResponse<CartItemDto>> AddToCartAsync(AddToCartDto dto, string? userId, string? sessionId)
        {
            try
            {
                // Validate: Phải có userId hoặc sessionId
                if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(sessionId))
                {
                    return BaseResponse<CartItemDto>.Fail("User ID or Session ID is required");
                }

                // Kiểm tra course tồn tại
                var course = await _unitOfWork.Courses.GetByIdAsync(dto.CourseId);
                if (course == null || course.IsDeleted)
                {
                    return BaseResponse<CartItemDto>.Fail("Course not found");
                }

                // Kiểm tra course đã có trong giỏ hàng chưa
                bool exists;
                CartItem? existingItem = null;

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    exists = await _unitOfWork.CartItems.CourseExistsInUserCartAsync(userId, dto.CourseId);
                    if (exists)
                    {
                        existingItem = await _unitOfWork.CartItems.GetCartItemByUserIdAndCourseIdAsync(userId, dto.CourseId);
                    }
                }
                else
                {
                    var finalSessionId = dto.SessionId ?? sessionId;
                    if (string.IsNullOrWhiteSpace(finalSessionId))
                    {
                        return BaseResponse<CartItemDto>.Fail("Session ID is required for anonymous users");
                    }
                    exists = await _unitOfWork.CartItems.CourseExistsInSessionCartAsync(finalSessionId, dto.CourseId);
                    if (exists)
                    {
                        existingItem = await _unitOfWork.CartItems.GetCartItemBySessionIdAndCourseIdAsync(finalSessionId, dto.CourseId);
                    }
                }

                if (exists && existingItem != null)
                {
                    // Course đã có trong giỏ hàng, trả về item hiện tại
                    var currentPrice = GetEffectivePrice(course);
                    var cartItemDto = new CartItemDto
                    {
                        Id = existingItem.Id,
                        CourseId = existingItem.CourseId,
                        CourseTitle = course.Title,
                        CourseThumbnailUrl = null, // TODO: Get from CourseMedia
                        PriceAtAdd = existingItem.PriceAtAdd,
                        CurrentPrice = currentPrice,
                        AppliedCouponCode = existingItem.AppliedCouponCode,
                        AddedAt = existingItem.AddedAt
                    };
                    return BaseResponse<CartItemDto>.Ok(cartItemDto);
                }

                // Tính giá hiện tại của course (lấy giá khuyến mãi nếu còn hiệu lực)
                var price = GetEffectivePrice(course);

                // Tạo cart item mới
                var cartItem = new CartItem
                {
                    UserId = userId,
                    SessionId = string.IsNullOrWhiteSpace(userId) ? (dto.SessionId ?? sessionId) : null,
                    CourseId = dto.CourseId,
                    PriceAtAdd = price,
                    Status = CartItemStatus.Active,
                    AddedAt = DateTime.UtcNow
                };

                await _unitOfWork.CartItems.AddAsync(cartItem);
                await _unitOfWork.CompleteAsync();

                var result = new CartItemDto
                {
                    Id = cartItem.Id,
                    CourseId = cartItem.CourseId,
                    CourseTitle = course.Title,
                    CourseThumbnailUrl = null, // TODO: Get from CourseMedia
                    PriceAtAdd = cartItem.PriceAtAdd,
                    CurrentPrice = price,
                    AppliedCouponCode = cartItem.AppliedCouponCode,
                    AddedAt = cartItem.AddedAt
                };

                return BaseResponse<CartItemDto>.Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding course to cart");
                return BaseResponse<CartItemDto>.Fail($"Failed to add course to cart: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CartItemDto>>> GetCartItemsAsync(string? userId, string? sessionId)
        {
            try
            {
                IEnumerable<CartItem> cartItems;

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    cartItems = await _unitOfWork.CartItems.GetCartItemsByUserIdAndStatusAsync(userId, CartItemStatus.Active);
                }
                else if (!string.IsNullOrWhiteSpace(sessionId))
                {
                    cartItems = await _unitOfWork.CartItems.GetCartItemsBySessionIdAndStatusAsync(sessionId, CartItemStatus.Active);
                }
                else
                {
                    return BaseResponse<IEnumerable<CartItemDto>>.Ok(Enumerable.Empty<CartItemDto>());
                }

                var result = new List<CartItemDto>();
                foreach (var item in cartItems)
                {
                    var course = await _unitOfWork.Courses.GetByIdAsync(item.CourseId);
                    if (course == null || course.IsDeleted) continue;

                    var currentPrice = GetEffectivePrice(course);
                    result.Add(new CartItemDto
                    {
                        Id = item.Id,
                        CourseId = item.CourseId,
                        CourseTitle = course.Title,
                        CourseThumbnailUrl = null, // TODO: Get from CourseMedia
                        PriceAtAdd = item.PriceAtAdd,
                        CurrentPrice = currentPrice,
                        AppliedCouponCode = item.AppliedCouponCode,
                        AddedAt = item.AddedAt
                    });
                }

                return BaseResponse<IEnumerable<CartItemDto>>.Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cart items");
                return BaseResponse<IEnumerable<CartItemDto>>.Fail($"Failed to get cart items: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RemoveFromCartAsync(Guid cartItemId, string? userId, string? sessionId)
        {
            try
            {
                var cartItem = await _unitOfWork.CartItems.GetByIdAsync(cartItemId);
                if (cartItem == null || cartItem.IsDeleted)
                {
                    return BaseResponse<bool>.Fail("Cart item not found");
                }

                // Kiểm tra quyền
                if (!string.IsNullOrWhiteSpace(userId) && cartItem.UserId != userId)
                {
                    return BaseResponse<bool>.Fail("You don't have permission to remove this item");
                }

                if (!string.IsNullOrWhiteSpace(sessionId) && cartItem.SessionId != sessionId)
                {
                    return BaseResponse<bool>.Fail("You don't have permission to remove this item");
                }

                _unitOfWork.CartItems.Delete(cartItem);
                await _unitOfWork.CompleteAsync();

                return BaseResponse<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cart item");
                return BaseResponse<bool>.Fail($"Failed to remove cart item: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ClearCartAsync(string? userId, string? sessionId)
        {
            try
            {
                IEnumerable<CartItem> cartItems;

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    cartItems = await _unitOfWork.CartItems.GetCartItemsByUserIdAndStatusAsync(userId, CartItemStatus.Active);
                }
                else if (!string.IsNullOrWhiteSpace(sessionId))
                {
                    cartItems = await _unitOfWork.CartItems.GetCartItemsBySessionIdAndStatusAsync(sessionId, CartItemStatus.Active);
                }
                else
                {
                    return BaseResponse<bool>.Ok(true);
                }

                foreach (var item in cartItems)
                {
                    _unitOfWork.CartItems.Delete(item);
                }

                await _unitOfWork.CompleteAsync();

                return BaseResponse<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                return BaseResponse<bool>.Fail($"Failed to clear cart: {ex.Message}");
            }
        }

        /// <summary>
        /// Tính giá hiệu quả của course (lấy giá khuyến mãi nếu còn hiệu lực)
        /// </summary>
        private decimal GetEffectivePrice(Course course)
        {
            // Kiểm tra xem có discount và còn hiệu lực không
            if (course.FinalPrice.HasValue && 
                course.DiscountExpiresAt.HasValue && 
                course.DiscountExpiresAt.Value >= DateTime.UtcNow)
            {
                // Discount còn hiệu lực, trả về giá khuyến mãi
                return course.FinalPrice.Value;
            }

            // Không có discount hoặc đã hết hạn, trả về giá gốc
            return course.Price;
        }
    }
}

