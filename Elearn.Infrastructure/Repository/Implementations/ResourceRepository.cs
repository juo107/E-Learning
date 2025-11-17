using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class ResourceRepository : GenericRepository<Resource>, IResourceRepository
    {
        public ResourceRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Resource>> GetByLectureIdAsync(Guid lectureId)
        {
            return await _dbSet
                .Where(r => r.LectureId == lectureId && !r.IsDeleted)
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> ResourceExistsAsync(Guid id)
        {
            return await _dbSet.AnyAsync(r => r.Id == id && !r.IsDeleted);
        }
    }
}

