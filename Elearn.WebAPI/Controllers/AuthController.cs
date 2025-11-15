using Elearn.Application.Common;
using Elearn.Application.DTOs.Auth;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Validators;
using Elearn.Infrastructure.Repository;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController<AuthController>
    {
        private readonly IAuthService _authService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthController(IAuthService authService, IUnitOfWork unitOfWork, ILogger<AuthController> logger)
            : base(logger)
        {
            _authService = authService;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                // Validate using FluentValidation
                var validator = new RegisterDtoValidator();
                var validationResult = await validator.ValidateAsync(registerDto);
                
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    return BadRequest(BaseResponse<AuthResponseDto>.Fail(errors));
                }

                var result = await _authService.RegisterAsync(registerDto);
                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Registration successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", registerDto?.Email);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                // Validate using FluentValidation
                var validator = new LoginDtoValidator();
                var validationResult = await validator.ValidateAsync(loginDto);
                
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    return BadRequest(BaseResponse<AuthResponseDto>.Fail(errors));
                }

                var result = await _authService.LoginAsync(loginDto);
                _logger.LogInformation("Login successful for email: {Email}", loginDto?.Email);
                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Login successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}. Error: {ErrorMessage}", loginDto?.Email, ex.Message);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(BaseResponse<UserDto>.Fail("User not authenticated"));
                }

                var result = await _authService.GetCurrentUserAsync(userId);
                return Ok(BaseResponse<UserDto>.Ok(result, "User information retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return BadRequest(BaseResponse<UserDto>.Fail(ex.Message));
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(BaseResponse<bool>.Fail(GetModelErrors()));
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(BaseResponse<bool>.Fail("User not authenticated"));
                }

                var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
                return Ok(BaseResponse<bool>.Ok(result, "Password changed successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return BadRequest(BaseResponse<bool>.Fail(ex.Message));
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(BaseResponse<bool>.Fail("User not authenticated"));
                }

                // Lấy token từ Authorization header
                var authHeader = Request.Headers["Authorization"].ToString();
                if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();

                    try
                    {
                        // Parse token để lấy expiration time
                        var handler = new JwtSecurityTokenHandler();
                        if (handler.CanReadToken(token))
                        {
                            var jwtToken = handler.ReadJwtToken(token);
                            var expClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp);
                            
                            DateTime expiresAt;
                            if (expClaim != null && long.TryParse(expClaim.Value, out var expUnix))
                            {
                                expiresAt = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
                            }
                            else
                            {
                                // Nếu không có exp claim, set expires sau 24h
                                expiresAt = DateTime.UtcNow.AddHours(24);
                            }

                            // Thêm token vào blacklist
                            await _unitOfWork.BlacklistedTokens.AddTokenToBlacklistAsync(
                                token, 
                                userId, 
                                expiresAt, 
                                "Logout"
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to parse token for blacklist, but logout continues");
                        // Vẫn cho phép logout thành công dù không parse được token
                    }
                }

                return Ok(BaseResponse<bool>.Ok(true, "Logout successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return BadRequest(BaseResponse<bool>.Fail($"Logout failed: {ex.Message}"));
            }
        }
    }
}

