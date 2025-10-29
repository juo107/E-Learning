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
            // Bộ nhớ trong tiến trình cho index nóng (IMemoryCache)
            services.AddMemoryCache(options =>
            {
                // Giới hạn kích thước để tránh tiêu tốn RAM quá mức
                options.SizeLimit = 1024; // đơn vị tuỳ entry khai báo (Size)
                options.CompactionPercentage = 0.2;
            });

            services.AddDbContext<ElearnDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Add Redis Cache
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("Redis");
            });
            services.AddScoped<IRedisCacheService, RedisCacheService>();
            // In-memory index service
            services.AddSingleton<IInMemoryIndexService, InMemoryIndexService>();
            
            // Test Redis connection on startup
            services.AddHostedService<RedisConnectionTestService>();

            // Register repositories, services ở đây sau
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
