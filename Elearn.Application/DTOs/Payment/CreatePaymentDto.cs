using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Payment
{
    /// <summary>
    /// DTO để tạo payment request
    /// </summary>
    public class CreatePaymentDto
    {
        /// <summary>
        /// Mã đơn hàng
        /// </summary>
        public Guid OrderId { get; set; }

        /// <summary>
        /// Phương thức thanh toán (ATM, QR, INTL)
        /// </summary>
        public PaymentProviderMethod PaymentMethod { get; set; } = PaymentProviderMethod.ATM;
    }
}

