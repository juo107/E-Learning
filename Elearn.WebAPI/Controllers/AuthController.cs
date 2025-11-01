using Elearn.Application.Common;
using Elearn.Application.DTOs.Auth;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController<AuthController>
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
            : base(logger)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Registration successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", registerDto.Email);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(BaseResponse<AuthResponseDto>.Ok(result, "Login successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}", loginDto.Email);
                return BadRequest(BaseResponse<AuthResponseDto>.Fail(ex.Message));
            }
        }
    }
}

