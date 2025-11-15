using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Elearn.Infrastructure.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDistributedCache _cache;
        private readonly IRedisHealthService _healthService;
        private readonly ILogger<RedisCacheService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        public RedisCacheService(
            IDistributedCache cache, 
            IRedisHealthService healthService,
            ILogger<RedisCacheService> logger)
        {
            _cache = cache;
            _healthService = healthService;
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            // Nếu Redis không healthy, skip cache và return null (sẽ dùng DB)
            if (!_healthService.IsHealthy)
            {
                return null;
            }

            try
            {
                var cachedValue = await _cache.GetStringAsync(key);
                if (string.IsNullOrEmpty(cachedValue))
                    return null;

                // Nếu get thành công, đánh dấu Redis healthy (nếu trước đó bị unhealthy)
                // Note: Check này cần thiết vì có thể Redis recover trong lúc đang xử lý
                if (!_healthService.IsHealthy)
                {
                    _healthService.MarkAsHealthy();
                }

                return JsonSerializer.Deserialize<T>(cachedValue, _jsonOptions);
            }
            catch (Exception ex)
            {
                // Redis fail → đánh dấu unhealthy và return null (fallback về DB)
                _healthService.MarkAsUnhealthy();
                _logger.LogWarning(ex, "Redis GetAsync failed for key: {Key}. Falling back to database.", key);
                return null;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            // Nếu Redis không healthy, skip cache (không crash, chỉ log)
            if (!_healthService.IsHealthy)
            {
                _logger.LogDebug("Skipping Redis SetAsync for key: {Key} - Redis is unhealthy", key);
                return;
            }

            try
            {
                var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
                var options = new DistributedCacheEntryOptions();

                if (expiry.HasValue)
                {
                    options.SetAbsoluteExpiration(expiry.Value);
                }
                else
                {
                    options.SetAbsoluteExpiration(TimeSpan.FromMinutes(30)); // Default 30 minutes
                }

                await _cache.SetStringAsync(key, serializedValue, options);

                // Nếu set thành công, đánh dấu Redis healthy (phòng trường hợp Redis recover trong lúc xử lý)
                _healthService.MarkAsHealthy();
            }
            catch (Exception ex)
            {
                // Redis fail → đánh dấu unhealthy (không crash)
                _healthService.MarkAsUnhealthy();
                _logger.LogWarning(ex, "Redis SetAsync failed for key: {Key}. Data will not be cached.", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            // Nếu Redis không healthy, skip cache removal
            if (!_healthService.IsHealthy)
            {
                return;
            }

            try
            {
                await _cache.RemoveAsync(key);
            }
            catch (Exception ex)
            {
                // Redis fail → đánh dấu unhealthy
                _healthService.MarkAsUnhealthy();
                _logger.LogWarning(ex, "Redis RemoveAsync failed for key: {Key}", key);
            }
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            // Nếu Redis không healthy, skip
            if (!_healthService.IsHealthy)
            {
                return;
            }

            try
            {
                // Note: This is a simplified implementation
                // For production, consider using Redis SCAN command or a more sophisticated pattern matching
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _healthService.MarkAsUnhealthy();
                _logger.LogWarning(ex, "Redis RemoveByPatternAsync failed for pattern: {Pattern}", pattern);
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            // Nếu Redis không healthy, return false (không tồn tại trong cache)
            if (!_healthService.IsHealthy)
            {
                return false;
            }

            try
            {
                var value = await _cache.GetStringAsync(key);
                return !string.IsNullOrEmpty(value);
            }
            catch (Exception ex)
            {
                _healthService.MarkAsUnhealthy();
                _logger.LogWarning(ex, "Redis ExistsAsync failed for key: {Key}", key);
                return false;
            }
        }
    }
}
