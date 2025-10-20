using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Elearn.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ElearnDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Add Redis Cache
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("Redis");
            });
            services.AddScoped<IRedisCacheService, RedisCacheService>();

            // Register repositories, services ở đây sau
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
