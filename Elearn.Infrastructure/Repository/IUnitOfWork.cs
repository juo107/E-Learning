using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        ICourseRepository Courses { get; }
        ICategoryRepository Categories { get; }
        ICourseMediaRepository CourseMedias { get; }
        Task<int> CompleteAsync();
    }
}
