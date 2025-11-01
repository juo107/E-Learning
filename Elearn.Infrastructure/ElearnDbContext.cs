using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Identity;

namespace Elearn.Infrastructure.Data
{
    public class ElearnDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ElearnDbContext(DbContextOptions<ElearnDbContext> options)
            : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CourseMedia> CourseMedias { get; set; }
        public DbSet<ApplicationPermission> ApplicationPermissions { get; set; }
        public DbSet<ApplicationRolePermission> ApplicationRolePermissions { get; set; }
        public DbSet<InstructorProfile> InstructorProfiles { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure BaseEntity properties
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    // Configure Id as primary key
                    modelBuilder.Entity(entityType.ClrType)
                        .HasKey(nameof(BaseEntity.Id));

                    // Configure CreatedAt as required
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.CreatedAt))
                        .IsRequired();

                    // Configure UpdatedAt as optional
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.UpdatedAt))
                        .IsRequired(false);

                    // Configure IsDeleted as required with default value
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.IsDeleted))
                        .IsRequired()
                        .HasDefaultValue(false);

                    // Configure CreatedBy and UpdatedBy as optional strings
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.CreatedBy))
                        .IsRequired(false)
                        .HasMaxLength(100);

                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.UpdatedBy))
                        .IsRequired(false)
                        .HasMaxLength(100);

                    // Configure DeletedAt and DeletedBy as optional
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.DeletedAt))
                        .IsRequired(false);

                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.DeletedBy))
                        .IsRequired(false)
                        .HasMaxLength(100);
                }
            }

            // Configure Course entity
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.CourseCode).IsRequired().HasMaxLength(50);
                entity.Property(c => c.Title).IsRequired().HasMaxLength(200);
                entity.Property(c => c.Description).HasMaxLength(2000);
                entity.Property(c => c.Price).HasColumnType("decimal(18,2)");
                entity.Property(c => c.FinalPrice).HasColumnType("decimal(18,2)");
                entity.Property(c => c.DurationInMinutes).IsRequired();
                entity.Property(c => c.Level).HasConversion<int>();
                entity.Property(c => c.Language).HasConversion<int>();

                // Configure relationship with Category
                entity.HasOne(c => c.Category)
                    .WithMany(cat => cat.Courses)
                    .HasForeignKey(c => c.CategoryId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                // Indexes for frequent filters/sorts
                entity.HasIndex(c => c.CourseCode).IsUnique();
                entity.HasIndex(c => new { c.CategoryId, c.IsPublished, c.CreatedAt })
                      .HasDatabaseName("IX_Course_Category_IsPublished_CreatedAt");
                entity.HasIndex(c => new { c.IsPublished, c.CreatedAt })
                      .HasDatabaseName("IX_Course_IsPublished_CreatedAt");
                entity.HasIndex(c => new { c.Level, c.Language, c.IsPublished })
                      .HasDatabaseName("IX_Course_Level_Language_IsPublished");
                entity.HasIndex(c => new { c.IsPublished, c.Price })
                      .HasDatabaseName("IX_Course_IsPublished_Price");
                entity.HasIndex(c => c.PublishedAt)
                      .HasDatabaseName("IX_Course_PublishedAt");
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Description).HasMaxLength(500);

                // Configure unique constraint on Name
                entity.HasIndex(c => c.Name).IsUnique();

                // Hierarchy & lookups
                entity.HasIndex(c => c.ParentCategoryId)
                      .HasDatabaseName("IX_Category_ParentCategoryId");
            });

            // Configure CourseMedia entity
            modelBuilder.Entity<CourseMedia>(entity =>
            {
                entity.HasKey(cm => cm.Id);
                entity.Property(cm => cm.MediaType).IsRequired().HasConversion<int>();
                entity.Property(cm => cm.MediaUrl).IsRequired().HasMaxLength(1000);
                entity.Property(cm => cm.ThumbnailUrl).HasMaxLength(1000);
                entity.Property(cm => cm.AltText).HasMaxLength(255);
                entity.Property(cm => cm.Status).IsRequired().HasConversion<int>();

                // Configure relationship with Course
                entity.HasOne(cm => cm.Course)
                    .WithMany(c => c.CourseMedias)
                    .HasForeignKey(cm => cm.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure indexes
                entity.HasIndex(cm => cm.CourseId);
                entity.HasIndex(cm => cm.MediaType);
                entity.HasIndex(cm => cm.Status);
                entity.HasIndex(cm => cm.IsPrimary);
            });

            // Configure ApplicationPermission entity
            modelBuilder.Entity<ApplicationPermission>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(255);
                entity.Property(p => p.Description).HasMaxLength(500);
                entity.Property(p => p.Module).IsRequired().HasMaxLength(100);
                entity.HasIndex(p => p.Name).IsUnique();
            });

            // Configure ApplicationRolePermission (many-to-many join table)
            modelBuilder.Entity<ApplicationRolePermission>(entity =>
            {
                entity.HasKey(rp => new { rp.RoleId, rp.PermissionId });
                
                entity.HasOne(rp => rp.Role)
                    .WithMany(r => r.RolePermissions)
                    .HasForeignKey(rp => rp.RoleId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(rp => rp.Permission)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(rp => rp.PermissionId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(rp => rp.RoleId);
                entity.HasIndex(rp => rp.PermissionId);
            });

            // Configure ApplicationUser
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(u => u.FullName).IsRequired().HasMaxLength(200);
                entity.Property(u => u.AvatarUrl).HasMaxLength(1000);
                entity.Property(u => u.UserType).HasConversion<int>();

                entity.HasOne(u => u.InstructorProfile)
                    .WithOne(ip => ip.ApplicationUser)
                    .HasForeignKey<InstructorProfile>(ip => ip.ApplicationUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.StudentProfile)
                    .WithOne(sp => sp.ApplicationUser)
                    .HasForeignKey<StudentProfile>(sp => sp.ApplicationUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure InstructorProfile
            modelBuilder.Entity<InstructorProfile>(entity =>
            {
                entity.HasKey(ip => ip.Id);
                entity.Property(ip => ip.ApplicationUserId).IsRequired().HasMaxLength(450);
                entity.Property(ip => ip.Bio).HasMaxLength(2000);
                entity.Property(ip => ip.Profession).HasMaxLength(200);
                entity.Property(ip => ip.Rating).HasColumnType("decimal(3,2)").HasDefaultValue(0);

                entity.HasIndex(ip => ip.ApplicationUserId).IsUnique();
            });

            // Configure StudentProfile
            modelBuilder.Entity<StudentProfile>(entity =>
            {
                entity.HasKey(sp => sp.Id);
                entity.Property(sp => sp.ApplicationUserId).IsRequired().HasMaxLength(450);

                entity.HasIndex(sp => sp.ApplicationUserId).IsUnique();
            });
        }
    }
}
