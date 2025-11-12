using Elearn.Application.Common;
using Elearn.Application.DTOs.Order;
using Elearn.Application.Services.Interfaces;
using Elearn.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : BaseApiController<OrderController>
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
            : base(logger)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Tạo order từ danh sách course IDs (mua ngay)
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<OrderDto>.Fail(GetModelErrors()));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<OrderDto>.Fail("User not authenticated"));
            }

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var result = await _orderService.CreateOrderAsync(dto, userId, ipAddress);
            return HandleResponse(result);
        }

        /// <summary>
        /// Tạo order từ giỏ hàng
        /// </summary>
        [HttpPost("create-from-cart")]
        public async Task<IActionResult> CreateOrderFromCart([FromBody] CreateOrderFromCartDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<OrderDto>.Fail(GetModelErrors()));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<OrderDto>.Fail("User not authenticated"));
            }

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var result = await _orderService.CreateOrderFromCartAsync(dto, userId, ipAddress);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy order theo ID
        /// </summary>
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<OrderDto>.Fail("User not authenticated"));
            }

            var result = await _orderService.GetOrderByIdAsync(orderId, userId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy danh sách orders của user
        /// </summary>
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<IEnumerable<OrderDto>>.Fail("User not authenticated"));
            }

            var result = await _orderService.GetUserOrdersAsync(userId);
            return HandleResponse(result);
        }
    }
}

