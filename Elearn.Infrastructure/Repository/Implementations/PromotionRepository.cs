using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class PromotionRepository : GenericRepository<Promotion>, IPromotionRepository
    {
        public PromotionRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Promotion>> GetActivePromotionsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Set<Promotion>()
                .Where(p => !p.IsDeleted 
                    && p.IsActive 
                    && p.StartDate <= now 
                    && p.EndDate >= now
                    && (p.MaxUsageCount == null || p.UsageCount < p.MaxUsageCount))
                .Include(p => p.Category)
                .Include(p => p.PromotionCourses)
                    .ThenInclude(pc => pc.Course)
                .ToListAsync();
        }

        public async Task<IEnumerable<Promotion>> GetPromotionsByCategoryAsync(Guid categoryId)
        {
            var now = DateTime.UtcNow;
            return await _context.Set<Promotion>()
                .Where(p => !p.IsDeleted 
                    && p.IsActive 
                    && p.StartDate <= now 
                    && p.EndDate >= now
                    && (p.CategoryId == categoryId || p.Scope == Domain.Entities.Enums.PromotionScope.All)
                    && (p.MaxUsageCount == null || p.UsageCount < p.MaxUsageCount))
                .Include(p => p.Category)
                .Include(p => p.PromotionCourses)
                    .ThenInclude(pc => pc.Course)
                .ToListAsync();
        }
    }
}

