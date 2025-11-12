using Elearn.Infrastructure.Repository;
using System.IdentityModel.Tokens.Jwt;

namespace Elearn.WebAPI.Middleware
{
    /// <summary>
    /// Middleware để kiểm tra token có trong blacklist không
    /// </summary>
    public class TokenBlacklistMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TokenBlacklistMiddleware> _logger;

        public TokenBlacklistMiddleware(RequestDelegate next, ILogger<TokenBlacklistMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IUnitOfWork unitOfWork)
        {
            // Chỉ check cho các request có Authorization header
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                var authHeader = context.Request.Headers["Authorization"].ToString();
                if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();

                    try
                    {
                        // Parse token để lấy jti (nếu có) hoặc dùng full token
                        var handler = new JwtSecurityTokenHandler();
                        if (handler.CanReadToken(token))
                        {
                            var jwtToken = handler.ReadJwtToken(token);
                            
                            // Kiểm tra token có trong blacklist không
                            var isBlacklisted = await unitOfWork.BlacklistedTokens.IsTokenBlacklistedAsync(token);
                            
                            if (isBlacklisted)
                            {
                                _logger.LogWarning("Blacklisted token attempted to be used: {TokenId}", jwtToken.Id);
                                context.Response.StatusCode = 401;
                                await context.Response.WriteAsJsonAsync(new
                                {
                                    message = "Token has been revoked",
                                    status = 401
                                });
                                return;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error checking token blacklist");
                        // Nếu có lỗi khi check, vẫn cho phép request tiếp tục (fail open)
                        // Hoặc có thể fail closed tùy security requirement
                    }
                }
            }

            await _next(context);
        }
    }

    public static class TokenBlacklistMiddlewareExtensions
    {
        public static IApplicationBuilder UseTokenBlacklist(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TokenBlacklistMiddleware>();
        }
    }
}

