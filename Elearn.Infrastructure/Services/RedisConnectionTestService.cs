using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Service để test kết nối Redis khi khởi động ứng dụng
    /// Chỉ chạy một lần khi start, sau đó RedisReconnectService sẽ tiếp quản
    /// </summary>
    public class RedisConnectionTestService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RedisConnectionTestService> _logger;

        public RedisConnectionTestService(IServiceProvider serviceProvider, ILogger<RedisConnectionTestService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Wait a bit for services to be ready
            await Task.Delay(2000, stoppingToken);

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var cache = scope.ServiceProvider.GetRequiredService<IDistributedCache>();
                var healthService = scope.ServiceProvider.GetRequiredService<IRedisHealthService>();
                
                // Sử dụng timeout 5 giây cho initial connection test
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                
                try
                {
                    // Test Redis connection
                    await cache.SetStringAsync(
                        "redis_test", 
                        "connected", 
                        new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
                        }, 
                        cts.Token);

                    var testValue = await cache.GetStringAsync("redis_test", cts.Token);
                    
                    if (testValue == "connected")
                    {
                        healthService.MarkAsHealthy();
                        _logger.LogInformation("✅ Redis connection successful! Cache is working properly.");
                        Console.WriteLine("✅ Redis connection successful! Cache is working properly.");
                    }
                    else
                    {
                        healthService.MarkAsUnhealthy();
                        _logger.LogWarning("⚠️ Redis connection test failed - value mismatch");
                        Console.WriteLine("⚠️ Redis connection test failed - value mismatch");
                    }
                }
                catch (OperationCanceledException)
                {
                    healthService.MarkAsUnhealthy();
                    _logger.LogWarning("⏱️ Redis connection test timeout after 5 seconds. Application will continue using database directly.");
                    Console.WriteLine("⏱️ Redis connection test timeout. Application will continue using database directly.");
                }
            }
            catch (Exception ex)
            {
                using var scope = _serviceProvider.CreateScope();
                var healthService = scope.ServiceProvider.GetRequiredService<IRedisHealthService>();
                healthService.MarkAsUnhealthy();
                
                var errorMessage = ex.Message.Length > 200 ? ex.Message.Substring(0, 200) + "..." : ex.Message;
                _logger.LogError("❌ Redis connection failed: {Message}. Application will continue using database directly.", errorMessage);
                Console.WriteLine($"❌ Redis connection failed. Application will continue using database directly.");
            }
        }
    }
}
