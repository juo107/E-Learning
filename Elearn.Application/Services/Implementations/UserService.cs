using Elearn.Application.Common;
using Elearn.Application.DTOs.User;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Identity;
using Elearn.Domain.Entities.Enums.Identity;
using Elearn.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Elearn.Infrastructure.Services;

namespace Elearn.Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ElearnDbContext _context;
        private readonly IRedisCacheService _cache;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ElearnDbContext context,
            IRedisCacheService cache)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<UserListDto>>> GetAllUsersAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                // Create cache key
                var cacheKey = $"users:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}:role:{parameters.Role}:userType:{parameters.UserType}:emailConfirmed:{parameters.EmailConfirmed}:isLocked:{parameters.IsLocked}";
                
                // Try to get from cache first
                var cachedUsers = await _cache.GetAsync<IEnumerable<UserListDto>>(cacheKey);
                if (cachedUsers != null)
                {
                    return BaseResponse<IEnumerable<UserListDto>>.Ok(cachedUsers, "Users retrieved from cache");
                }

                var query = _context.Users.AsQueryable();

                // Filter by keyword (email, fullname)
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    var keyword = parameters.Keyword.ToLower().Trim();
                    query = query.Where(u => 
                        (u.Email != null && u.Email.ToLower().Contains(keyword)) ||
                        (u.FullName != null && u.FullName.ToLower().Contains(keyword)));
                }

                // Filter by role (need to check user roles)
                if (!string.IsNullOrWhiteSpace(parameters.Role))
                {
                    var usersInRole = await _userManager.GetUsersInRoleAsync(parameters.Role);
                    var userIdsInRole = usersInRole.Select(u => u.Id).ToList();
                    query = query.Where(u => userIdsInRole.Contains(u.Id));
                }

                // Filter by user type
                if (!string.IsNullOrWhiteSpace(parameters.UserType))
                {
                    if (Enum.TryParse<SystemRole>(parameters.UserType, out var userType))
                    {
                        query = query.Where(u => u.UserType == userType);
                    }
                }

                // Filter by email confirmed
                if (parameters.EmailConfirmed.HasValue)
                {
                    query = query.Where(u => u.EmailConfirmed == parameters.EmailConfirmed.Value);
                }

                // Filter by locked status
                if (parameters.IsLocked.HasValue)
                {
                    if (parameters.IsLocked.Value)
                    {
                        query = query.Where(u => u.LockoutEnabled && (u.LockoutEnd == null || u.LockoutEnd > DateTimeOffset.UtcNow));
                    }
                    else
                    {
                        query = query.Where(u => !u.LockoutEnabled || (u.LockoutEnd != null && u.LockoutEnd <= DateTimeOffset.UtcNow));
                    }
                }

                // Sort
                query = (parameters.SortBy?.ToLower()) switch
                {
                    "email" => parameters.IsDescending 
                        ? query.OrderByDescending(u => u.Email) 
                        : query.OrderBy(u => u.Email),
                    "fullname" => parameters.IsDescending 
                        ? query.OrderByDescending(u => u.FullName) 
                        : query.OrderBy(u => u.FullName),
                    "createdat" => parameters.IsDescending 
                        ? query.OrderByDescending(u => u.Id) // Using Id as proxy for CreatedAt
                        : query.OrderBy(u => u.Id),
                    _ => parameters.IsDescending 
                        ? query.OrderByDescending(u => u.Id) 
                        : query.OrderBy(u => u.Id)
                };

                var totalCount = await query.CountAsync();

                var users = await query
                    .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                    .Take(parameters.PageSize)
                    .ToListAsync();

                var userDtos = new List<UserListDto>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var role = roles.FirstOrDefault() ?? "Student";

                    // Get enrollment statistics
                    var enrollments = await _context.UserCourses
                        .Where(uc => uc.UserId == user.Id && !uc.IsDeleted)
                        .ToListAsync();

                    var totalEnrollments = enrollments.Count;
                    var completedCourses = enrollments.Count(uc => uc.IsCompleted);

                    userDtos.Add(new UserListDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? "",
                        FullName = user.FullName,
                        AvatarUrl = user.AvatarUrl,
                        Role = role,
                        UserType = user.UserType.ToString(),
                        EmailConfirmed = user.EmailConfirmed,
                        LockoutEnabled = user.LockoutEnabled,
                        LockoutEnd = user.LockoutEnd,
                        CreatedAt = DateTime.UtcNow, // Note: Identity doesn't have CreatedAt by default
                        TotalEnrollments = totalEnrollments,
                        CompletedCourses = completedCourses
                    });
                }

                // Cache for 10 minutes
                await _cache.SetAsync(cacheKey, userDtos, TimeSpan.FromMinutes(10));

                return BaseResponse<IEnumerable<UserListDto>>.Ok(userDtos, $"Users retrieved successfully. Total: {totalCount}.");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<UserListDto>>.Fail($"Error retrieving users: {ex.Message}");
            }
        }

        public async Task<BaseResponse<UserDetailsDto>> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<UserDetailsDto>.Fail("User not found");
                }

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "Student";

                // Get enrollment statistics
                var enrollments = await _context.UserCourses
                    .Where(uc => uc.UserId == user.Id && !uc.IsDeleted)
                    .ToListAsync();

                var totalEnrollments = enrollments.Count;
                var completedCourses = enrollments.Count(uc => uc.IsCompleted);
                var inProgressCourses = enrollments.Count(uc => !uc.IsCompleted && uc.ProgressPercent > 0);

                var userDto = new UserDetailsDto
                {
                    Id = user.Id,
                    Email = user.Email ?? "",
                    FullName = user.FullName,
                    AvatarUrl = user.AvatarUrl,
                    Role = role,
                    UserType = user.UserType.ToString(),
                    EmailConfirmed = user.EmailConfirmed,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEnd = user.LockoutEnd,
                    CreatedAt = DateTime.UtcNow,
                    TotalEnrollments = totalEnrollments,
                    CompletedCourses = completedCourses,
                    InProgressCourses = inProgressCourses,
                    PhoneNumber = user.PhoneNumber,
                    AccessFailedCount = user.AccessFailedCount
                };

                return BaseResponse<UserDetailsDto>.Ok(userDto, "User retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<UserDetailsDto>.Fail($"Error retrieving user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<UserDetailsDto>> UpdateUserAsync(string userId, UpdateUserDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<UserDetailsDto>.Fail("User not found");
                }

                // Update properties
                if (dto.FullName != null)
                    user.FullName = dto.FullName;
                
                if (dto.AvatarUrl != null)
                    user.AvatarUrl = dto.AvatarUrl;

                if (dto.EmailConfirmed.HasValue)
                    user.EmailConfirmed = dto.EmailConfirmed.Value;

                if (dto.LockoutEnabled.HasValue)
                    user.LockoutEnabled = dto.LockoutEnabled.Value;

                if (dto.LockoutEnd.HasValue)
                    user.LockoutEnd = dto.LockoutEnd.Value;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BaseResponse<UserDetailsDto>.Fail($"Failed to update user: {errors}");
                }

                // Update role if provided
                if (!string.IsNullOrEmpty(dto.Role))
                {
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    
                    if (!await _roleManager.RoleExistsAsync(dto.Role))
                    {
                        await _roleManager.CreateAsync(new ApplicationRole { Name = dto.Role });
                    }
                    
                    await _userManager.AddToRoleAsync(user, dto.Role);
                }

                // Invalidate cache
                await _cache.RemoveByPatternAsync("users:*");

                var updatedUser = await GetUserByIdAsync(userId);
                return updatedUser;
            }
            catch (Exception ex)
            {
                return BaseResponse<UserDetailsDto>.Fail($"Error updating user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteUserAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<bool>.Fail("User not found");
                }

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BaseResponse<bool>.Fail($"Failed to delete user: {errors}");
                }

                // Invalidate cache
                await _cache.RemoveByPatternAsync("users:*");

                return BaseResponse<bool>.Ok(true, "User deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreUserAsync(string userId)
        {
            try
            {
                // Identity doesn't have soft delete by default
                // This would need to be implemented if using soft delete
                return BaseResponse<bool>.Fail("User restore is not implemented. Identity uses hard delete.");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> LockUserAsync(string userId, DateTimeOffset? lockoutEnd = null)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<bool>.Fail("User not found");
                }

                user.LockoutEnabled = true;
                user.LockoutEnd = lockoutEnd ?? DateTimeOffset.UtcNow.AddYears(100); // Lock indefinitely if not specified

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BaseResponse<bool>.Fail($"Failed to lock user: {errors}");
                }

                // Invalidate cache
                await _cache.RemoveByPatternAsync("users:*");

                return BaseResponse<bool>.Ok(true, "User locked successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error locking user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> UnlockUserAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<bool>.Fail("User not found");
                }

                user.LockoutEnabled = false;
                user.LockoutEnd = null;
                user.AccessFailedCount = 0;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BaseResponse<bool>.Fail($"Failed to unlock user: {errors}");
                }

                // Invalidate cache
                await _cache.RemoveByPatternAsync("users:*");

                return BaseResponse<bool>.Ok(true, "User unlocked successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error unlocking user: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ResetPasswordAsync(string userId, ResetPasswordDto dto)
        {
            try
            {
                if (dto.NewPassword != dto.ConfirmPassword)
                {
                    return BaseResponse<bool>.Fail("New password and confirmation password do not match");
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<bool>.Fail("User not found");
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
                
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BaseResponse<bool>.Fail($"Failed to reset password: {errors}");
                }

                return BaseResponse<bool>.Ok(true, "Password reset successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error resetting password: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ChangeUserRoleAsync(string userId, string role)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BaseResponse<bool>.Fail("User not found");
                }

                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new ApplicationRole { Name = role });
                }

                await _userManager.AddToRoleAsync(user, role);

                // Invalidate cache
                await _cache.RemoveByPatternAsync("users:*");

                return BaseResponse<bool>.Ok(true, "User role changed successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error changing user role: {ex.Message}");
            }
        }
    }
}

