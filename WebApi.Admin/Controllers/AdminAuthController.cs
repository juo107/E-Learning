using Elearn.Application.Common;
using Elearn.Application.DTOs.Auth;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminAuthController : BaseAdminController<AdminAuthController>
    {
        private readonly IAuthService _authService;

        public AdminAuthController(IAuthService authService, ILogger<AdminAuthController> logger)
            : base(logger)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(BaseResponse<AuthResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);

                // Verify user has admin role
                if (result.Role != "SystemSuperAdmin" && result.Role != "TenantAdmin" && result.Role != "ContentAdmin")
                {
                    return BadRequest(BaseResponse<AuthResponseDto>.Fail("Access denied. Admin privileges required."));
                }

                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Login successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}", loginDto.Email);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(BaseResponse<AuthResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                // Only allow admin roles for admin portal registration
                if (registerDto.Role != "SystemSuperAdmin" && registerDto.Role != "TenantAdmin" && registerDto.Role != "ContentAdmin")
                {
                    return BadRequest(BaseResponse<AuthResponseDto>.Fail("Only SystemSuperAdmin, TenantAdmin, and ContentAdmin roles are allowed for admin portal registration."));
                }

                var result = await _authService.RegisterAsync(registerDto);
                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Registration successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", registerDto.Email);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPost("logout")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        public IActionResult Logout()
        {
            // Client-side token removal is sufficient for JWT
            // But we can add token blacklisting here if needed
            return Ok(BaseResponse<bool>.Ok(true, "Logout successful"));
        }

        [HttpGet("me")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetCurrentUser()
        {
            var user = User;
            var userInfo = new
            {
                Email = user.Identity?.Name,
                Claims = user.Claims.Select(c => new { c.Type, c.Value }),
                Roles = user.Claims
                    .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
                    .Select(c => c.Value)
            };

            return Ok(BaseResponse<object>.Ok(userInfo, "User information retrieved successfully"));
        }
    }
}

