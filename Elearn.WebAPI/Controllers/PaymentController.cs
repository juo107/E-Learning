using Elearn.Application.Common;
using Elearn.Application.DTOs.Payment;
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
    public class PaymentController : BaseApiController<PaymentController>
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
            : base(logger)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// Tạo payment request và lấy VNPay payment URL
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<PaymentResponseDto>.Fail(GetModelErrors()));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<PaymentResponseDto>.Fail("User not authenticated"));
            }

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var result = await _paymentService.CreatePaymentAsync(dto, userId, ipAddress);

            return HandleResponse(result);
        }

        /// <summary>
        /// Xử lý callback từ VNPay (Return URL)
        /// </summary>
        [HttpGet("vnpay-return")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayReturn([FromQuery] string vnp_TxnRef)
        {
            var queryString = Request.QueryString.ToString();
            var result = await _paymentService.HandleVNPayCallbackAsync(queryString);

            if (result.Success && result.Data != null)
            {
                // Redirect đến frontend với payment status
                var frontendUrl = $"http://localhost:5173/payment/result?status={result.Data.Status}&orderId={result.Data.OrderId}";
                return Redirect(frontendUrl);
            }

            // Redirect với error
            var errorUrl = $"http://localhost:5173/payment/result?status=failed";
            return Redirect(errorUrl);
        }

        /// <summary>
        /// Xử lý IPN (Instant Payment Notification) từ VNPay
        /// </summary>
        [HttpPost("vnpay-ipn")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayIpn()
        {
            var queryString = Request.QueryString.ToString();
            var result = await _paymentService.HandleVNPayIpnAsync(queryString);

            if (result.Success)
            {
                return Ok(new { RspCode = "00", Message = "Success" });
            }

            return BadRequest(new { RspCode = "99", Message = result.Message ?? "Failed" });
        }

        /// <summary>
        /// Lấy thông tin payment theo ID
        /// </summary>
        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPayment(Guid paymentId)
        {
            var result = await _paymentService.GetPaymentByIdAsync(paymentId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy danh sách payments theo OrderId
        /// </summary>
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentsByOrder(Guid orderId)
        {
            var result = await _paymentService.GetPaymentsByOrderIdAsync(orderId);
            return HandleResponse(result);
        }
    }
}

