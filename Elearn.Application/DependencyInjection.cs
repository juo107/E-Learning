using Microsoft.Extensions.DependencyInjection;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Services.Implementations;
using Elearn.Application.Validations;

namespace Elearn.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICourseMediaService, CourseMediaService>();
            services.AddScoped<IPromotionService, PromotionService>();
            services.AddScoped<IAuthService, Elearn.Application.Services.Implementations.AuthService>();
            services.AddScoped<IVNPayService, Elearn.Application.Services.Implementations.VNPay.VNPayService>();
            services.AddScoped<IPaymentService, Elearn.Application.Services.Implementations.Payment.PaymentService>();
            services.AddScoped<ICartService, Elearn.Application.Services.Implementations.Cart.CartService>();
            services.AddScoped<IOrderService, Elearn.Application.Services.Implementations.Order.OrderService>();
            services.AddScoped<IInstructorService, Elearn.Application.Services.Implementations.Instructor.InstructorService>();
            services.AddScoped<IUserService, Elearn.Application.Services.Implementations.UserService>();
            services.AddScoped<ISectionService, Elearn.Application.Services.Implementations.SectionService>();
            
            // Đăng ký validators
            services.AddValidators();
            
            return services;
        }
    }
}
