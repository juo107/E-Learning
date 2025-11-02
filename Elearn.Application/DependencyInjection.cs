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
            
            // Đăng ký validators
            services.AddValidators();
            
            return services;
        }
    }
}
