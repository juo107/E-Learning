using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ISectionRepository : IGenericRepository<Section>
    {
        Task<IEnumerable<Section>> GetByCourseIdAsync(Guid courseId);
        Task<Section?> GetByIdWithLecturesAsync(Guid id);
        Task<IEnumerable<Section>> GetByCourseIdWithLecturesAsync(Guid courseId);
        Task<bool> SectionExistsAsync(Guid id);
        Task<int> GetMaxOrderIndexByCourseIdAsync(Guid courseId);
    }
}

