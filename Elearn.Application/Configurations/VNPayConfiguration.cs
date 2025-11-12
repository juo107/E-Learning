namespace Elearn.Application.Configurations
{
    /// <summary>
    /// Cấu hình VNPay
    /// </summary>
    public class VNPayConfiguration
    {
        public const string SectionName = "VNPay";

        /// <summary>
        /// URL của VNPay Payment Gateway
        /// </summary>
        public string PaymentUrl { get; set; } = string.Empty;

        /// <summary>
        /// TmnCode - Mã website/merchant
        /// </summary>
        public string TmnCode { get; set; } = string.Empty;

        /// <summary>
        /// HashSecret - Secret key để tạo và verify hash
        /// </summary>
        public string HashSecret { get; set; } = string.Empty;

        /// <summary>
        /// ReturnUrl - URL trả về sau khi thanh toán
        /// </summary>
        public string ReturnUrl { get; set; } = string.Empty;

        /// <summary>
        /// IpnUrl - URL nhận thông báo IPN từ VNPay
        /// </summary>
        public string IpnUrl { get; set; } = string.Empty;

        /// <summary>
        /// Version của API VNPay
        /// </summary>
        public string Version { get; set; } = "2.1.0";

        /// <summary>
        /// Command - Loại giao dịch (pay, querydr, refund, etc.)
        /// </summary>
        public string Command { get; set; } = "pay";

        /// <summary>
        /// CurrencyCode - Mã tiền tệ (VND = 704)
        /// </summary>
        public string CurrencyCode { get; set; } = "704";

        /// <summary>
        /// Locale - Ngôn ngữ (vn, en)
        /// </summary>
        public string Locale { get; set; } = "vn";
    }
}

