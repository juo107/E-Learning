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

        public static async Task SeedTenantAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");

            // Kiểm tra xem đã có tenant admin user chưa
            var tenantAdminEmail = "tenantadmin@elearn.com";
            var tenantAdminUser = await userManager.FindByEmailAsync(tenantAdminEmail);

            if (tenantAdminUser == null)
            {
                tenantAdminUser = new ApplicationUser
                {
                    UserName = tenantAdminEmail,
                    Email = tenantAdminEmail,
                    EmailConfirmed = true,
                    FullName = "Tenant Administrator",
                    UserType = SystemRole.TenantAdmin
                };

                var result = await userManager.CreateAsync(tenantAdminUser, "TenantAdmin@123456");
                if (result.Succeeded)
                {
                    // Gán role TenantAdmin
                    if (await userManager.IsInRoleAsync(tenantAdminUser, "TenantAdmin") == false)
                    {
                        await userManager.AddToRoleAsync(tenantAdminUser, "TenantAdmin");
                    }
                    logger.LogInformation("Created tenant admin user: {Email}", tenantAdminEmail);
                }
                else
                {
                    logger.LogError("Failed to create tenant admin user. Errors: {Errors}", 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger.LogInformation("Tenant admin user already exists: {Email}", tenantAdminEmail);
            }
        }

        public static async Task SeedContentAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");

            // Kiểm tra xem đã có content admin user chưa
            var contentAdminEmail = "contentadmin@elearn.com";
            var contentAdminUser = await userManager.FindByEmailAsync(contentAdminEmail);

            if (contentAdminUser == null)
            {
                contentAdminUser = new ApplicationUser
                {
                    UserName = contentAdminEmail,
                    Email = contentAdminEmail,
                    EmailConfirmed = true,
                    FullName = "Content Administrator",
                    UserType = SystemRole.ContentAdmin
                };

                var result = await userManager.CreateAsync(contentAdminUser, "ContentAdmin@123456");
                if (result.Succeeded)
                {
                    // Gán role ContentAdmin
                    if (await userManager.IsInRoleAsync(contentAdminUser, "ContentAdmin") == false)
                    {
                        await userManager.AddToRoleAsync(contentAdminUser, "ContentAdmin");
                    }
                    logger.LogInformation("Created content admin user: {Email}", contentAdminEmail);
                }
                else
                {
                    logger.LogError("Failed to create content admin user. Errors: {Errors}", 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger.LogInformation("Content admin user already exists: {Email}", contentAdminEmail);
            }
        }

        public static async Task SeedSuperAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DbSeeder");

            // Kiểm tra xem đã có super admin user chưa
            var superAdminEmail = "superadmin@elearn.com";
            var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);

            if (superAdminUser == null)
            {
                superAdminUser = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    EmailConfirmed = true,
                    FullName = "System Super Administrator",
                    UserType = SystemRole.SystemSuperAdmin
                };

                var result = await userManager.CreateAsync(superAdminUser, "SuperAdmin@123456");
                if (result.Succeeded)
                {
                    // Gán role SystemSuperAdmin
                    if (await userManager.IsInRoleAsync(superAdminUser, "SystemSuperAdmin") == false)
                    {
                        await userManager.AddToRoleAsync(superAdminUser, "SystemSuperAdmin");
                    }
                    logger.LogInformation("Created super admin user: {Email}", superAdminEmail);
                }
                else
                {
                    logger.LogError("Failed to create super admin user. Errors: {Errors}", 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger.LogInformation("Super admin user already exists: {Email}", superAdminEmail);
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

                // Seed admin users sau (cần roles đã tồn tại)
                await SeedSuperAdminUserAsync(serviceProvider);
                await SeedTenantAdminUserAsync(serviceProvider);
                await SeedContentAdminUserAsync(serviceProvider);

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

