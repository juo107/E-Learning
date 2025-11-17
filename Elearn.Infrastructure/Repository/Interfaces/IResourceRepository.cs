using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IResourceRepository : IGenericRepository<Resource>
    {
        Task<IEnumerable<Resource>> GetByLectureIdAsync(Guid lectureId);
        Task<bool> ResourceExistsAsync(Guid id);
    }
}

