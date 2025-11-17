using Elearn.Domain.Entities.Courses;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ILectureContentRepository : IGenericRepository<LectureContent>
    {
        Task<IEnumerable<LectureContent>> GetByLectureIdAsync(Guid lectureId);
        Task<LectureContent?> GetByIdWithLectureAsync(Guid id);
        Task<IEnumerable<LectureContent>> GetByLectureIdOrderedAsync(Guid lectureId);
        Task<bool> LectureContentExistsAsync(Guid id);
        Task<int> GetMaxOrderIndexByLectureIdAsync(Guid lectureId);
        Task ReorderBlocksAsync(Guid lectureId, Dictionary<Guid, int> blockOrderMap);
    }
}

