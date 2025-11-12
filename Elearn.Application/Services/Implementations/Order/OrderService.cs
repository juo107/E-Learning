using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Order;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Microsoft.Extensions.Logging;

namespace Elearn.Application.Services.Implementations.Order
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<OrderService> _logger;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<OrderService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<BaseResponse<OrderDto>> CreateOrderAsync(CreateOrderDto dto, string userId, string? ipAddress)
        {
            try
            {
                if (dto.CourseIds == null || dto.CourseIds.Count == 0)
                {
                    return BaseResponse<OrderDto>.Fail("Course IDs are required");
                }

                // Lấy danh sách courses
                var courses = new List<Course>();
                foreach (var courseId in dto.CourseIds)
                {
                    var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
                    if (course == null || course.IsDeleted)
                    {
                        return BaseResponse<OrderDto>.Fail($"Course with ID {courseId} not found");
                    }
                    courses.Add(course);
                }

                // Tạo order
                var order = new Domain.Entities.Order
                {
                    OrderCode = await GenerateUniqueOrderCodeAsync(),
                    UserId = userId,
                    Status = OrderStatus.Created,
                    Currency = "VND",
                    ClientIp = ipAddress,
                    CreatedBy = userId
                };

                // Tính toán giá
                decimal subtotal = 0;
                decimal totalDiscount = 0;

                foreach (var course in courses)
                {
                    var unitPrice = GetEffectivePrice(course);
                    var discountAmount = course.Price - unitPrice;

                    subtotal += course.Price;
                    totalDiscount += discountAmount;

                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        CourseId = course.Id,
                        Quantity = 1,
                        UnitPrice = unitPrice,
                        DiscountAmount = discountAmount,
                        TotalPrice = unitPrice,
                        InstructorId = null, // TODO: Get from course when Course entity has InstructorId
                        CreatedBy = userId
                    };

                    order.OrderItems.Add(orderItem);
                }

                order.Subtotal = subtotal;
                order.Discount = totalDiscount;
                order.TotalAmount = subtotal - totalDiscount;

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.CompleteAsync();

                // Map to DTO
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderCode = order.OrderCode,
                    Status = order.Status.ToString(),
                    Currency = order.Currency,
                    Subtotal = order.Subtotal,
                    Discount = order.Discount,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        CourseId = oi.CourseId,
                        CourseTitle = courses.First(c => c.Id == oi.CourseId).Title,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        DiscountAmount = oi.DiscountAmount,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return BaseResponse<OrderDto>.Ok(orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return BaseResponse<OrderDto>.Fail($"Failed to create order: {ex.Message}");
            }
        }

        public async Task<BaseResponse<OrderDto>> CreateOrderFromCartAsync(CreateOrderFromCartDto dto, string userId, string? ipAddress)
        {
            try
            {
                // Lấy cart items của user
                var cartItems = (await _unitOfWork.CartItems.GetCartItemsByUserIdAndStatusAsync(userId, CartItemStatus.Active)).ToList();

                if (cartItems.Count == 0)
                {
                    return BaseResponse<OrderDto>.Fail("Cart is empty");
                }

                // Tạo order
                var order = new Domain.Entities.Order
                {
                    OrderCode = await GenerateUniqueOrderCodeAsync(),
                    UserId = userId,
                    Status = OrderStatus.Created,
                    Currency = "VND",
                    ClientIp = ipAddress,
                    CreatedBy = userId
                };

                // Tính toán giá
                decimal subtotal = 0;
                decimal totalDiscount = 0;
                var courses = new List<Course>();

                foreach (var cartItem in cartItems)
                {
                    var course = await _unitOfWork.Courses.GetByIdAsync(cartItem.CourseId);
                    if (course == null || course.IsDeleted)
                    {
                        continue; // Skip deleted courses
                    }

                    courses.Add(course);

                    var unitPrice = GetEffectivePrice(course);
                    var discountAmount = course.Price - unitPrice;

                    subtotal += course.Price;
                    totalDiscount += discountAmount;

                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        CourseId = course.Id,
                        Quantity = 1,
                        UnitPrice = unitPrice,
                        DiscountAmount = discountAmount,
                        TotalPrice = unitPrice,
                        InstructorId = null, // TODO: Get from course when Course entity has InstructorId
                        CreatedBy = userId
                    };

                    order.OrderItems.Add(orderItem);

                    // Đánh dấu cart item đã checkout
                    cartItem.Status = CartItemStatus.CheckedOut;
                    _unitOfWork.CartItems.Update(cartItem);
                }

                if (order.OrderItems.Count == 0)
                {
                    return BaseResponse<OrderDto>.Fail("No valid courses in cart");
                }

                order.Subtotal = subtotal;
                order.Discount = totalDiscount;
                order.TotalAmount = subtotal - totalDiscount;

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.CompleteAsync();

                // Map to DTO
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderCode = order.OrderCode,
                    Status = order.Status.ToString(),
                    Currency = order.Currency,
                    Subtotal = order.Subtotal,
                    Discount = order.Discount,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        CourseId = oi.CourseId,
                        CourseTitle = courses.First(c => c.Id == oi.CourseId).Title,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        DiscountAmount = oi.DiscountAmount,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return BaseResponse<OrderDto>.Ok(orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order from cart");
                return BaseResponse<OrderDto>.Fail($"Failed to create order from cart: {ex.Message}");
            }
        }

        public async Task<BaseResponse<OrderDto>> GetOrderByIdAsync(Guid orderId, string userId)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdWithIncludesAsync(orderId, o => o.OrderItems, o => o.OrderItems.Select(oi => oi.Course));
                if (order == null || order.IsDeleted)
                {
                    return BaseResponse<OrderDto>.Fail("Order not found");
                }

                if (order.UserId != userId)
                {
                    return BaseResponse<OrderDto>.Fail("You don't have permission to view this order");
                }

                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderCode = order.OrderCode,
                    Status = order.Status.ToString(),
                    Currency = order.Currency,
                    Subtotal = order.Subtotal,
                    Discount = order.Discount,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        CourseId = oi.CourseId,
                        CourseTitle = oi.Course?.Title ?? "Unknown",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        DiscountAmount = oi.DiscountAmount,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return BaseResponse<OrderDto>.Ok(orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order");
                return BaseResponse<OrderDto>.Fail($"Failed to get order: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<OrderDto>>> GetUserOrdersAsync(string userId)
        {
            try
            {
                var orders = await _unitOfWork.Orders.GetOrdersByUserIdAsync(userId);

                var orderDtos = orders.Select(order => new OrderDto
                {
                    Id = order.Id,
                    OrderCode = order.OrderCode,
                    Status = order.Status.ToString(),
                    Currency = order.Currency,
                    Subtotal = order.Subtotal,
                    Discount = order.Discount,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        CourseId = oi.CourseId,
                        CourseTitle = oi.Course?.Title ?? "Unknown",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        DiscountAmount = oi.DiscountAmount,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                });

                return BaseResponse<IEnumerable<OrderDto>>.Ok(orderDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user orders");
                return BaseResponse<IEnumerable<OrderDto>>.Fail($"Failed to get user orders: {ex.Message}");
            }
        }

        private async Task<string> GenerateUniqueOrderCodeAsync()
        {
            string orderCode;
            int attempts = 0;
            const int maxAttempts = 10;

            do
            {
                // Format: ORD-YYYYMMDD-HHMMSS-XXXX (4 random digits)
                var now = DateTime.UtcNow;
                var random = new Random();
                var randomSuffix = random.Next(1000, 9999);
                orderCode = $"ORD-{now:yyyyMMdd}-{now:HHmmss}-{randomSuffix}";

                attempts++;
                if (attempts >= maxAttempts)
                {
                    throw new Exception("Failed to generate unique order code");
                }
            } while (await _unitOfWork.Orders.ExistsByOrderCodeAsync(orderCode));

            return orderCode;
        }

        /// <summary>
        /// Tính giá hiệu quả của course (lấy giá khuyến mãi nếu còn hiệu lực)
        /// </summary>
        private decimal GetEffectivePrice(Course course)
        {
            // Kiểm tra xem có discount và còn hiệu lực không
            if (course.FinalPrice.HasValue && 
                course.DiscountExpiresAt.HasValue && 
                course.DiscountExpiresAt.Value >= DateTime.UtcNow)
            {
                // Discount còn hiệu lực, trả về giá khuyến mãi
                return course.FinalPrice.Value;
            }

            // Không có discount hoặc đã hết hạn, trả về giá gốc
            return course.Price;
        }
    }
}

