using Elearn.Domain.Entities.Courses;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class LectureContentRepository : GenericRepository<LectureContent>, ILectureContentRepository
    {
        public LectureContentRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<LectureContent>> GetByLectureIdAsync(Guid lectureId)
        {
            return await _dbSet
                .Where(lc => lc.LectureId == lectureId && !lc.IsDeleted)
                .OrderBy(lc => lc.OrderIndex)
                .ToListAsync();
        }

        public async Task<LectureContent?> GetByIdWithLectureAsync(Guid id)
        {
            return await _dbSet
                .Include(lc => lc.Lecture)
                .Where(lc => lc.Id == id && !lc.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<LectureContent>> GetByLectureIdOrderedAsync(Guid lectureId)
        {
            return await _dbSet
                .Where(lc => lc.LectureId == lectureId && !lc.IsDeleted)
                .OrderBy(lc => lc.OrderIndex)
                .ToListAsync();
        }

        public async Task<bool> LectureContentExistsAsync(Guid id)
        {
            return await _dbSet.AnyAsync(lc => lc.Id == id && !lc.IsDeleted);
        }

        public async Task<int> GetMaxOrderIndexByLectureIdAsync(Guid lectureId)
        {
            var maxOrder = await _dbSet
                .Where(lc => lc.LectureId == lectureId && !lc.IsDeleted)
                .MaxAsync(lc => (int?)lc.OrderIndex);

            return maxOrder ?? -1;
        }

        public async Task ReorderBlocksAsync(Guid lectureId, Dictionary<Guid, int> blockOrderMap)
        {
            var blocks = await _dbSet
                .Where(lc => lc.LectureId == lectureId && !lc.IsDeleted)
                .ToListAsync();

            foreach (var block in blocks)
            {
                if (blockOrderMap.ContainsKey(block.Id))
                {
                    block.OrderIndex = blockOrderMap[block.Id];
                    block.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}

