using Elearn.Application.Common;
using Elearn.Application.DTOs.Cart;
using Elearn.Application.Services.Interfaces;
using Elearn.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : BaseApiController<CartController>
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService, ILogger<CartController> logger)
            : base(logger)
        {
            _cartService = cartService;
        }

        /// <summary>
        /// Thêm khóa học vào giỏ hàng
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<CartItemDto>.Fail(GetModelErrors()));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();

            var result = await _cartService.AddToCartAsync(dto, userId, sessionId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy danh sách items trong giỏ hàng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCartItems()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();

            var result = await _cartService.GetCartItemsAsync(userId, sessionId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Xóa item khỏi giỏ hàng
        /// </summary>
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(Guid cartItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();

            var result = await _cartService.RemoveFromCartAsync(cartItemId, userId, sessionId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Xóa tất cả items trong giỏ hàng
        /// </summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();

            var result = await _cartService.ClearCartAsync(userId, sessionId);
            return HandleResponse(result);
        }
    }
}

