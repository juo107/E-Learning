using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Elearn.Infrastructure.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDistributedCache _cache;
        private readonly JsonSerializerOptions _jsonOptions;

        public RedisCacheService(IDistributedCache cache)
        {
            _cache = cache;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            try
            {
                var cachedValue = await _cache.GetStringAsync(key);
                if (string.IsNullOrEmpty(cachedValue))
                    return null;

                return JsonSerializer.Deserialize<T>(cachedValue, _jsonOptions);
            }
            catch
            {
                return null; // Graceful fallback if Redis is down
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
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
            }
            catch
            {
                // Graceful fallback - cache miss is better than app crash
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _cache.RemoveAsync(key);
            }
            catch
            {
                // Graceful fallback
            }
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            try
            {
                // Note: This is a simplified implementation
                // For production, consider using Redis SCAN command or a more sophisticated pattern matching
                await Task.CompletedTask;
            }
            catch
            {
                // Graceful fallback
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                var value = await _cache.GetStringAsync(key);
                return !string.IsNullOrEmpty(value);
            }
            catch
            {
                return false;
            }
        }
    }
}
