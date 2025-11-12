using Elearn.Application.Common;
using Elearn.Application.DTOs.Payment;

namespace Elearn.Application.Services.Interfaces
{
    /// <summary>
    /// Service xử lý thanh toán
    /// </summary>
    public interface IPaymentService
    {
        /// <summary>
        /// Tạo payment request và trả về payment URL
        /// </summary>
        Task<BaseResponse<PaymentResponseDto>> CreatePaymentAsync(CreatePaymentDto dto, string userId, string ipAddress);

        /// <summary>
        /// Xử lý callback từ VNPay
        /// </summary>
        Task<BaseResponse<PaymentResponseDto>> HandleVNPayCallbackAsync(string queryString);

        /// <summary>
        /// Xử lý IPN (Instant Payment Notification) từ VNPay
        /// </summary>
        Task<BaseResponse<bool>> HandleVNPayIpnAsync(string queryString);

        /// <summary>
        /// Lấy thông tin payment theo ID
        /// </summary>
        Task<BaseResponse<PaymentResponseDto>> GetPaymentByIdAsync(Guid paymentId);

        /// <summary>
        /// Lấy danh sách payments theo OrderId
        /// </summary>
        Task<BaseResponse<IEnumerable<PaymentResponseDto>>> GetPaymentsByOrderIdAsync(Guid orderId);
    }
}

