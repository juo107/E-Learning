using Microsoft.EntityFrameworkCore;
using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Data
{
    public class ElearnDbContext : DbContext
    {
        public ElearnDbContext(DbContextOptions<ElearnDbContext> options)
            : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
