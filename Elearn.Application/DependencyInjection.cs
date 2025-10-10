using Microsoft.Extensions.DependencyInjection;
using Elearn.Application.Interfaces;
using Elearn.Application.Services;

namespace Elearn.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ICourseService, CourseService>();
            return services;
        }
    }
}
