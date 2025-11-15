using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class SectionRepository : GenericRepository<Section>, ISectionRepository
    {
        public SectionRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Section>> GetByCourseIdAsync(Guid courseId)
        {
            return await _dbSet
                .Where(s => s.CourseId == courseId && !s.IsDeleted)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();
        }

        public async Task<Section?> GetByIdWithLecturesAsync(Guid id)
        {
            return await _dbSet
                .Include(s => s.Lectures.Where(l => !l.IsDeleted).OrderBy(l => l.OrderIndex))
                .ThenInclude(l => l.Resources.Where(r => !r.IsDeleted))
                .Where(s => s.Id == id && !s.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Section>> GetByCourseIdWithLecturesAsync(Guid courseId)
        {
            return await _dbSet
                .Include(s => s.Lectures.Where(l => !l.IsDeleted).OrderBy(l => l.OrderIndex))
                .ThenInclude(l => l.Resources.Where(r => !r.IsDeleted))
                .Where(s => s.CourseId == courseId && !s.IsDeleted)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();
        }

        public async Task<bool> SectionExistsAsync(Guid id)
        {
            return await _dbSet.AnyAsync(s => s.Id == id && !s.IsDeleted);
        }

        public async Task<int> GetMaxOrderIndexByCourseIdAsync(Guid courseId)
        {
            var maxOrder = await _dbSet
                .Where(s => s.CourseId == courseId && !s.IsDeleted)
                .MaxAsync(s => (int?)s.OrderIndex);
            
            return maxOrder ?? -1;
        }
    }
}

