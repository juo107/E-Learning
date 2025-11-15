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

            // Read-only DbContext for CQRS read operations
            services.AddDbContext<ReadDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Add Redis Cache với timeout và retry options
            var redisConnectionString = configuration.GetConnectionString("Redis");
            
            // Thêm timeout options vào connection string nếu chưa có
            if (!string.IsNullOrEmpty(redisConnectionString) && !redisConnectionString.Contains("connectTimeout"))
            {
                // Thêm các options để xử lý timeout tốt hơn
                // connectTimeout: thời gian chờ kết nối (ms)
                // syncTimeout: thời gian chờ sync operations (ms)
                // asyncTimeout: thời gian chờ async operations (ms)
                // abortConnect: false = không abort nếu không connect được ngay, sẽ retry
                redisConnectionString += ",connectTimeout=3000,syncTimeout=3000,asyncTimeout=3000,abortConnect=false";
            }
            
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
            });
            
            // Register Redis Health Service (Singleton để share state across requests)
            services.AddSingleton<IRedisHealthService, RedisHealthService>();
            
            // Register Redis Cache Service
            services.AddScoped<IRedisCacheService, RedisCacheService>();
            
            // In-memory index service
            services.AddSingleton<IInMemoryIndexService, InMemoryIndexService>();
            
            // Test Redis connection on startup (chạy một lần khi start)
            services.AddHostedService<RedisConnectionTestService>();
            
            // Background service để tự động retry kết nối Redis khi bị disconnect
            services.AddHostedService<RedisReconnectService>();

            // Register repositories, services ở đây sau
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IReadUnitOfWork, ReadUnitOfWork>();

            return services;
        }
    }
}
