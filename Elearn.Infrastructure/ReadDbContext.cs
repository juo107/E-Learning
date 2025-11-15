using Microsoft.EntityFrameworkCore;
using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Data
{
    public class ReadDbContext : DbContext
    {
        public ReadDbContext(DbContextOptions<ReadDbContext> options)
            : base(options)
        {
            // Disable tracking for all queries (tối ưu cho READ)
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CourseMedia> CourseMedias { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
    }
}
