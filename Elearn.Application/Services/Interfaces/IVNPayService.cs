namespace Elearn.Application.Services.Interfaces
{
    /// <summary>
    /// Service xử lý thanh toán VNPay
    /// </summary>
    public interface IVNPayService
    {
        /// <summary>
        /// Tạo URL thanh toán VNPay
        /// </summary>
        /// <param name="orderId">Mã đơn hàng</param>
        /// <param name="amount">Số tiền thanh toán</param>
        /// <param name="orderDescription">Mô tả đơn hàng</param>
        /// <param name="ipAddress">Địa chỉ IP của khách hàng</param>
        /// <param name="returnUrl">URL trả về sau khi thanh toán (optional, sẽ dùng default nếu null)</param>
        /// <returns>URL thanh toán VNPay</returns>
        string CreatePaymentUrl(
            string orderId,
            decimal amount,
            string orderDescription,
            string ipAddress,
            string? returnUrl = null);

        /// <summary>
        /// Xác thực callback từ VNPay
        /// </summary>
        /// <param name="queryString">Query string từ VNPay callback</param>
        /// <returns>True nếu hợp lệ, False nếu không hợp lệ</returns>
        bool ValidateCallback(string queryString);

        /// <summary>
        /// Parse thông tin từ VNPay callback
        /// </summary>
        /// <param name="queryString">Query string từ VNPay callback</param>
        /// <returns>Dictionary chứa thông tin callback</returns>
        Dictionary<string, string> ParseCallback(string queryString);
    }
}

