using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elearn.Infrastructure.Services
{
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
                
                // Test Redis connection
                await cache.SetStringAsync("redis_test", "connected", new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
                }, stoppingToken);

                var testValue = await cache.GetStringAsync("redis_test", stoppingToken);
                
                if (testValue == "connected")
                {
                    _logger.LogInformation("✅ Redis connection successful! Cache is working properly.");
                    Console.WriteLine("✅ Redis connection successful! Cache is working properly.");
                }
                else
                {
                    _logger.LogWarning("⚠️ Redis connection test failed - value mismatch");
                    Console.WriteLine("⚠️ Redis connection test failed - value mismatch");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Redis connection failed: {Message}", ex.Message);
                Console.WriteLine($"❌ Redis connection failed: {ex.Message}");
            }
        }
    }
}
