using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.Configurations;
using Elearn.Application.DTOs.Payment;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Elearn.Application.Services.Implementations.Payment
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVNPayService _vnPayService;
        private readonly IMapper _mapper;
        private readonly VNPayConfiguration _vnPayConfig;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            IUnitOfWork unitOfWork,
            IVNPayService vnPayService,
            IMapper mapper,
            IOptions<VNPayConfiguration> vnPayConfig,
            ILogger<PaymentService> logger)
        {
            _unitOfWork = unitOfWork;
            _vnPayService = vnPayService;
            _mapper = mapper;
            _vnPayConfig = vnPayConfig.Value;
            _logger = logger;
        }

        public async Task<BaseResponse<PaymentResponseDto>> CreatePaymentAsync(
            CreatePaymentDto dto,
            string userId,
            string ipAddress)
        {
            try
            {
                // Lấy order
                var order = await _unitOfWork.Orders.GetByIdAsync(dto.OrderId);
                if (order == null || order.IsDeleted)
                {
                    return BaseResponse<PaymentResponseDto>.Fail("Order not found");
                }

                // Kiểm tra user có quyền với order này không
                if (order.UserId != userId)
                {
                    return BaseResponse<PaymentResponseDto>.Fail("You don't have permission to pay for this order");
                }

                // Kiểm tra order status
                if (order.Status != OrderStatus.Created && order.Status != OrderStatus.PendingPayment)
                {
                    return BaseResponse<PaymentResponseDto>.Fail($"Cannot create payment for order with status: {order.Status}");
                }

                // Tạo payment record
                var payment = new Domain.Entities.Payment
                {
                    OrderId = dto.OrderId,
                    Provider = PaymentProvider.VNPAY,
                    ProviderMethod = dto.PaymentMethod,
                    Amount = order.TotalAmount,
                    Currency = order.Currency,
                    Status = PaymentStatus.Initiated,
                    AttemptNo = 1,
                    ReturnUrl = _vnPayConfig.ReturnUrl,
                    IpnUrl = _vnPayConfig.IpnUrl,
                    CreatedBy = userId
                };

                await _unitOfWork.Payments.AddAsync(payment);
                await _unitOfWork.CompleteAsync();

                // Tạo VNPay payment URL
                var orderDescription = $"Thanh toan don hang {order.OrderCode}";
                var paymentUrl = _vnPayService.CreatePaymentUrl(
                    payment.Id.ToString(),
                    payment.Amount,
                    orderDescription,
                    ipAddress,
                    payment.ReturnUrl);

                // Cập nhật payment status
                payment.Status = PaymentStatus.Redirected;
                await _unitOfWork.CompleteAsync();

                // Cập nhật order status
                order.Status = OrderStatus.PendingPayment;
                await _unitOfWork.CompleteAsync();

                var responseDto = _mapper.Map<PaymentResponseDto>(payment);
                responseDto.PaymentUrl = paymentUrl;
                responseDto.OrderCode = order.OrderCode;

                _logger.LogInformation("Created payment {PaymentId} for order {OrderId}", payment.Id, order.Id);
                return BaseResponse<PaymentResponseDto>.Ok(responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment for order {OrderId}", dto.OrderId);
                return BaseResponse<PaymentResponseDto>.Fail($"Error creating payment: {ex.Message}");
            }
        }

        public async Task<BaseResponse<PaymentResponseDto>> HandleVNPayCallbackAsync(string queryString)
        {
            try
            {
                // Validate callback
                if (!_vnPayService.ValidateCallback(queryString))
                {
                    _logger.LogWarning("Invalid VNPay callback signature");
                    return BaseResponse<PaymentResponseDto>.Fail("Invalid payment callback");
                }

                // Parse callback data
                var callbackData = _vnPayService.ParseCallback(queryString);

                if (!callbackData.TryGetValue("vnp_TxnRef", out var paymentIdStr) ||
                    !Guid.TryParse(paymentIdStr, out var paymentId))
                {
                    return BaseResponse<PaymentResponseDto>.Fail("Invalid payment reference");
                }

                // Lấy payment
                var payment = await _unitOfWork.Payments.GetByIdAsync(paymentId);
                if (payment == null || payment.IsDeleted)
                {
                    return BaseResponse<PaymentResponseDto>.Fail("Payment not found");
                }

                // Lấy order
                var order = await _unitOfWork.Orders.GetByIdAsync(payment.OrderId);
                if (order == null || order.IsDeleted)
                {
                    return BaseResponse<PaymentResponseDto>.Fail("Order not found");
                }

                // Kiểm tra response code
                var responseCode = callbackData.GetValueOrDefault("vnp_ResponseCode", "99");
                var transactionStatus = callbackData.GetValueOrDefault("vnp_TransactionStatus", "");

                if (responseCode == "00" && transactionStatus == "00")
                {
                    // Thanh toán thành công
                    payment.Status = PaymentStatus.Succeeded;
                    payment.PaidAt = DateTime.UtcNow;
                    order.Status = OrderStatus.Paid;

                    // Tạo UserCourse records cho mỗi OrderItem
                    await CreateUserCoursesAsync(order, payment.Id);

                    _logger.LogInformation("Payment {PaymentId} succeeded for order {OrderId}", payment.Id, order.Id);
                }
                else
                {
                    // Thanh toán thất bại
                    payment.Status = PaymentStatus.Failed;
                    payment.FailureReason = $"ResponseCode: {responseCode}, TransactionStatus: {transactionStatus}";
                    order.Status = OrderStatus.Failed;

                    _logger.LogWarning("Payment {PaymentId} failed for order {OrderId}. ResponseCode: {ResponseCode}",
                        payment.Id, order.Id, responseCode);
                }

                await _unitOfWork.CompleteAsync();

                var responseDto = _mapper.Map<PaymentResponseDto>(payment);
                responseDto.OrderCode = order.OrderCode;

                return BaseResponse<PaymentResponseDto>.Ok(responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling VNPay callback");
                return BaseResponse<PaymentResponseDto>.Fail($"Error processing callback: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> HandleVNPayIpnAsync(string queryString)
        {
            try
            {
                // Validate IPN
                if (!_vnPayService.ValidateCallback(queryString))
                {
                    _logger.LogWarning("Invalid VNPay IPN signature");
                    return BaseResponse<bool>.Fail("Invalid IPN signature");
                }

                // Parse IPN data
                var ipnData = _vnPayService.ParseCallback(queryString);

                if (!ipnData.TryGetValue("vnp_TxnRef", out var paymentIdStr) ||
                    !Guid.TryParse(paymentIdStr, out var paymentId))
                {
                    return BaseResponse<bool>.Fail("Invalid payment reference");
                }

                // Lấy payment
                var payment = await _unitOfWork.Payments.GetByIdAsync(paymentId);
                if (payment == null || payment.IsDeleted)
                {
                    return BaseResponse<bool>.Fail("Payment not found");
                }

                // Nếu đã xử lý rồi thì không xử lý lại
                if (payment.Status == PaymentStatus.Succeeded)
                {
                    return BaseResponse<bool>.Ok(true);
                }

                // Xử lý tương tự callback
                var responseCode = ipnData.GetValueOrDefault("vnp_ResponseCode", "99");
                var transactionStatus = ipnData.GetValueOrDefault("vnp_TransactionStatus", "");

                if (responseCode == "00" && transactionStatus == "00")
                {
                    payment.Status = PaymentStatus.Succeeded;
                    payment.PaidAt = DateTime.UtcNow;

                    var order = await _unitOfWork.Orders.GetByIdAsync(payment.OrderId);
                    if (order != null && !order.IsDeleted)
                    {
                        order.Status = OrderStatus.Paid;
                        await CreateUserCoursesAsync(order, payment.Id);
                    }

                    _logger.LogInformation("IPN: Payment {PaymentId} succeeded", payment.Id);
                }
                else
                {
                    payment.Status = PaymentStatus.Failed;
                    payment.FailureReason = $"IPN ResponseCode: {responseCode}, TransactionStatus: {transactionStatus}";
                    _logger.LogWarning("IPN: Payment {PaymentId} failed. ResponseCode: {ResponseCode}",
                        payment.Id, responseCode);
                }

                await _unitOfWork.CompleteAsync();
                return BaseResponse<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling VNPay IPN");
                return BaseResponse<bool>.Fail($"Error processing IPN: {ex.Message}");
            }
        }

        public async Task<BaseResponse<PaymentResponseDto>> GetPaymentByIdAsync(Guid paymentId)
        {
            try
            {
                var payment = await _unitOfWork.Payments.GetByIdAsync(paymentId);
                if (payment == null || payment.IsDeleted)
                {
                    return BaseResponse<PaymentResponseDto>.Fail("Payment not found");
                }

                var order = await _unitOfWork.Orders.GetByIdAsync(payment.OrderId);
                var responseDto = _mapper.Map<PaymentResponseDto>(payment);
                if (order != null)
                {
                    responseDto.OrderCode = order.OrderCode;
                }

                return BaseResponse<PaymentResponseDto>.Ok(responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment {PaymentId}", paymentId);
                return BaseResponse<PaymentResponseDto>.Fail($"Error getting payment: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<PaymentResponseDto>>> GetPaymentsByOrderIdAsync(Guid orderId)
        {
            try
            {
                var payments = await _unitOfWork.Payments.GetPaymentsByOrderIdAsync(orderId);
                var order = await _unitOfWork.Orders.GetByIdAsync(orderId);

                var responseDtos = payments.Select(p =>
                {
                    var dto = _mapper.Map<PaymentResponseDto>(p);
                    if (order != null)
                    {
                        dto.OrderCode = order.OrderCode;
                    }
                    return dto;
                });

                return BaseResponse<IEnumerable<PaymentResponseDto>>.Ok(responseDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments for order {OrderId}", orderId);
                return BaseResponse<IEnumerable<PaymentResponseDto>>.Fail($"Error getting payments: {ex.Message}");
            }
        }

        /// <summary>
        /// Tạo UserCourse records sau khi thanh toán thành công
        /// </summary>
        private async Task CreateUserCoursesAsync(Domain.Entities.Order order, Guid paymentId)
        {
            foreach (var orderItem in order.OrderItems)
            {
                // Kiểm tra xem user đã có course này chưa (status Active)
                var hasActiveCourse = await _unitOfWork.UserCourses.UserHasActiveCourseAsync(order.UserId, orderItem.CourseId);

                if (hasActiveCourse)
                {
                    _logger.LogInformation("User {UserId} already has course {CourseId}, skipping", order.UserId, orderItem.CourseId);
                    continue;
                }

                // Tạo UserCourse
                var userCourse = new Domain.Entities.UserCourse
                {
                    UserId = order.UserId,
                    CourseId = orderItem.CourseId,
                    OrderId = order.Id,
                    OrderItemId = orderItem.Id,
                    PurchasePrice = orderItem.TotalPrice,
                    EnrolledAt = DateTime.UtcNow,
                    Status = UserCourseStatus.Active,
                    CreatedBy = order.UserId
                };

                await _unitOfWork.UserCourses.AddAsync(userCourse);
            }

            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Created UserCourse records for order {OrderId}", order.Id);
        }
    }
}

