using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ILectureRepository : IGenericRepository<Lecture>
    {
        Task<IEnumerable<Lecture>> GetBySectionIdAsync(Guid sectionId);
        Task<Lecture?> GetByIdWithResourcesAsync(Guid id);
        Task<IEnumerable<Lecture>> GetBySectionIdWithResourcesAsync(Guid sectionId);
        Task<bool> LectureExistsAsync(Guid id);
        Task<int> GetMaxOrderIndexBySectionIdAsync(Guid sectionId);
    }
}

