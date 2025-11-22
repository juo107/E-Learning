using Elearn.Application.Common;
using Elearn.Application.DTOs.User;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminUserController : BaseAdminController<AdminUserController>
    {
        private readonly IUserService _userService;

        public AdminUserController(IUserService userService, ILogger<AdminUserController> logger)
            : base(logger)
        {
            _userService = userService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<UserListDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] bool isDescending = true,
            [FromQuery] string? role = null,
            [FromQuery] string? userType = null,
            [FromQuery] bool? emailConfirmed = null,
            [FromQuery] bool? isLocked = null)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                SortBy = sortBy,
                IsDescending = isDescending,
                Role = role,
                UserType = userType,
                EmailConfirmed = emailConfirmed,
                IsLocked = isLocked
            };

            var result = await _userService.GetAllUsersAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<UserDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<UserDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _userService.GetUserByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<UserDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<UserDetailsDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<UserDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<UserDetailsDto>.Fail(GetModelErrors()));
            }

            var result = await _userService.UpdateUserAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        [Authorize(Policy = "SuperAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Lock
        [HttpPost("{id}/lock")]
        [Authorize(Policy = "SuperAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Lock(string id, [FromBody] DateTimeOffset? lockoutEnd = null)
        {
            var result = await _userService.LockUserAsync(id, lockoutEnd);
            return HandleResponse(result);
        }
        #endregion

        #region Unlock
        [HttpPost("{id}/unlock")]
        [Authorize(Policy = "SuperAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Unlock(string id)
        {
            var result = await _userService.UnlockUserAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region ResetPassword
        [HttpPost("{id}/reset-password")]
        [Authorize(Policy = "SuperAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<bool>.Fail(GetModelErrors()));
            }

            var result = await _userService.ResetPasswordAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region ChangeRole
        [HttpPost("{id}/change-role")]
        [Authorize(Policy = "SuperAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ChangeRole(string id, [FromBody] ChangeRoleDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(BaseResponse<bool>.Fail("Role is required"));
            }

            var result = await _userService.ChangeUserRoleAsync(id, dto.Role);
            return HandleResponse(result);
        }
        #endregion
    }
}

