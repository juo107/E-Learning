using Elearn.Application.DTOs.Auth;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities.Identity;
using Elearn.Domain.Entities.Enums.Identity;
using Elearn.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Elearn.Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ElearnDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IConfiguration configuration,
            SignInManager<ApplicationUser> signInManager,
            ElearnDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _context = context;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Kiểm tra email đã tồn tại
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email already exists");
            }

            // Tạo user mới
            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                UserType = registerDto.Role == "Instructor" ? SystemRole.Instructor : SystemRole.Student,
                EmailConfirmed = true // Có thể thay đổi sau khi thêm email confirmation
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Registration failed: {errors}");
            }

            // Gán role cho user
            var roleName = registerDto.Role;
            
            // Đảm bảo role tồn tại
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new ApplicationRole { Name = roleName });
            }

            await _userManager.AddToRoleAsync(user, roleName);

            // Tạo profile tương ứng
            if (registerDto.Role == "Instructor")
            {
                var instructorProfile = new InstructorProfile
                {
                    ApplicationUserId = user.Id,
                    Bio = string.Empty,
                    Profession = string.Empty,
                    Rating = 0
                };
                _context.InstructorProfiles.Add(instructorProfile);
            }
            else if (registerDto.Role == "Student")
            {
                var studentProfile = new StudentProfile
                {
                    ApplicationUserId = user.Id
                };
                _context.StudentProfiles.Add(studentProfile);
            }

            await _context.SaveChangesAsync();

            // Tạo và trả về JWT token
            return await GenerateTokenAsync(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);
            
            if (!result.Succeeded)
            {
                throw new Exception("Invalid email or password");
            }

            return await GenerateTokenAsync(user);
        }

        private async Task<AuthResponseDto> GenerateTokenAsync(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Lấy roles của user
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured")));
            
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(
                int.Parse(_configuration["Jwt:ExpirationHours"] ?? "24"));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Lấy role đầu tiên (thường chỉ có một role)
            var userRole = roles.FirstOrDefault() ?? "Student";

            return new AuthResponseDto
            {
                Token = tokenString,
                Email = user.Email ?? "",
                FullName = user.FullName,
                Role = userRole,
                ExpiresAt = expires
            };
        }

        public async Task<UserDto> GetCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault() ?? "Student";

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? "",
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Role = userRole,
                UserType = user.UserType.ToString()
            };
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Validate new password matches confirmation
            if (changePasswordDto.NewPassword != changePasswordDto.ConfirmNewPassword)
            {
                throw new Exception("New password and confirmation password do not match");
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Password change failed: {errors}");
            }

            return true;
        }
    }
}




