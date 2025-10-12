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
            
            // Đăng ký validators
            services.AddValidators();
            
            return services;
        }
    }
}
