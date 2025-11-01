using Elearn.Domain.Entities.Identity;
using Elearn.Domain.Entities.Enums.Identity;
using Elearn.Infrastructure.Seed;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Elearn.Infrastructure.Identity
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");

            // Danh sách các roles cần seed
            var roles = new[]
            {
                "Student",
                "Instructor",
                "Admin",
                "SystemSuperAdmin",
                "TenantAdmin",
                "ContentAdmin",
                "SupportStaff",
                "Moderator"
            };

            foreach (var roleName in roles)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    var role = new ApplicationRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpperInvariant()
                    };

                    var result = await roleManager.CreateAsync(role);
                    if (result.Succeeded)
                    {
                        logger.LogInformation("Created role: {RoleName}", roleName);
                    }
                    else
                    {
                        logger.LogError("Failed to create role: {RoleName}. Errors: {Errors}", 
                            roleName, string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
                else
                {
                    logger.LogInformation("Role already exists: {RoleName}", roleName);
                }
            }
        }

        public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");

            // Kiểm tra xem đã có admin user chưa
            var adminEmail = "admin@elearn.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "System Administrator",
                    UserType = SystemRole.SystemSuperAdmin
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123456");
                if (result.Succeeded)
                {
                    // Gán role Admin
                    if (await userManager.IsInRoleAsync(adminUser, "Admin") == false)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                    }
                    logger.LogInformation("Created admin user: {Email}", adminEmail);
                }
                else
                {
                    logger.LogError("Failed to create admin user. Errors: {Errors}", 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger.LogInformation("Admin user already exists: {Email}", adminEmail);
            }
        }

        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");
            
            try
            {
                logger.LogInformation("Starting database seeding...");

                // Seed roles trước
                await SeedRolesAsync(serviceProvider);

                // Seed permissions sau khi có roles
                await PermissionSeeder.SeedPermissionsAsync(serviceProvider);

                // Seed admin user sau (cần roles đã tồn tại)
                await SeedAdminUserAsync(serviceProvider);

                logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }
    }
}

