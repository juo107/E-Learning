using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Background service để tự động retry kết nối Redis khi bị disconnect
    /// Chạy song song và liên tục kiểm tra trạng thái Redis
    /// </summary>
    public class RedisReconnectService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RedisReconnectService> _logger;
        private readonly TimeSpan _retryInterval = TimeSpan.FromSeconds(30); // Retry mỗi 30 giây

        public RedisReconnectService(
            IServiceProvider serviceProvider,
            ILogger<RedisReconnectService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Đợi một chút để các services khác khởi động xong
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);

            _logger.LogInformation("🔄 Redis Reconnect Service started. Monitoring Redis connection...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var healthService = scope.ServiceProvider.GetRequiredService<IRedisHealthService>();

                    // Chỉ retry nếu Redis đang unhealthy
                    if (!healthService.IsHealthy)
                    {
                        _logger.LogInformation(
                            "🔄 Attempting to reconnect Redis... (Retry #{RetryCount}, Last failure: {LastFailure})",
                            healthService.RetryCount + 1,
                            healthService.LastFailureTime);

                        var reconnected = await healthService.TryReconnectAsync();

                        if (reconnected)
                        {
                            _logger.LogInformation(
                                "✅ Redis reconnected successfully after {RetryCount} attempts!",
                                healthService.RetryCount);
                        }
                        else
                        {
                            _logger.LogWarning(
                                "⚠️ Redis reconnection failed (Attempt #{RetryCount}). Will retry in {Interval} seconds...",
                                healthService.RetryCount,
                                _retryInterval.TotalSeconds);
                        }
                    }

                    // Đợi trước khi retry tiếp
                    await Task.Delay(_retryInterval, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Service đang shutdown
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error in Redis Reconnect Service: {Message}", ex.Message);
                    // Đợi một chút trước khi tiếp tục
                    await Task.Delay(_retryInterval, stoppingToken);
                }
            }

            _logger.LogInformation("🛑 Redis Reconnect Service stopped.");
        }
    }
}

