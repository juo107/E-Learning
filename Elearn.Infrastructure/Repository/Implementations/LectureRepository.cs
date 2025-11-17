using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class LectureRepository : GenericRepository<Lecture>, ILectureRepository
    {
        public LectureRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Lecture>> GetBySectionIdAsync(Guid sectionId)
        {
            return await _dbSet
                .Where(l => l.SectionId == sectionId && !l.IsDeleted)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();
        }

        public async Task<Lecture?> GetByIdWithResourcesAsync(Guid id)
        {
            return await _dbSet
                .Include(l => l.Resources.Where(r => !r.IsDeleted))
                .Where(l => l.Id == id && !l.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Lecture>> GetBySectionIdWithResourcesAsync(Guid sectionId)
        {
            return await _dbSet
                .Include(l => l.Resources.Where(r => !r.IsDeleted))
                .Where(l => l.SectionId == sectionId && !l.IsDeleted)
                .OrderBy(l => l.OrderIndex)
                .ToListAsync();
        }

        public async Task<bool> LectureExistsAsync(Guid id)
        {
            return await _dbSet.AnyAsync(l => l.Id == id && !l.IsDeleted);
        }

        public async Task<int> GetMaxOrderIndexBySectionIdAsync(Guid sectionId)
        {
            var maxOrder = await _dbSet
                .Where(l => l.SectionId == sectionId && !l.IsDeleted)
                .MaxAsync(l => (int?)l.OrderIndex);
            
            return maxOrder ?? -1;
        }
    }
}

