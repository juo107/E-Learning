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
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<PromotionCourse> PromotionCourses { get; set; }
        public DbSet<ApplicationPermission> ApplicationPermissions { get; set; }
        public DbSet<ApplicationRolePermission> ApplicationRolePermissions { get; set; }
        public DbSet<InstructorProfile> InstructorProfiles { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<BlacklistedToken> BlacklistedTokens { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Domain.Entities.Courses.LectureContent> LectureContents { get; set; }

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

            // Configure Promotion entity
            modelBuilder.Entity<Promotion>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Description).HasMaxLength(1000);
                entity.Property(p => p.Type).HasConversion<int>();
                entity.Property(p => p.Scope).HasConversion<int>();
                entity.Property(p => p.Value).HasColumnType("decimal(18,2)");
                entity.Property(p => p.MinimumOrderAmount).HasColumnType("decimal(18,2)");
                entity.Property(p => p.MaximumDiscountAmount).HasColumnType("decimal(18,2)");
                entity.Property(p => p.Code).HasMaxLength(50);
                
                // Configure relationship with Category
                entity.HasOne(p => p.Category)
                    .WithMany()
                    .HasForeignKey(p => p.CategoryId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                // Indexes
                entity.HasIndex(p => p.Code).IsUnique().HasFilter("[Code] IS NOT NULL");
                entity.HasIndex(p => new { p.IsActive, p.StartDate, p.EndDate });
                entity.HasIndex(p => p.StartDate);
                entity.HasIndex(p => p.EndDate);
            });

            // Configure PromotionCourse entity (many-to-many)
            modelBuilder.Entity<PromotionCourse>(entity =>
            {
                entity.HasKey(pc => pc.Id);
                
                entity.HasOne(pc => pc.Promotion)
                    .WithMany(p => p.PromotionCourses)
                    .HasForeignKey(pc => pc.PromotionId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pc => pc.Course)
                    .WithMany()
                    .HasForeignKey(pc => pc.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Unique constraint: một course chỉ có thể có một promotion active cùng lúc (nếu cần)
                entity.HasIndex(pc => new { pc.PromotionId, pc.CourseId }).IsUnique();
                entity.HasIndex(pc => pc.CourseId);
                entity.HasIndex(pc => pc.PromotionId);
            });

            // Configure Payment entity
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.OrderId).IsRequired();
                entity.Property(p => p.Provider).IsRequired().HasConversion<int>();
                entity.Property(p => p.ProviderMethod).IsRequired().HasConversion<int>();
                entity.Property(p => p.Amount).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(p => p.Currency).IsRequired().HasMaxLength(10);
                entity.Property(p => p.Status).IsRequired().HasConversion<int>();
                entity.Property(p => p.AttemptNo).IsRequired().HasDefaultValue(1);
                entity.Property(p => p.ReturnUrl).IsRequired().HasMaxLength(1000);
                entity.Property(p => p.IpnUrl).IsRequired().HasMaxLength(1000);
                entity.Property(p => p.FailureReason).HasMaxLength(1000);
                entity.Property(p => p.PaidAt).IsRequired(false);

                // Configure relationship with Order
                entity.HasOne(p => p.Order)
                    .WithMany(o => o.Payments)
                    .HasForeignKey(p => p.OrderId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(p => p.OrderId);
                entity.HasIndex(p => p.Status);
                entity.HasIndex(p => new { p.OrderId, p.Status });
            });

            // Configure Order entity
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.OrderCode).IsRequired().HasMaxLength(50);
                entity.Property(o => o.UserId).IsRequired().HasMaxLength(450);
                entity.Property(o => o.Status).IsRequired().HasConversion<int>();
                entity.Property(o => o.Currency).IsRequired().HasMaxLength(10);
                entity.Property(o => o.Subtotal).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(o => o.Discount).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(o => o.TotalAmount).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(o => o.ClientIp).HasMaxLength(50);

                // Configure relationship with ApplicationUser
                entity.HasOne(o => o.User)
                    .WithMany()
                    .HasForeignKey(o => o.UserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Unique constraint on OrderCode
                entity.HasIndex(o => o.OrderCode).IsUnique();

                // Indexes
                entity.HasIndex(o => o.UserId);
                entity.HasIndex(o => o.Status);
                entity.HasIndex(o => new { o.UserId, o.Status });
                entity.HasIndex(o => o.CreatedAt);
            });

            // Configure OrderItem entity
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.OrderId).IsRequired();
                entity.Property(oi => oi.CourseId).IsRequired();
                entity.Property(oi => oi.Quantity).IsRequired().HasDefaultValue(1);
                entity.Property(oi => oi.UnitPrice).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.DiscountAmount).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.TotalPrice).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.InstructorId).IsRequired(false).HasMaxLength(450);
                entity.Property(oi => oi.PriceSnapshotJson).HasMaxLength(4000);

                // Configure relationship with Order
                entity.HasOne(oi => oi.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(oi => oi.OrderId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with Course
                entity.HasOne(oi => oi.Course)
                    .WithMany()
                    .HasForeignKey(oi => oi.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure relationship with Instructor (ApplicationUser) - Optional
                entity.HasOne(oi => oi.Instructor)
                    .WithMany()
                    .HasForeignKey(oi => oi.InstructorId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                // Indexes
                entity.HasIndex(oi => oi.OrderId);
                entity.HasIndex(oi => oi.CourseId);
                entity.HasIndex(oi => oi.InstructorId);
            });

            // Configure UserCourse entity
            modelBuilder.Entity<UserCourse>(entity =>
            {
                entity.HasKey(uc => uc.Id);
                entity.Property(uc => uc.UserId).IsRequired().HasMaxLength(450);
                entity.Property(uc => uc.CourseId).IsRequired();
                entity.Property(uc => uc.OrderItemId).IsRequired();
                entity.Property(uc => uc.OrderId).IsRequired();
                entity.Property(uc => uc.PurchasePrice).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(uc => uc.EnrolledAt).IsRequired();
                entity.Property(uc => uc.Status).IsRequired().HasConversion<int>();
                entity.Property(uc => uc.ProgressPercent).IsRequired().HasDefaultValue(0);
                entity.Property(uc => uc.IsCompleted).IsRequired().HasDefaultValue(false);
                entity.Property(uc => uc.Review).HasMaxLength(2000);
                entity.Property(uc => uc.Rating).HasDefaultValue(null);

                // Configure relationship with ApplicationUser
                entity.HasOne(uc => uc.User)
                    .WithMany()
                    .HasForeignKey(uc => uc.UserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure relationship with Course
                entity.HasOne(uc => uc.Course)
                    .WithMany()
                    .HasForeignKey(uc => uc.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure relationship with OrderItem
                entity.HasOne(uc => uc.OrderItem)
                    .WithMany()
                    .HasForeignKey(uc => uc.OrderItemId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure relationship with Order
                entity.HasOne(uc => uc.Order)
                    .WithMany()
                    .HasForeignKey(uc => uc.OrderId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Unique constraint: một user chỉ có thể mua một course một lần (trừ khi bị revoked/expired)
                // Hoặc có thể cho phép mua lại nếu cần, thì bỏ unique constraint này
                entity.HasIndex(uc => new { uc.UserId, uc.CourseId, uc.Status })
                    .HasDatabaseName("IX_UserCourse_User_Course_Status");

                // Indexes for common queries
                entity.HasIndex(uc => uc.UserId);
                entity.HasIndex(uc => uc.CourseId);
                entity.HasIndex(uc => uc.OrderId);
                entity.HasIndex(uc => uc.OrderItemId);
                entity.HasIndex(uc => uc.Status);
                entity.HasIndex(uc => uc.EnrolledAt);
                entity.HasIndex(uc => new { uc.UserId, uc.Status });
                entity.HasIndex(uc => new { uc.CourseId, uc.Status });
            });

            // Configure CartItem entity
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => ci.Id);
                entity.Property(ci => ci.UserId).HasMaxLength(450);
                entity.Property(ci => ci.SessionId).HasMaxLength(200);
                entity.Property(ci => ci.CourseId).IsRequired();
                entity.Property(ci => ci.PriceAtAdd).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(ci => ci.AppliedCouponCode).HasMaxLength(50);
                entity.Property(ci => ci.Status).IsRequired().HasConversion<int>();
                entity.Property(ci => ci.AddedAt).IsRequired();

                // Configure relationship with ApplicationUser (optional)
                entity.HasOne(ci => ci.User)
                    .WithMany()
                    .HasForeignKey(ci => ci.UserId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with Course
                entity.HasOne(ci => ci.Course)
                    .WithMany()
                    .HasForeignKey(ci => ci.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes for common queries
                entity.HasIndex(ci => ci.UserId).HasFilter("[UserId] IS NOT NULL");
                entity.HasIndex(ci => ci.SessionId).HasFilter("[SessionId] IS NOT NULL");
                entity.HasIndex(ci => ci.CourseId);
                entity.HasIndex(ci => ci.Status);
                entity.HasIndex(ci => new { ci.UserId, ci.Status }).HasFilter("[UserId] IS NOT NULL");
                entity.HasIndex(ci => new { ci.SessionId, ci.Status }).HasFilter("[SessionId] IS NOT NULL");
                entity.HasIndex(ci => new { ci.CourseId, ci.Status });
                
                // Unique constraint: một user/session chỉ có thể có một course active trong giỏ
                entity.HasIndex(ci => new { ci.UserId, ci.CourseId, ci.Status })
                    .HasDatabaseName("IX_CartItem_User_Course_Status")
                    .HasFilter("[UserId] IS NOT NULL AND [Status] = 0");
                entity.HasIndex(ci => new { ci.SessionId, ci.CourseId, ci.Status })
                    .HasDatabaseName("IX_CartItem_Session_Course_Status")
                    .HasFilter("[SessionId] IS NOT NULL AND [Status] = 0");
            });

            // Configure Section entity
            modelBuilder.Entity<Section>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Title).IsRequired().HasMaxLength(255);
                entity.Property(s => s.Description).HasMaxLength(1000);
                entity.Property(s => s.OrderIndex).IsRequired();
                entity.Property(s => s.IsPreviewable).IsRequired().HasDefaultValue(false);

                // Configure relationship with Course
                entity.HasOne(s => s.Course)
                    .WithMany(c => c.Sections)
                    .HasForeignKey(s => s.CourseId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(s => s.CourseId);
                entity.HasIndex(s => new { s.CourseId, s.OrderIndex });
            });

            // Configure Lecture entity
            modelBuilder.Entity<Lecture>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Title).IsRequired().HasMaxLength(255);
                entity.Property(l => l.Type).IsRequired().HasConversion<int>();
                entity.Property(l => l.VideoUrl).HasMaxLength(1000);
                entity.Property(l => l.OrderIndex).IsRequired();
                entity.Property(l => l.IsPreviewable).IsRequired().HasDefaultValue(false);

                // Configure relationship with Section
                entity.HasOne(l => l.Section)
                    .WithMany(s => s.Lectures)
                    .HasForeignKey(l => l.SectionId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(l => l.SectionId);
                entity.HasIndex(l => new { l.SectionId, l.OrderIndex });
                entity.HasIndex(l => l.Type);
            });

            // Configure Resource entity
            modelBuilder.Entity<Resource>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.FileName).IsRequired().HasMaxLength(500);
                entity.Property(r => r.FileUrl).IsRequired().HasMaxLength(1000);
                entity.Property(r => r.ResourceType).IsRequired().HasConversion<int>();

                // Configure relationship with Lecture
                entity.HasOne(r => r.Lecture)
                    .WithMany(l => l.Resources)
                    .HasForeignKey(r => r.LectureId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(r => r.LectureId);
                entity.HasIndex(r => r.ResourceType);
            });

            // Configure LectureContent entity
            modelBuilder.Entity<Domain.Entities.Courses.LectureContent>(entity =>
            {
                entity.HasKey(lc => lc.Id);
                entity.Property(lc => lc.BlockType).IsRequired().HasConversion<int>();
                entity.Property(lc => lc.DataJson).IsRequired().HasColumnType("nvarchar(max)");
                entity.Property(lc => lc.OrderIndex).IsRequired();

                // Configure relationship with Lecture
                entity.HasOne(lc => lc.Lecture)
                    .WithMany(l => l.LectureContents)
                    .HasForeignKey(lc => lc.LectureId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(lc => lc.LectureId);
                entity.HasIndex(lc => new { lc.LectureId, lc.OrderIndex });
                entity.HasIndex(lc => lc.BlockType);
            });
        }
    }
}
