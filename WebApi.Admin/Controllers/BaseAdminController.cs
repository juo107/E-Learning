using Elearn.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public abstract class BaseAdminController<T> : ControllerBase
    {
        protected readonly ILogger<T> _logger;

        protected BaseAdminController(ILogger<T> logger)
        {
            _logger = logger;
        }

        protected IActionResult HandleResponse<TResult>(BaseResponse<TResult> result)
        {
            if (result == null)
            {
                _logger.LogError("Null response encountered.");
                return StatusCode(500, BaseResponse<TResult>.Fail("Internal Server Error"));
            }

            if (result.Success)
                return Ok(result);

            if (result.Message?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true)
                return NotFound(result);

            _logger.LogWarning("API failed: {Message}", result.Message);
            return BadRequest(result);
        }

        protected string GetModelErrors() =>
            string.Join(", ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));
    }
}

