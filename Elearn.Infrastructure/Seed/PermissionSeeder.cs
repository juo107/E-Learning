using Elearn.Domain.Entities.Identity;
using Elearn.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Elearn.Infrastructure.Seed
{
    public static class PermissionSeeder
    {
        public static async Task SeedPermissionsAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ElearnDbContext>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("PermissionSeeder");

            // ✅ Danh sách quyền cơ bản
            var permissions = new List<ApplicationPermission>
            {
                // --- Course ---
                new ApplicationPermission { Name = "Course.Create", Description = "Tạo khóa học mới", Module = "Course" },
                new ApplicationPermission { Name = "Course.Read", Description = "Xem danh sách khóa học", Module = "Course" },
                new ApplicationPermission { Name = "Course.Update", Description = "Cập nhật khóa học", Module = "Course" },
                new ApplicationPermission { Name = "Course.Delete", Description = "Xóa khóa học", Module = "Course" },

                // --- Category ---
                new ApplicationPermission { Name = "Category.Create", Description = "Tạo danh mục mới", Module = "Category" },
                new ApplicationPermission { Name = "Category.Read", Description = "Xem danh mục", Module = "Category" },
                new ApplicationPermission { Name = "Category.Update", Description = "Cập nhật danh mục", Module = "Category" },
                new ApplicationPermission { Name = "Category.Delete", Description = "Xóa danh mục", Module = "Category" }
            };

            // ✅ Thêm mới nếu chưa có
            foreach (var perm in permissions)
            {
                var exists = await context.ApplicationPermissions.AnyAsync(p => p.Name == perm.Name);
                if (!exists)
                {
                    context.ApplicationPermissions.Add(perm);
                    logger.LogInformation("Added permission: {PermissionName}", perm.Name);
                }
                else
                {
                    logger.LogInformation("Permission already exists: {PermissionName}", perm.Name);
                }
            }

            await context.SaveChangesAsync();

            // ✅ Gán tất cả quyền này cho Admin và SystemSuperAdmin
            var adminRoles = new[] { "Admin", "SystemSuperAdmin" };

            foreach (var roleName in adminRoles)
            {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var allPermissions = await context.ApplicationPermissions.ToListAsync();

                    foreach (var perm in allPermissions)
                    {
                        bool exists = await context.ApplicationRolePermissions
                            .AnyAsync(rp => rp.RoleId == role.Id && rp.PermissionId == perm.Id);

                        if (!exists)
                        {
                            context.ApplicationRolePermissions.Add(new ApplicationRolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = perm.Id
                            });
                            logger.LogInformation("Assigned permission {PermissionName} to role {RoleName}", perm.Name, roleName);
                        }
                    }

                    await context.SaveChangesAsync();
                    logger.LogInformation("Completed assigning permissions to role: {RoleName}", roleName);
                }
                else
                {
                    logger.LogWarning("Role {RoleName} not found, skipping permission assignment", roleName);
                }
            }
        }
    }
}
