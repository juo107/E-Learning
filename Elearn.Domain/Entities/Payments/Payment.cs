using Elearn.Domain.Entities.Enums;

namespace Elearn.Domain.Entities
{
    public class Payment : BaseEntity
    {
        // Mã đơn hàng
        public Guid OrderId { get; set; }
        
        // Navigation property
        public Order? Order { get; set; }
        
        // Nhà cung cấp thanh toán
        public PaymentProvider Provider { get; set; } = PaymentProvider.VNPAY;
        
        // Phương thức thanh toán
        public PaymentProviderMethod ProviderMethod { get; set; }
        
        // Số tiền thanh toán
        public decimal Amount { get; set; }
        
        // Loại tiền tệ
        public string Currency { get; set; } = string.Empty;
        
        // Trạng thái thanh toán
        public PaymentStatus Status { get; set; } = PaymentStatus.Initiated;
        
        // Số lần thử thanh toán
        public int AttemptNo { get; set; } = 1;
        
        // URL trả về sau khi thanh toán
        public string ReturnUrl { get; set; } = string.Empty;
        
        // URL nhận thông báo IPN (Instant Payment Notification)
        public string IpnUrl { get; set; } = string.Empty;
        
        // Lý do thất bại (nếu có)
        public string? FailureReason { get; set; }
        
        // Thời điểm thanh toán thành công
        public DateTime? PaidAt { get; set; }
    }
}

