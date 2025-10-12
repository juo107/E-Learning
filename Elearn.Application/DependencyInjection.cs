using Microsoft.Extensions.DependencyInjection;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Services.Implementations;

namespace Elearn.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<ICategoryService, CategoryService>();
            return services;
        }
    }
}
