using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.DTOs.Payment
{
    /// <summary>
    /// DTO response cho payment
    /// </summary>
    public class PaymentResponseDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string OrderCode { get; set; } = string.Empty;
        public PaymentProvider Provider { get; set; }
        public PaymentProviderMethod ProviderMethod { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public PaymentStatus Status { get; set; }
        public string? PaymentUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}

