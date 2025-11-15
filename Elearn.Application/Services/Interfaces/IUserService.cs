using Elearn.Application.Common;
using Elearn.Application.DTOs.User;

namespace Elearn.Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<BaseResponse<IEnumerable<UserListDto>>> GetAllUsersAsync(QueryParameters? parameters = null);
        Task<BaseResponse<UserDetailsDto>> GetUserByIdAsync(string userId);
        Task<BaseResponse<UserDetailsDto>> UpdateUserAsync(string userId, UpdateUserDto dto);
        Task<BaseResponse<bool>> DeleteUserAsync(string userId);
        Task<BaseResponse<bool>> RestoreUserAsync(string userId);
        Task<BaseResponse<bool>> LockUserAsync(string userId, DateTimeOffset? lockoutEnd = null);
        Task<BaseResponse<bool>> UnlockUserAsync(string userId);
        Task<BaseResponse<bool>> ResetPasswordAsync(string userId, ResetPasswordDto dto);
        Task<BaseResponse<bool>> ChangeUserRoleAsync(string userId, string role);
    }
}

