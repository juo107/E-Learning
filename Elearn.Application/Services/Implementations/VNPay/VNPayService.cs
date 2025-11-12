using Elearn.Application.Configurations;
using Elearn.Application.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using System.Net;

namespace Elearn.Application.Services.Implementations.VNPay
{
    public class VNPayService : IVNPayService
    {
        private readonly VNPayConfiguration _config;
        private readonly ILogger<VNPayService> _logger;

        public VNPayService(IOptions<VNPayConfiguration> config, ILogger<VNPayService> logger)
        {
            _config = config.Value;
            _logger = logger;
        }

        public string CreatePaymentUrl(
            string orderId,
            decimal amount,
            string orderDescription,
            string ipAddress,
            string? returnUrl = null)
        {
            try
            {
                // VNPay yêu cầu: số tiền không có phần thập phân, nhân 100 để khử phần thập phân
                // Ví dụ: 10,000 VND → gửi 1000000 (10,000 * 100)
                // Làm tròn về số nguyên trước khi nhân 100 để đảm bảo không có phần thập phân
                var amountInVnd = Math.Round(amount, 0, MidpointRounding.AwayFromZero);
                var vnpAmount = ((long)(amountInVnd * 100)).ToString();
                
                var vnp_Params = new Dictionary<string, string>
                {
                    { "vnp_Version", _config.Version },
                    { "vnp_Command", _config.Command },
                    { "vnp_TmnCode", _config.TmnCode },
                    { "vnp_Amount", vnpAmount }, // Số tiền đã nhân 100, không có phần thập phân
                    { "vnp_CurrCode", _config.CurrencyCode },
                    { "vnp_TxnRef", orderId },
                    { "vnp_OrderInfo", orderDescription },
                    { "vnp_OrderType", "other" },
                    { "vnp_Locale", _config.Locale },
                    { "vnp_ReturnUrl", returnUrl ?? _config.ReturnUrl },
                    { "vnp_IpAddr", ipAddress },
                    { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") }
                };

                // Sắp xếp các tham số theo thứ tự alphabet
                var sortedParams = vnp_Params.OrderBy(x => x.Key).ToList();

                // Tạo query string
                var queryString = string.Join("&", sortedParams.Select(x => $"{x.Key}={WebUtility.UrlEncode(x.Value)}"));

                // Tạo hash
                var hashData = $"{queryString}&vnp_HashSecret={_config.HashSecret}";
                var vnp_SecureHash = HmacSHA512(_config.HashSecret, hashData);

                // Thêm hash vào query string
                var paymentUrl = $"{_config.PaymentUrl}?{queryString}&vnp_SecureHash={vnp_SecureHash}";

                _logger.LogInformation("Created VNPay payment URL for order: {OrderId}", orderId);
                return paymentUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating VNPay payment URL for order: {OrderId}", orderId);
                throw;
            }
        }

        public bool ValidateCallback(string queryString)
        {
            try
            {
                var parsedParams = ParseCallback(queryString);

                // Lấy hash từ callback
                if (!parsedParams.TryGetValue("vnp_SecureHash", out var vnp_SecureHash))
                {
                    _logger.LogWarning("VNPay callback missing vnp_SecureHash");
                    return false;
                }

                // Loại bỏ hash khỏi params để tính toán lại
                parsedParams.Remove("vnp_SecureHash");

                // Sắp xếp và tạo query string
                var sortedParams = parsedParams.OrderBy(x => x.Key).ToList();
                var queryStringForHash = string.Join("&", sortedParams.Select(x => $"{x.Key}={x.Value}"));

                // Tính toán hash
                var hashData = $"{queryStringForHash}&vnp_HashSecret={_config.HashSecret}";
                var calculatedHash = HmacSHA512(_config.HashSecret, hashData);

                // So sánh hash
                var isValid = vnp_SecureHash.Equals(calculatedHash, StringComparison.OrdinalIgnoreCase);

                if (!isValid)
                {
                    _logger.LogWarning("VNPay callback hash validation failed. Expected: {Expected}, Received: {Received}",
                        calculatedHash, vnp_SecureHash);
                }

                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating VNPay callback");
                return false;
            }
        }

        public Dictionary<string, string> ParseCallback(string queryString)
        {
            var result = new Dictionary<string, string>();

            if (string.IsNullOrEmpty(queryString))
                return result;

            // Loại bỏ dấu ? nếu có
            if (queryString.StartsWith("?"))
                queryString = queryString.Substring(1);

            var pairs = queryString.Split('&');
            foreach (var pair in pairs)
            {
                var keyValue = pair.Split('=');
                if (keyValue.Length == 2)
                {
                    var key = WebUtility.UrlDecode(keyValue[0]);
                    var value = WebUtility.UrlDecode(keyValue[1]);
                    result[key] = value;
                }
            }

            return result;
        }

        /// <summary>
        /// Tạo HMAC SHA512 hash
        /// </summary>
        private string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);

            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (byte b in hashValue)
                {
                    hash.Append(b.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }
}

