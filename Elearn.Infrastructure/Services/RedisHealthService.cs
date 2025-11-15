using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Service để theo dõi và quản lý trạng thái kết nối Redis
    /// Thread-safe implementation
    /// </summary>
    public class RedisHealthService : IRedisHealthService
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<RedisHealthService> _logger;
        private volatile bool _isHealthy = true; // Giả định ban đầu là healthy
        private DateTime? _lastFailureTime;
        private int _retryCount = 0;
        private readonly object _lockObject = new object();

        public bool IsHealthy => _isHealthy;
        public DateTime? LastFailureTime => _lastFailureTime;
        public int RetryCount => _retryCount;

        public RedisHealthService(IDistributedCache cache, ILogger<RedisHealthService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public void MarkAsUnhealthy()
        {
            lock (_lockObject)
            {
                if (_isHealthy)
                {
                    _isHealthy = false;
                    _lastFailureTime = DateTime.UtcNow;
                    _logger.LogWarning("⚠️ Redis marked as unhealthy at {Time}", _lastFailureTime);
                }
            }
        }

        public void MarkAsHealthy()
        {
            lock (_lockObject)
            {
                if (!_isHealthy)
                {
                    _isHealthy = true;
                    _retryCount = 0;
                    _lastFailureTime = null;
                    _logger.LogInformation("✅ Redis marked as healthy. Connection restored.");
                }
            }
        }

        public async Task<bool> TryReconnectAsync()
        {
            try
            {
                // Sử dụng CancellationToken với timeout 3 giây để tránh block quá lâu
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
                
                // Test connection bằng cách set và get một test key
                var testKey = "redis_health_check";
                var testValue = $"test_{DateTime.UtcNow:O}";
                
                try
                {
                    await _cache.SetStringAsync(
                        testKey, 
                        testValue, 
                        new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10)
                        },
                        cts.Token);

                    var retrievedValue = await _cache.GetStringAsync(testKey, cts.Token);
                    
                    if (retrievedValue == testValue)
                    {
                        MarkAsHealthy();
                        _logger.LogInformation("✅ Redis reconnection successful!");
                        return true;
                    }
                    else
                    {
                        MarkAsUnhealthy();
                        _logger.LogWarning("⚠️ Redis reconnection test failed - value mismatch");
                        return false;
                    }
                }
                catch (OperationCanceledException)
                {
                    // Timeout - Redis không phản hồi trong 3 giây
                    lock (_lockObject)
                    {
                        _retryCount++;
                    }
                    MarkAsUnhealthy();
                    _logger.LogWarning("⏱️ Redis reconnection timeout after 3 seconds (Attempt #{RetryCount})", _retryCount);
                    return false;
                }
            }
            catch (Exception ex)
            {
                lock (_lockObject)
                {
                    _retryCount++;
                }
                MarkAsUnhealthy();
                
                // Log ngắn gọn hơn để tránh spam log
                var errorMessage = ex.Message.Length > 200 ? ex.Message.Substring(0, 200) + "..." : ex.Message;
                _logger.LogWarning("❌ Redis reconnection attempt {RetryCount} failed: {Message}", _retryCount, errorMessage);
                return false;
            }
        }
    }
}

